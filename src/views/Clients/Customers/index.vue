<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="routesSelect" :placeholder="'Seleccione una ruta'" v-model="filterValue" :clearable="(filterValue) ? true : false"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="customersList" :fields="headersCustomersListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de clientes" :headers="headersCustomersTable" :data="customersList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal">
      <template v-slot:button>
        <Button class="h-[40px]" text="Crear cliente" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <DetailsCustomerModal v-if="isModalDetailsOpen" title="Detalles de cliente" :data="customerDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateCustomerModal v-if="isModalCreateOpen" title="Crear cliente" @customer-created="reLoadCustomers()" @close-modal="isModalCreateOpen = false"/>
    <EditCustomerModal v-if="isModalEditOpen" title="Editar cliente" :data="customerDetails" @close-modal="isModalEditOpen = false" @customer-updated="loadCustomersByRoutes()"/>
    <EnableDisableCustomerModal v-if="isModalEnableDisableOpen" :title="(customerDetails.active) ? 'Deshabilitar' : 'Habilitar'" :action="(customerDetails.active) ? 'Deshabilitar' : 'Habilitar'" :customer="customerDetails" @close-modal="isModalEnableDisableOpen = false" @customer-updated="loadCustomersByRoutes()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, onBeforeMount, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";

import { headersCustomersTable } from "@/constant/clients/customers/constantCustomers.js";

import DetailsCustomerModal from "@/components/WebFrontendComponents/Modals/Clients/Customers/DetailsCustomerModal.vue";
import EnableDisableCustomerModal from "@/components/WebFrontendComponents/Modals/Clients/Customers/EnableDisableCustomerModal.vue";
import CreateCustomerModal from "@/components/WebFrontendComponents/Modals/Clients/Customers/CreateCustomerModal.vue";
import EditCustomerModal from "@/components/WebFrontendComponents/Modals/Clients/Customers/EditCustomerModal.vue";

import keycloak from "@/security/KeycloakService.js";

import { GET_ALL_CUSTOMERS, GET_CUSTOMERS_BY_ROUTE } from "@/services/clients/customers/customersGraphql.js";
import { GET_ROUTES_BY_USER_ID } from "@/services/routes/routes/routesGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateCustomerModal,
    DetailsCustomerModal,
    EnableDisableCustomerModal,
    EditCustomerModal,
  },
  data() {
    return {
      headersCustomersTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let customerDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let routesSelect = ref([]);

    let filterValue = ref(null);

    let customersList = ref([]);

    let headersCustomersListExport = ref({});

    // Apollo variables

    const variablesRoutesByUserId = reactive({ userId: "" });
    const variablesCustomersByRoute = reactive({ id: 0 });

    // Apollo queries initialization

    const queryGetCustomers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CUSTOMERS));

    const queryGetRoutes = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ROUTES_BY_USER_ID, variablesRoutesByUserId));

    const queryGetCustomersByRoute = provideApolloClient(apolloClient)(() => useLazyQuery(GET_CUSTOMERS_BY_ROUTE, variablesCustomersByRoute));

    // Apollo fetching data

    const customers = computed(() => queryGetCustomers.result.value?.srvCustomer ?? []);

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutesByUserId ?? []);

    const customersByRoute = computed(() => queryGetCustomersByRoute.result.value?.srvCustomerByRouteId ?? []);

    // Apollo lazy functions

    const loadCustomers = () => queryGetCustomers.load() || queryGetCustomers.refetch();

    const loadRoutes = () => queryGetRoutes.load() || queryGetRoutes.refetch();

    const loadCustomersByRoutes = () => queryGetCustomersByRoute.load() || queryGetCustomersByRoute.refetch();

    // Before mounted function

    onBeforeMount(() => variablesRoutesByUserId.userId = keycloak.subject);

    onMounted(() => {
      loadRoutes();
      loadCustomers();
      headersCustomersListExport.value = formatHeadersListExport(headersCustomersTable);
    });

    // Watchers

    watch(() => routes.value, (newValue) => { routesSelect.value = formatRoutesSelect(newValue) }, { deep: true });

    watch(() => customersByRoute.value, (newValue) => { customersList.value = newValue }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue) {
        variablesCustomersByRoute.id = newValue.value;
        loadCustomersByRoutes();
      } else {
        customersList.value = [];
      }
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

    const formatRoutesSelect = (data) => data.map((item) => ({ value: item.routeId, label: item.code }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        customerDetails.value = value.row;

        customerDetails.value['routeSelect'] = { value: value.row.route.routeId, label: value.row.route.name };
        customerDetails.value['customerTypeSelect'] = { value: value.row.customerType.customerTypeId, label: value.row.customerType.name };
        customerDetails.value['taxpayerTypeSelect'] = { value: value.row.taxpayerType.taxpayerTypeId, label: value.row.taxpayerType.name };
        customerDetails.value['provinceSelect'] = { value: value.row.province.provinceId, label: value.row.province.name };
        customerDetails.value['districtSelect'] = { value: value.row.district.districtId, label: value.row.district.name };
        customerDetails.value['townshipSelect'] = { value: value.row.township.townshipId, label: value.row.township.name };
        customerDetails.value['villageSelect'] = { value: value.row.village.villageId, label: value.row.village.name };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "enable/disable") isModalEnableDisableOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Load function

    const reLoadCustomers = () => {
      loadCustomers();
      loadCustomersByRoutes();
    }

    // Returning values

    return {
      toggleModal,
      reLoadCustomers,
      loadCustomersByRoutes,
      customerDetails,
      isModalCreateOpen,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      routesSelect,
      filterValue,
      headersCustomersListExport,
      customersList,
    };
  },
};
</script>
<style></style>
