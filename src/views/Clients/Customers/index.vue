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
    <DetailsProductsModal v-if="isModalDetailsOpen" title="Detalles de cliente" :data="customerDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateCustomerModal v-if="isModalCreateOpen" title="Crear cliente" @customer-created="loadCustomers()" @close-modal="isModalCreateOpen = false"/>
    <EditProductModal v-if="isModalEditOpen" title="Editar cliente" :data="customerDetails" @close-modal="isModalEditOpen = false" @customer-updated="loadCustomers()"/>
    <DeleteProductModal v-if="isModalDeleteOpen" title="Eliminar cliente" :customer="customerDetails" @close-modal="isModalDeleteOpen = false" @customer-deleted="loadCustomers()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";

import { headersCustomersTable } from "@/constant/clients/customers/constantCustomers.js";

import DetailsProductsModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DetailsProductsModal.vue";
import EditProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/EditProductModal.vue";
import DeleteProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DeleteProductModal.vue";
import CreateCustomerModal from "@/components/WebFrontendComponents/Modals/Clients/Customers/CreateCustomerModal.vue";

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
    DetailsProductsModal,
    DeleteProductModal,
    EditProductModal,
  },
  data() {
    return {
      headersCustomersTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let customerDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

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

    const loadCustomers = () => {
      queryGetCustomers.load() || queryGetCustomers.refetch();
    };

    onMounted(() => {
      loadCustomers();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "delete") isModalDeleteOpen.value = true;

      productsDetails.value = value.row;
    };
    return {
      toggleModal,
      customerDetails,
      isModalCreateOpen,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalDeleteOpen,
      customers,
      loadCustomers,
    };
  },
};
</script>
<style></style>
