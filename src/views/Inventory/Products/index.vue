<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de productos"
      :headers="headersProductsTable"
      :data="products"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateProductModal
          title="Crear producto"
          btnClass="btn-success"
          @product-created="loadProducts()"
        />
      </template>
    </AdvancedTable>
    <DetailsProductsModal
      title="Detalles de producto"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="productsDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditProductModal
      title="Editar producto"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="productsDetails"
      @close-modal="isModalOpen = false"
      @product-updated="loadProducts()"
    />
    <DeleteProductModal
      title="Eliminar compañia"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :product="productsDetails"
      @close-modal="isModalDeleteOpen = false"
      @product-deleted="loadProducts()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersProductsTable } from "@/constant/inventory/products/constantProducts.js";
import DetailsProductsModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DetailsProductsModal.vue";
import CreateProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/CreateProductModal.vue";
import EditProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/EditProductModal.vue";
import DeleteProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DeleteProductModal.vue";

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
    CreateProductModal,
    DetailsProductsModal,
    DeleteProductModal,
    EditProductModal,
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
