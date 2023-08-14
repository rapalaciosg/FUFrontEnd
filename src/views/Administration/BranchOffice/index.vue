<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="filters" placeholder="Seleccione una tipo de filtro" v-model="filterBy" :clearable="(filterBy) ? true : false"/>
        <VueSelect :options="filtersOptions" :placeholder="'Seleccione una opción'" v-model="filterValue" :clearable="(filterValue) ? true : false" :disabled="(filterBy) ? false : true"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="branchOfficesList" :fields="headersBranchOfficesListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Sucursales" :headers="headersBranchOfficesTable" :data="branchOfficesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <Button class="h-[40px]" text="Crear sucursal" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <DetailsBranchOffice v-if="isModalDetailsOpen" title="Detalles de sucursal" :data="branchOfficeDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateBranchOfficeModal v-if="isModalCreateOpen" title="Crear sucursal" @close-modal="isModalCreateOpen = false" @branch-office-created="loadBranchOffices()"/>
    <EditBranchOfficeModal v-if="isModalEditOpen" title="Editar sucursal" :data="branchOfficeDetails" @close-modal="isModalEditOpen = false" @branch-office-updated="loadBranchOffices()"/>
    <EnableDisableBranchOfficeModal v-if="isModalEnableDisableOpen" :title="(branchOfficeDetails.active) ? 'Deshabilitar' : 'Habilitar'" :action="(branchOfficeDetails.active) ? 'Deshabilitar' : 'Habilitar'" :branchOffice="branchOfficeDetails" @close-modal="isModalEnableDisableOpen = false" @branch-office-updated="loadBranchOffices()"/>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted, onBeforeMount } from "vue";

import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";

import { headersBranchOfficesTable } from "@/constant/administration/branchOffice/constantBranchOffice.js";

import DetailsBranchOffice from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/DetailsBranchOffice.vue";
import CreateBranchOfficeModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/CreateBranchOfficeModal.vue";
import EditBranchOfficeModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/EditBranchOfficeModal.vue";
import EnableDisableBranchOfficeModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/EnableDisableBranchOfficeModal.vue";

import { GET_ALL_BRANCH_OFFICES, GET_BRANCH_OFFICES_BY_COMPANY, GET_BRANCH_OFFICES_BY_RUC } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    VueSelect,
    Card,
    Button,
    CreateBranchOfficeModal,
    DetailsBranchOffice,
    EnableDisableBranchOfficeModal,
    EditBranchOfficeModal,
  },
  data() {
    return {
      headersBranchOfficesTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
      status: [
        { label: 'Habilitado', value: 'enabled' },
        { label: 'Deshabilitado', value: 'disabled' },
      ],
      filters: [
        { label: 'Compañía', value: 'company' },
        { label: 'Ruc', value: 'ruc' },
      ]
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let branchOfficeDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let headersBranchOfficesListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filterSelect = ref("");
    let filtersOptions = ref([]);

    let companiesSelect = ref([]);
    let rucSelect = ref([]);

    let listBranchOfficesByCompany = ref([]);
    let lsitBranchOfficeByRuc = ref([]);

    let branchOfficesList = ref([]);

    // Apollo variables

    const variablesBranchOfficesByCompany = reactive({ id: 0 });
    const variablesBranchOfficesByRuc = reactive({ ruc: "" });

    // Apollo queries initialization

    const queryGetBranchOfficesByCompany = provideApolloClient(apolloClient)(() => useLazyQuery(GET_BRANCH_OFFICES_BY_COMPANY, variablesBranchOfficesByCompany));

    const queryGetBranchOfficesByRuc = provideApolloClient(apolloClient)(() => useLazyQuery(GET_BRANCH_OFFICES_BY_RUC, variablesBranchOfficesByRuc));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    // Apollo fetching data

    const branchOfficesByCompany = computed(() => queryGetBranchOfficesByCompany.result.value?.srvBranchOfficeByCompany ?? []);

    const branchOfficesByRuc = computed(() => queryGetBranchOfficesByRuc.result.value?.srvBranchOfficeRUC ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    // Apollo lazy functions

    const loadBranchOfficesByCompany = () => queryGetBranchOfficesByCompany.load() || queryGetBranchOfficesByCompany.refetch();

    const loadBranchOfficesByRuc = () => queryGetBranchOfficesByRuc.load() || queryGetBranchOfficesByRuc.refetch();

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    // Before mounted function

    onBeforeMount(() => {
      loadBranchOffices();
    });

    // Mounted function

    onMounted(() => {
      loadCompanies();
      headersBranchOfficesListExport.value = formatHeadersListExport(headersBranchOfficesTable);
    });

    // Watchers

    watch(() => branchOffices.value, (newValue) => {
      rucSelect.value = formatRucSelect(newValue);
      branchOfficesList.value = newValue;
    }, { deep: true });

    watch(() => companies.value, (newValue) => { companiesSelect.value = formatCompaniesSelect(newValue) }, { deep: true });

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;

      if (newValue && newValue.value === 'company') filtersOptions.value = companiesSelect.value;
      else filtersOptions.value = rucSelect.value;
    }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'company') {
        variablesBranchOfficesByCompany.id = newValue.value;
        loadBranchOfficesByCompany();
        branchOfficesList.value = branchOfficesByCompany.value;
      } else if (newValue && filterBy.value?.value === 'ruc') {
        variablesBranchOfficesByRuc.ruc = newValue.value;
        loadBranchOfficesByRuc();
      } else if (!newValue) {
        branchOfficesList.value = branchOffices.value;
      };
    }, { deep: true });

    watch(() => branchOfficesByCompany.value, (newValue) => {
      listBranchOfficesByCompany.value = newValue;
      branchOfficesList.value = listBranchOfficesByCompany.value;
    }, { deep: true });

    watch(() => branchOfficesByRuc.value, (newValue) => {
      lsitBranchOfficeByRuc.value = [];
      lsitBranchOfficeByRuc.value.push(newValue);
      branchOfficesList.value = lsitBranchOfficeByRuc.value;
    }, { deep: true });

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

    const formatCompaniesSelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name,}));

    const formatRucSelect = (data) => data.map((item) => ({ value: item.ruc, label: item.ruc }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        branchOfficeDetails.value = value.row;

        branchOfficeDetails.value['companySelect'] = { value: value.row.company.companyId, label: value.row.company.name };

        branchOfficeDetails.value['provinceSelect'] = { value: value.row.province.provinceId, label: value.row.province.name };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "enable/disable") isModalEnableDisableOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      loadBranchOffices,
      branchOfficeDetails,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      isModalCreateOpen,
      filterSelect,
      filterBy,
      filterValue,
      filtersOptions,
      branchOfficesList,
      headersBranchOfficesListExport,
    };
  },
};
</script>
<style></style>
