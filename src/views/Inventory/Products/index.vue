<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de productos"
      :headers="headersProductsTable"
      :data="products"
      :actions="actions"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateCompanyModal
          title="Crear producto"
          btnClass="btn-success"
          @company-created="loadProducts()"
        />
      </template>
    </AdvancedTable>
    <DetailsCompanyModal
      title="Detalles de la compañia"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="productsDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditCompanyModal
      title="Editar comapañia"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="productsDetails"
      @close-modal="isModalOpen = false"
      @company-updated="loadProducts()"
    />
    <DeleteCompanyModal
      title="Eliminar compañia"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :company="productsDetails"
      @close-modal="isModalDeleteOpen = false"
      @company-deleted="loadProducts()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersProductsTable } from "@/constant/inventory/products/constantProducts.js";
import CreateCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/CreateCompanyModal.vue";
import DetailsCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DetailsCompanyModal.vue";
import DeleteCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DeleteCompanyModal.vue";
import EditCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/EditCompanyModal.vue";

import { GET_ALL_PRODUCTS } from "@/services/inventory/products/productsGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    CreateCompanyModal,
    DetailsCompanyModal,
    DeleteCompanyModal,
    EditCompanyModal,
  },
  data() {
    return {
      headersProductsTable,
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
    let productsDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetProducts = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_PRODUCTS)
    );

    const products = computed(
      () => queryGetProducts.result.value?.srvProducts ?? []
    );

    const loadProducts = () => {
      queryGetProducts.load() || queryGetProducts.refetch();
    };

    onMounted(() => {
      loadProducts();
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
      productsDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      products,
      loadProducts,
    };
  },
};
</script>
<style></style>
