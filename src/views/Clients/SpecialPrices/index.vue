<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="filters" placeholder="Seleccione una tipo de filtro" v-model="filterBy" :clearable="(filterBy) ? true : false"/>
        <VueSelect :options="filtersOptions" :placeholder="'Seleccione una opción'" v-model="filterValue" :clearable="(filterValue) ? true : false" :disabled="(filterBy) ? false : true"/>
        <VueSelect v-if="filterBy && filterBy.value === 'routeAndCompany'" :options="companiesSelect" :placeholder="'Seleccione una compañía'" v-model="filterValueCompany" :clearable="(filterValueCompany) ? true : false" :disabled="(filterValue) ? false : true"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="specialPricesList" :fields="headersSpecialPriceListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Precios especiales" :headers="headersSpecialPricesTable" :data="specialPricesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <Button class="h-[40px]" text="Crear precio" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <CreateSpecialPriceModal v-if="isModalCreateOpen" title="Crear precio especial" @special-price-created="reloadSpecialPrices()" @close-modal="isModalCreateOpen = false" />
    <DetailsSpecialPriceModal v-if="isModalDetailsOpen" title="Detalles de producto" :data="specialPriceDetails" @close-modal="isModalDetailsOpen = false"/>
    <EditSpecialPriceModal v-if="isModalEditOpen" title="Editar precio especial" :data="specialPriceDetails" @close-modal="isModalEditOpen = false" @special-price-updated="reloadSpecialPrices()"/>
    <EnableDisableSpecialPriceModal v-if="isModalEnableDisableOpen" :title="(specialPriceDetails.active) ? 'Deshabilitar' : 'Habilitar'" :action="(specialPriceDetails.active) ? 'Deshabilitar' : 'Habilitar'" :specialPrice="specialPriceDetails" @close-modal="isModalEnableDisableOpen = false" @special-price-updated="reloadSpecialPrices()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, onBeforeMount, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";

import { headersSpecialPricesTable } from "@/constant/clients/specialPrices/constantSpecialPrices.js";

import DetailsSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/DetailsSpecialPriceModal.vue";
import CreateSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/CreateSpecialPriceModal.vue";
import EditSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/EditSpecialPriceModal.vue";
import EnableDisableSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/EnableDisableSpecialPriceModal.vue";

import keycloak from "@/security/KeycloakService.js";

