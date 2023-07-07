<template>
  <div class="space-y-5">
    <Card title="Precios Especiales">
      <div class="grid grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Ruta o Camión" v-model="route" />
        <VueSelect :options="companiesFormatted" placeholder="Empresa" v-model="company" :disabled="route === ''" />
        <div class="col-span-2 2xl:col-span-1 grid grid-cols-2 gap-x-5">
          <CreateSpecialPriceModal title="Registrar precio" btnClass="btn-success" />
          <download-excel class="btn-info rounded pt-2 text-center" :data="specialPrices" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersSpecialPricesTable" :data="specialPrices" :actions="actions" @open-modal="toggleModal" />
    <EditSpecialPriceModal title="Editar precio especial" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" :data="specialPrice" @price-edited="refresSpecialPriceList" />
  </div>
</template>
<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import CreateSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/CreateSpecialPriceModal.vue";
import EditSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/EditSpecialPriceModal.vue";
import { headersSpecialPricesTable } from "@/constant/clients/specialPrices/constantSpecialPrices.js";

import { GET_COMPANIES_QUERY, GET_ALL_SPECIAL_PRICES } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    CreateSpecialPriceModal,
    EditSpecialPriceModal,
  },
  data() {
    return {
      headersSpecialPricesTable,
      actions: [
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
      ],
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML03", label: "ML04" },
        { value: "ML03", label: "ML05" },
        { value: "ML03", label: "ML" },
      ],
    };
  },
  setup(props) {
    const variablesCompanies = reactive({ route: "" });
    const variablesSpecialPrices = reactive({ route: "", company: "" });

    let companiesFormatted = ref([]);
    let specialPrice = ref({});

    let isModalOpen = ref(false);
    const route = ref("");
    const company = ref("");

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_COMPANIES_QUERY, variablesCompanies));
    const queryGetSpecialPrices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES, variablesSpecialPrices));

    const companies = computed(() => queryGetCompanies.result.value?.srvEmpresa ?? []);
    const specialPrices = computed(() => queryGetSpecialPrices.result.value?.srvClientAjutePrecioClienteSucursal ?? []);

    const formatValuesSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.empresaID, label: item.nombre }));
      return valueFormated;
    }

    watch(() => companies, (newValue) => {
      companiesFormatted.value = formatValuesSelect(companies)
    }, { deep: true })

    watch(() => route, newValue => {
      variablesCompanies.route = newValue.value.value;
      variablesSpecialPrices.route = newValue.value.value;
      queryGetCompanies.load();

      if (variablesSpecialPrices.company !== "") {
        loadSpecialPrices()
      }
    }, { deep: true })

    watch(() => company, newValue => {
      variablesSpecialPrices.company = newValue.value.value;
      loadSpecialPrices()
    }, { deep: true })

    const loadSpecialPrices = () => {
      queryGetSpecialPrices.load() || queryGetSpecialPrices.refetch()
    }

    const refresSpecialPriceList = (value) => {
      variablesSpecialPrices.route = value.truckId
      variablesSpecialPrices.company = value.company
      isModalOpen.value = false
    }

    const toggleModal = (value) => {
      if(value.action === 'edit');
        isModalOpen.value = true

      specialPrice.value = value.row;
    }

    return { route, company, companiesFormatted, specialPrices, toggleModal, isModalOpen, specialPrice, refresSpecialPriceList };
  }
};
</script>
<style></style>
