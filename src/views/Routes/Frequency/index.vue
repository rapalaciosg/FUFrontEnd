<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Frecuencias"
      :headers="headersFrecuencyTable"
      :data="frecuency"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateProductModal
          title="Crear producto"
          btnClass="btn-success"
          @product-created="loadFrecuency()"
        />
      </template>
    </AdvancedTable>
    <DetailsFrecuencyModal
      title="Detalles de frecuencia"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="frecuencyDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditProductModal
      title="Editar producto"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="frecuencyDetails"
      @close-modal="isModalOpen = false"
      @product-updated="loadFrecuency()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersFrecuencyTable } from "@/constant/routes/frecuency/constantFrecuency.js";
import DetailsFrecuencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/DetailsFrecuencyModal.vue";
import CreateProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/CreateProductModal.vue";
import EditProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/EditProductModal.vue";
import DeleteProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DeleteProductModal.vue";

import { GET_ALL_FRECUENCIES } from "@/services/routes/frecuency/frecuencyGraphql.js";
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
    DetailsFrecuencyModal,
    DeleteProductModal,
    EditProductModal,
  },
  data() {
    return {
      headersFrecuencyTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        // { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
    };
  },
  mounted() {},
  methods: {},
  setup() {
    let frecuencyDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetFrecuency = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_FRECUENCIES)
    );

    const frecuency = computed(
      () => queryGetFrecuency.result.value?.srvCustomerFrequency ?? []
    );

    const loadFrecuency = () => {
      queryGetFrecuency.load() || queryGetFrecuency.refetch();
    };

    onMounted(() => {
      loadFrecuency();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      // if (value.action === "delete") isModalDeleteOpen.value = true;

      frecuencyDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      frecuencyDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      frecuency,
      loadFrecuency,
    };
  },
};
</script>
<style></style>
