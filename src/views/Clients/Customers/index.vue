<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de clientes"
      :headers="headersCustomersTable"
      :data="customers"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateCustomerModal
          title="Crear cliente"
          btnClass="btn-success"
          @customer-created="loadCustomers()"
        />
      </template>
    </AdvancedTable>
    <DetailsProductsModal
      title="Detalles de cliente"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="customerDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditProductModal
      title="Editar cliente"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="customerDetails"
      @close-modal="isModalOpen = false"
      @customer-updated="loadCustomers()"
    />
    <DeleteProductModal
      title="Eliminar cliente"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :customer="customerDetails"
      @close-modal="isModalDeleteOpen = false"
      @customer-deleted="loadCustomers()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersCustomersTable } from "@/constant/clients/customers/constantCustomers.js";
import DetailsProductsModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DetailsProductsModal.vue";
import EditProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/EditProductModal.vue";
import DeleteProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DeleteProductModal.vue";
import CreateCustomerModal from "@/components/WebFrontendComponents/Modals/Clients/Customers/CreateCustomerModal.vue";

import { GET_ALL_CUSTOMERS } from "@/services/clients/customers/customersGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
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
  mounted() {},
  methods: {},
  setup() {
    let customerDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetCustomers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_CUSTOMERS)
    );

    const customers = computed(
      () => queryGetCustomers.result.value?.srvCustomer ?? []
    );

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
      isModalOpen,
      customerDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      customers,
      loadCustomers,
    };
  },
};
</script>
<style></style>
