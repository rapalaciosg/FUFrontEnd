<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="provinceSelect" :placeholder="'Filtrar por provincia'" v-model="filterValue"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="companiesList" :fields="headersCompaniesListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de compañías" :headers="headersCompanyTable" :data="companiesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal">
      <template v-slot:button>
        <Button class="h-[40px]" text="Crear compañía" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <DetailsCompanyModal v-if="isModalDetailsOpen" title="Detalles de la compañia" :data="companyDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateCompanyModal v-if="isModalCreateOpen" title="Crear compañia" @company-created="loadCompanies()" @close-modal="isModalCreateOpen = false"/>
    <EditCompanyModal v-if="isModalEditOpen" title="Editar comapañia" :data="companyDetails" @close-modal="isModalEditOpen = false" @company-updated="loadCompanies()"/>
    <DeleteCompanyModal v-if="isModalDeleteOpen" title="Eliminar compañia" :company="companyDetails" @close-modal="isModalDeleteOpen = false" @company-deleted="loadCompanies()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { headersCompanyTable } from "@/constant/administration/company/constantCompany.js";

import CreateCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/CreateCompanyModal.vue";
import DetailsCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DetailsCompanyModal.vue";
import DeleteCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DeleteCompanyModal.vue";
import EditCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/EditCompanyModal.vue";

import { GET_ALL_COMPANIES, GET_ALL_COMPANIES_BY_PROVINCE } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_PROVINCES } from "@/services/catalogs/provinces/provincesGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateCompanyModal,
    DetailsCompanyModal,
    DeleteCompanyModal,
    EditCompanyModal,
  },
  data() {
    return {
      headersCompanyTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
    };
  },
  setup() {

    // Variables declaration

    let companyDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    let provinceSelect = ref([]);

    let headersCompaniesListExport = ref({});

    let filterValue = ref(null);

    let companiesList = ref([]);

    // Apollo variables

    const variablesCompaniesByProvince = reactive({ id: "" });

    // Apollo queries initialization

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetCompaniesByProvince = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES_BY_PROVINCE, variablesCompaniesByProvince));

    const queryGetProvinces = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PROVINCES));

    // Apollo fetching data

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const companiesByProvince = computed(() => queryGetCompaniesByProvince.result.value?.srvCompaniesByProvinceId ?? []);

    const provinces = computed(() => queryGetProvinces.result.value?.srvProvince ?? []);

    // Apollo lazy functions

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    const loadCompaniesByProvince = () => queryGetCompaniesByProvince.load() || queryGetCompaniesByProvince.refetch();

    const loadProvinces = () => queryGetProvinces.load() || queryGetProvinces.refetch();

    // Mounted function

    onMounted(() => {
      loadProvinces();
      loadCompanies();
      headersCompaniesListExport.value = formatHeadersListExport(headersCompanyTable);
    })

    // Watchers

    watch(() => provinces.value, (newValue) => { provinceSelect.value = formatProvinceSelect(newValue) }, { deep: true });

    watch(() => companies.value, (newValue) => { companiesList.value = newValue }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (!newValue) {
        companiesList.value = companies.value;
      } else {
        variablesCompaniesByProvince.id = newValue.value;
        loadCompaniesByProvince();
      }
    }, { deep: true });

    watch(() => companiesByProvince.value, (newValue) => { companiesList.value = newValue }, { deep: true });

    // Format functions

    const formatHeadersListExport = (data) => {
      let array = new Map();
      for (let index = 0; index < data.length; index++) {
        array.set(data[index].label, data[index].field);
      }
      let valueFormatted = Array.from(array).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

      delete valueFormatted.Acciones;

      return valueFormatted;
    }

    const formatProvinceSelect = (data) => data.map((item) => ({ value: item.provinceId, label: item.name }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        companyDetails.value = value.row;

        companyDetails.value['companyTypeSelect'] = { value: value.row.companyType.companyTypeId, label: value.row.companyType.name };

        companyDetails.value['provinceSelect'] = { value: value.row.province.provinceId, label: value.row.province.name };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "delete") isModalDeleteOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      loadCompanies,
      companyDetails,
      isModalEditOpen,
      isModalCreateOpen,
      isModalDetailsOpen,
      isModalDeleteOpen,
      filterValue,
      companiesList,
      headersCompaniesListExport,
      provinceSelect,
    };
  },
};
</script>
<style></style>
