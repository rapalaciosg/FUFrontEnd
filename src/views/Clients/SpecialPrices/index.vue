<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Precios especiales"
      :headers="headersSpecialPricesTable"
      :data="specialPrices"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateSpecialPriceModal
          title="Crear precio especial"
          btnClass="btn-success"
          @special-price-created="loadSpecialPrices()"
        />
      </template>
    </AdvancedTable>
    <DetailsSpecialPriceModal
      title="Detalles de producto"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="specialPriceDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditSpecialPriceModal
      title="Editar precio especial"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="specialPriceDetails"
      @close-modal="isModalOpen = false"
      @special-price-updated="loadSpecialPrices()"
    />
    <DeleteSpecialPriceModal
      title="Eliminar precio especial"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :specialPrice="specialPriceDetails"
      @close-modal="isModalDeleteOpen = false"
      @special-price-deleted="loadSpecialPrices()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersSpecialPricesTable } from "@/constant/clients/specialPrices/constantSpecialPrices.js";
import DetailsSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/DetailsSpecialPriceModal.vue";
import CreateSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/CreateSpecialPriceModal.vue";
import EditSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/EditSpecialPriceModal.vue";
import DeleteSpecialPriceModal from "@/components/WebFrontendComponents/Modals/Clients/SpecialPrices/DeleteSpecialPriceModal.vue";

import { GET_ALL_SPECIAL_PRICES } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    DetailsSpecialPriceModal,
    CreateSpecialPriceModal,
    EditSpecialPriceModal,
    DeleteSpecialPriceModal
},
  data() {
    return {
      headersSpecialPricesTable,
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
    let specialPriceDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetSpecialPrices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_SPECIAL_PRICES)
    );

    const specialPrices = computed(
      () => queryGetSpecialPrices.result.value?.srvSpecialPrice ?? []
    );

    const loadSpecialPrices = () => {
      queryGetSpecialPrices.load() || queryGetSpecialPrices.refetch();
    };

    onMounted(() => {
      loadSpecialPrices();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "delete") isModalDeleteOpen.value = true;

      specialPriceDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      specialPriceDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      specialPrices,
      loadSpecialPrices,
    };
  },
};
</script>
<style></style>
