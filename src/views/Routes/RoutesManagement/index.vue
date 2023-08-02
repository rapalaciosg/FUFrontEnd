<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de rutas"
      :headers="headersRoutesTable"
      :data="routes"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateRouteModal
          title="Crear ruta"
          btnClass="btn-success"
          @route-created="loadRoutes()"
        />
      </template>
    </AdvancedTable>
    <DetailsRoutesModal
      title="Detalles de ruta"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="routeDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditRouteModal
      title="Editar ruta"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="routeDetails"
      @close-modal="isModalOpen = false"
      @route-updated="loadRoutes()"
    />
    <DeleteRouteModal
      title="Eliminar ruta"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :route="routeDetails"
      @close-modal="isModalDeleteOpen = false"
      @route-deleted="loadRoutes()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersRoutesTable } from "@/constant/routes/routes/constantRoutes.js";
import DetailsRoutesModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/DetailsRoutesModal.vue";
import CreateRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/CreateRouteModal.vue";
import DeleteRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/DeleteRouteModal.vue";
import EditRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/EditRouteModal.vue";

import { GET_ALL_ROUTES } from "@/services/routes/routes/routesGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    CreateRouteModal,
    DetailsRoutesModal,
    DeleteRouteModal,
    EditRouteModal,
  },
  data() {
    return {
      headersRoutesTable,
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
    let routeDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetRoutes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_ROUTES)
    );

    const routes = computed(
      () => queryGetRoutes.result.value?.srvRoutes ?? []
    );

    const loadRoutes = () => {
      queryGetRoutes.load() || queryGetRoutes.refetch();
    };

    onMounted(() => {
      loadRoutes();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "delete") isModalDeleteOpen.value = true;

      routeDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      routeDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      routes,
      loadRoutes,
    };
  },
};
</script>
<style></style>
