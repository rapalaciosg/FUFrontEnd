<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de rutas"
      :headers="headersRoutesTable"
      :data="routes"
      :actions="actions"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateCompanyModal
          title="Crear ruta"
          btnClass="btn-success"
          @company-created="loadRoutes()"
        />
      </template>
    </AdvancedTable>
    <DetailsCompanyModal
      title="Detalles de la compañia"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="routeDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditCompanyModal
      title="Editar comapañia"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="routeDetails"
      @close-modal="isModalOpen = false"
      @company-updated="loadRoutes()"
    />
    <DeleteCompanyModal
      title="Eliminar compañia"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :company="routeDetails"
      @close-modal="isModalDeleteOpen = false"
      @company-deleted="loadRoutes()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersRoutesTable } from "@/constant/routes/routes/constantRoutes.js";
import CreateCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/CreateCompanyModal.vue";
import DetailsCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DetailsCompanyModal.vue";
import DeleteCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DeleteCompanyModal.vue";
import EditCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/EditCompanyModal.vue";

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
    CreateCompanyModal,
    DetailsCompanyModal,
    DeleteCompanyModal,
    EditCompanyModal,
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