import { GET_ALL_SPECIAL_PRICES, GET_ALL_SPECIAL_PRICES_BY_CUSTOMER, GET_ALL_SPECIAL_PRICES_BY_BRANCH_OFFICE, GET_ALL_SPECIAL_PRICES_BY_PRODUCT, GET_ALL_SPECIAL_PRICES_BY_ROUTE_AND_COMPANY } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_CUSTOMERS } from "@/services/clients/customers/customersGraphql.js";
import { GET_ALL_PRODUCTS } from "@/services/inventory/products/productsGraphql.js";
import { GET_ROUTES_BY_USER_ID } from "@/services/routes/routes/routesGraphql.js";
import { GET_ALL_COMPANIES_BY_ROUTE } from "@/services/administration/company/companyGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    Button,
    VueSelect,
    DetailsSpecialPriceModal,
    CreateSpecialPriceModal,
    EditSpecialPriceModal,
    EnableDisableSpecialPriceModal
},
  data() {
    return {
      headersSpecialPricesTable,
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
        { label: 'Cliente', value: 'customer' },
        { label: 'Sucursal', value: 'branchOffice' },
        { label: 'Producto', value: 'product' },
        { label: 'Ruta y compañía', value: 'routeAndCompany' },
      ]
    };
  },
  setup() {

    // Variables declaration

    let specialPriceDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let headersSpecialPriceListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);
    let filterValueCompany = ref(null);

    let filterSelect = ref("");
    let filtersOptions = ref([]);

    let customerSelect = ref([]);
    let branchOfficeSelect = ref([]);
    let productSelect = ref([]);
    let routeSelect = ref([]);
    let companiesSelect = ref([]);

    let listSpecialPricesByCustomer = ref([]);
    let listSpecialPricesByBranchOffice = ref([]);
    let listSpecialPricesByProduct = ref([]);
    let listSpecialPricesByRouteAndCompany = ref([]);

    let specialPricesList = ref([]);

    // Apollo variables

    const variablesRoutesByUserId = reactive({ userId: "" });
    const variablesCompaniesByRoute = reactive({ routeId: 0 });
    const variablesSpecialPricesByCustomer = reactive({ customerId: 0 });
    const variablesSpecialPricesByBranchOffice = reactive({ branchId: 0 });
    const variablesSpecialPricesByProduct = reactive({ productId: 0 });
    const variablesSpecialPricesByRouteAndCompany = reactive({ routeId: 0, companyId: 0 });

    // Apollo queries initialization

    const queryGetSpecialPrices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES));

    const queryGetSpecialPricesByCustomer = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES_BY_CUSTOMER, variablesSpecialPricesByCustomer));

    const queryGetSpecialPricesByBranchOffice = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES_BY_BRANCH_OFFICE, variablesSpecialPricesByBranchOffice));

    const queryGetSpecialPricesByProduct = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES_BY_PRODUCT, variablesSpecialPricesByProduct));

    const queryGetSpecialPricesByRouteAndCompany = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES_BY_ROUTE_AND_COMPANY, variablesSpecialPricesByRouteAndCompany));

    const queryGetCustomers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CUSTOMERS));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetProducts = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PRODUCTS));

    const queryGetRoutes = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ROUTES_BY_USER_ID, variablesRoutesByUserId));

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES_BY_ROUTE, variablesCompaniesByRoute));

    // Apollo fetching data

    const specialPrices = computed(() => queryGetSpecialPrices.result.value?.srvSpecialPrice ?? []);

    const specialPricesByCustomer = computed(() => queryGetSpecialPricesByCustomer.result.value?.srvSpecialPriceByCustomerId ?? []);

    const specialPricesByBranchOffice = computed(() => queryGetSpecialPricesByBranchOffice.result.value?.srvSpecialPriceByBranchId ?? []);

    const specialPricesByProduct = computed(() => queryGetSpecialPricesByProduct.result.value?.srvSpecialPriceByProductId ?? []);

    const specialPricesByRouteAndCompany = computed(() => queryGetSpecialPricesByRouteAndCompany.result.value?.srvSpecialPriceByRouteIdAndCompanyId ?? []);

    const customers = computed(() => queryGetCustomers.result.value?.srvCustomer ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const products = computed(() => queryGetProducts.result.value?.srvProducts ?? []);

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutesByUserId ?? []);

    const companies = computed(() => queryGetCompanies.result.value?.srvCompaniesByRouteId ?? []);

    // Apollo lazy functions

    const loadSpecialPrices = () => queryGetSpecialPrices.load() || queryGetSpecialPrices.refetch();

    const loadSpecialPricesByCustomer = () => queryGetSpecialPricesByCustomer.load() || queryGetSpecialPricesByCustomer.refetch();

    const loadSpecialPricesByBranchOffice = () => queryGetSpecialPricesByBranchOffice.load() || queryGetSpecialPricesByBranchOffice.refetch();

    const loadSpecialPricesByProduct = () => queryGetSpecialPricesByProduct.load() || queryGetSpecialPricesByProduct.refetch();

    const loadSpecialPricesByRouteAndCompany = () => queryGetSpecialPricesByRouteAndCompany.load() || queryGetSpecialPricesByRouteAndCompany.refetch();

    const loadCustomers = () => queryGetCustomers.load() || queryGetCustomers.refetch();

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadProducts = () => queryGetProducts.load() || queryGetProducts.refetch();

    const loadRoutes = () => queryGetRoutes.load() || queryGetRoutes.refetch();

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    // Before mounted function

    onBeforeMount(() => {
      variablesRoutesByUserId.userId = keycloak.subject
    });

    // Mounted function

    onMounted(() => {
      loadSpecialPrices();
      loadCustomers();
      loadProducts();
      loadBranchOffices();
      loadRoutes();
      headersSpecialPriceListExport.value = formatHeadersListExport(headersSpecialPricesTable);
    });

    // Watchers

    watch(() => customers.value, (newValue) => { customerSelect.value = formatCustomerSelect(newValue) }, { deep: true });
    watch(() => branchOffices.value, (newValue) => { branchOfficeSelect.value = formatBranchOfficesSelect(newValue) }, { deep: true });
    watch(() => products.value, (newValue) => { productSelect.value = formatProductSelect(newValue) }, { deep: true });
    watch(() => routes.value, (newValue) => { routeSelect.value = formatRoutesSelect(newValue) }, { deep: true });
    watch(() => companies.value, (newValue) => { companiesSelect.value = formatCompaniesSelect(newValue) }, { deep: true });

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;

      if (newValue && newValue.value === 'customer') filtersOptions.value = customerSelect.value;
      else if (newValue && newValue.value === 'branchOffice') filtersOptions.value = branchOfficeSelect.value;
      else if (newValue && newValue.value === 'product') filtersOptions.value = productSelect.value;
      else filtersOptions.value = routeSelect.value;
    }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'customer') {
        variablesSpecialPricesByCustomer.customerId = newValue.value;
        loadSpecialPricesByCustomer();
        specialPricesList.value = specialPricesByCustomer.value;
      } else if (newValue && filterBy.value?.value === 'branchOffice') {
        variablesSpecialPricesByBranchOffice.branchId = newValue.value;
        loadSpecialPricesByBranchOffice();
        specialPricesList.value = specialPricesByBranchOffice.value;
      } else if (newValue && filterBy.value?.value === 'product') {
        variablesSpecialPricesByProduct.productId = newValue.value;
        loadSpecialPricesByProduct();
        specialPricesList.value = specialPricesByProduct.value;
      } else if (newValue && filterBy.value?.value === 'routeAndCompany') {
        variablesCompaniesByRoute.routeId = newValue.value;
        variablesSpecialPricesByRouteAndCompany.routeId = newValue.value;
        loadCompanies();
      }  else if (!newValue) {
        specialPricesList.value = [];
      };
    }, { deep: true });

    watch(() => filterValueCompany.value, (newValue) => {
      if (!newValue) {
        specialPricesList.value = [];
      }  else {
        variablesSpecialPricesByRouteAndCompany.companyId = newValue.value;
        loadSpecialPricesByRouteAndCompany();
        specialPricesList.value = specialPricesByRouteAndCompany.value;
      };
    }, { deep: true });

    watch(() => specialPricesByCustomer.value, (newValue) => {
      listSpecialPricesByCustomer.value = newValue;
      specialPricesList.value = listSpecialPricesByCustomer.value;
    }, { deep: true });

    watch(() => specialPricesByBranchOffice.value, (newValue) => {
      listSpecialPricesByBranchOffice.value = newValue;
      specialPricesList.value = listSpecialPricesByBranchOffice.value;
    }, { deep: true });

    watch(() => specialPricesByProduct.value, (newValue) => {
      listSpecialPricesByProduct.value = newValue;
      specialPricesList.value = listSpecialPricesByProduct.value;
    }, { deep: true });

    watch(() => specialPricesByRouteAndCompany.value, (newValue) => {
      listSpecialPricesByRouteAndCompany.value = newValue;
      specialPricesList.value = listSpecialPricesByRouteAndCompany.value;
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

    const formatCustomerSelect = (data) => data.map((item) => ({ value: item.customerId, label: `${item.name} ${item.lastName}` }));

    const formatBranchOfficesSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

    const formatProductSelect = (data) => data.map((item) => ({ value: item.productId, label: item.name }));

    const formatRoutesSelect = (data) => data.map((item) => ({ value: item.routeId, label: item.code }));

    const formatCompaniesSelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    // Toggle function

    const toggleModal = (value) => {
      if (value) {
        specialPriceDetails.value = value.row;

        specialPriceDetails.value['customerSelect'] = { value: value.row.customer.customerId, label: `${value.row.customer.name} ${value.row.customer.lastName}` };

        specialPriceDetails.value['branchOfficeSelect'] = { value: value.row.branchOffice.branchOfficeId, label: value.row.branchOffice.branchOfficeName };

        specialPriceDetails.value['productSelect'] = { value: value.row.product.productId, label: value.row.product.name };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "enable/disable") isModalEnableDisableOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Reload function

    const reloadSpecialPrices = () => {
      loadSpecialPricesByCustomer() || loadSpecialPricesByBranchOffice() || loadSpecialPricesByProduct();
    }

    // Returning values

    return {
      toggleModal,
      reloadSpecialPrices,
      specialPriceDetails,
      isModalCreateOpen,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      filterSelect,
      filterBy,
      filterValue,
      filterValueCompany,
      filtersOptions,
      specialPricesList,
      headersSpecialPriceListExport,
      routeSelect,
      companiesSelect,
    };
  },
};
</script>
<style></style>
