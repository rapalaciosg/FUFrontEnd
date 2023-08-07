<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de rutas"
      :headers="headersTable"
      :data="routes"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <Button
          class="h-[40px]"
          text="Crear ruta"
          btnClass="btn-success"
          @click="toggleModal()"
        />
      </template>
    </AdvancedTable>
    <CreateRouteModal
      title="Crear ruta"
      btnClass="btn-success"
      :showButton="false"
      :activeModal="isModalCreateOpen"
      :routeSettings="routeSettings"
      @close-modal="isModalCreateOpen = false"
      @route-created="loadRoutes()"
    />
    <DetailsRoutesModal
      title="Detalles de ruta"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="routeDetails"
      :routeSettings="routeSettings"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditRouteModal
      title="Editar ruta"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="routeDetails"
      :routeSettings="routeSettings"
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
    <NotificationRouteSettingModal
      title="Rutas no configuradas"
      :activeModal="isModalNotificationRouteSettingsOpen"
      :showButton="false"
      @close-modal="isModalNotificationRouteSettingsOpen = false"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted, watch, reactive, onBeforeMount } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Button from "@/components/DashCodeComponents/Button";
import { headersRoutesTable } from "@/constant/routes/routes/constantRoutes.js";

import DetailsRoutesModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/DetailsRoutesModal.vue";
import CreateRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/CreateRouteModal.vue";
import DeleteRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/DeleteRouteModal.vue";
import EditRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/EditRouteModal.vue";
import NotificationRouteSettingModal from "@/components/WebFrontendComponents/Modals/Settings/RoutesSettings/NofiticationRouteSettingModal.vue";

import { GET_ALL_ROUTES } from "@/services/routes/routes/routesGraphql.js";
import { GET_ROUTES_SETTINGS } from "@/services/settings/routeSettings/routeSettingsGraphql";
import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    Button,
    AdvancedTable,
    CreateRouteModal,
    DetailsRoutesModal,
    DeleteRouteModal,
    EditRouteModal,
    NotificationRouteSettingModal,
  },
  data() {
    return {
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
    let isModalCreateOpen = ref(false);
    let isModalNotificationRouteSettingsOpen = ref(false);

    let headersTable = ref([]);
    let routesList = ref([]);

    let routeSettings = reactive({
      routeBy: null,
      routeName: null,
    });

    const queryGetRoutes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_ROUTES)
    );

    const queryGetRoutesSettings = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ROUTES_SETTINGS)
    );

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutes ?? []);

    const routesSettings = computed(
      () => queryGetRoutesSettings.result.value?.srvRouteSetting ?? []
    );

    const loadRoutes = () => {
      queryGetRoutes.load() || queryGetRoutes.refetch();
    };

    const loadRoutesSettings = () => {
      queryGetRoutesSettings.load() || queryGetRoutesSettings.refetch();
    };

    onBeforeMount(() => {
      loadRoutesSettings();
    });

    onMounted(() => {
      loadRoutes();
    });

    watch(
      () => routes.value,
      (newValue) => {
        console.log('routes => ', newValue);
      }
    );

    watch(
      () => routesSettings.value,
      (newValue) => {
        routeSettings.routeBy = newValue.find((item) => item.code === "ROUTE_BY");
        routeSettings.routeName = newValue.find((item) => item.code === "ROUTE_NAME");
        // routeSettings.routeBy = { code: 'ROUTE_BY', value: 'D' }
        // routeSettings.routeName = { code: 'ROUTE_NAME', value: 'DC' }
        // routeSettings.routeBy = { code: 'ROUTE_BY', value: 'V' }
        // routeSettings.routeName = { code: 'ROUTE_NAME', value: 'VC' }
        // routeSettings.routeBy = { code: 'ROUTE_BY', value: 'V' }
        // routeSettings.routeName = { code: 'ROUTE_NAME', value: 'VLP' }
        // routeSettings.routeBy = { code: 'ROUTE_BY', value: null }
        // routeSettings.routeName = { code: 'ROUTE_NAME', value: null }

        if (routeSettings.routeBy && routeSettings.routeName.value === "VLP") {
          headersTable.value = formatTableHeaders(headersRoutesTable, "Vehículo", "vehicle.licensePlate");
        } else {
          headersTable.value = formatTableHeaders(headersRoutesTable, "Vehículo", "vehicle.code");
        }
      }
    );

    const formatTableHeaders = (data, label, value) => {
      const index = 8;
      const headersFormatted = [
        ...data.slice(0, index),
        { label: label, field: value },
        ...data.slice(index),
      ];
      return headersFormatted;
    };

    const toggleModal = (value) => {
      if (!value) {
        if (
          routeSettings.routeBy &&
          routeSettings.routeBy.value &&
          routeSettings.routeName &&
          routeSettings.routeName.value
        )
          isModalCreateOpen.value = true;
        else isModalNotificationRouteSettingsOpen.value = true;
      } else {
        if (value.action === "edit") isModalOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "delete") isModalDeleteOpen.value = true;

        routeDetails.value = value.row;
      }
    };
    return {
      toggleModal,
      isModalOpen,
      routeDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      isModalCreateOpen,
      isModalNotificationRouteSettingsOpen,
      routeSettings,
      routes,
      headersTable,
      loadRoutes,
    };
  },
};
</script>
<style></style>
