<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <VueSelect
          :options="companiesFormatted"
          placeholder="Seleccione una compañía"
          v-model="companyId"
          :clearable="(companyId) ? true : false"
        />
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel 
            class="btn-info rounded pt-2 text-center" 
            :data="routesList"
            :fields="headersRoutesListExport"
            name="filename.xls"
          >
          Exportar
          </download-excel>
          <Button
            class="h-[40px]"
            text="Crear ruta"
            btnClass="btn-success"
            @click="toggleModal()"
          />
        </div>
      </div>
    </Card>
    <AdvancedTable
      title="Listado de rutas"
      :headers="headersTable"
      :data="routesList"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    ></AdvancedTable>
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
      @open-route-setting-modal="isModalRouteSettingsOpen = true"
    />
    <RoutesSettingsModalVue
      title="Configurar rutas"
      btnClass="btn-success"
      :showButton="false"
      :activeModal="isModalRouteSettingsOpen"
      :isConfigured="isConfigured"
      :routesSettings="routeSettings"
      @close-modal="isModalRouteSettingsOpen = false"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted, watch, reactive, onBeforeMount } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { headersRoutesTable } from "@/constant/routes/routes/constantRoutes.js";

import DetailsRoutesModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/DetailsRoutesModal.vue";
import CreateRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/CreateRouteModal.vue";
import DeleteRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/DeleteRouteModal.vue";
import EditRouteModal from "@/components/WebFrontendComponents/Modals/Routes/Routes/EditRouteModal.vue";
import RoutesSettingsModalVue from '@/components/WebFrontendComponents/Modals/Settings/RoutesSettings/RoutesSettingsModal.vue';
import NotificationRouteSettingModal from "@/components/WebFrontendComponents/Modals/Settings/RoutesSettings/NofiticationRouteSettingModal.vue";

import { GET_ALL_ROUTES, GET_ROUTES_BY_COMPANY } from "@/services/routes/routes/routesGraphql.js";
import { GET_ROUTES_SETTINGS } from "@/services/settings/routeSettings/routeSettingsGraphql";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    Button,
    Card,
    VueSelect,
    AdvancedTable,
    CreateRouteModal,
    DetailsRoutesModal,
    DeleteRouteModal,
    EditRouteModal,
    NotificationRouteSettingModal,
    RoutesSettingsModalVue,
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
    let isModalRouteSettingsOpen = ref(false);

    let headersTable = ref([]);
    let routesInitialList = ref([]);
    let routesList = ref([]);
    let headersRoutesListExport = ref({});

    let companiesFormatted = ref([]);

    const companyId = ref(null);

    const variablesRoutesByCompany = reactive({ id: 0 });

    let routeSettings = reactive({
      routeBy: null,
      routeName: null,
    });

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetRoutes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_ROUTES)
    );

    const queryGetRoutesByCompany = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ROUTES_BY_COMPANY, variablesRoutesByCompany)
    );

    const queryGetRoutesSettings = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ROUTES_SETTINGS)
    );

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutes ?? []);

    const routesByCompany = computed(() => queryGetRoutesByCompany.result.value?.srvRoutesByCompanyId ?? []);

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const routesSettings = computed(
      () => queryGetRoutesSettings.result.value?.srvRouteSetting ?? []
    );

    const loadRoutes = () => {
      queryGetRoutes.load() || queryGetRoutes.refetch();
    };

    const loadRoutesByCompany = () => {
      queryGetRoutesByCompany.load() || queryGetRoutesByCompany.refetch();
    };

    const loadCompanies = () => {
      queryGetCompanies.load() || queryGetCompanies.refetch()
    }

    const loadRoutesSettings = () => {
      queryGetRoutesSettings.load() || queryGetRoutesSettings.refetch();
    };

    onBeforeMount(() => {
      loadRoutesSettings();
    });

    onMounted(() => {
      loadRoutes();
      loadCompanies();
    });

    watch(
      () => routes.value,
      (newValue) => {
        routesList.value = routes.value;
        routesInitialList.value = routes.value;
      }
    );

    watch(
      () => routesByCompany.value,
      (newValue) => {
        routesList.value = routesByCompany.value;
      }
    );

    watch(() => companies.value, (newValue) => {
      companiesFormatted.value = formatCompanySelect(companies);
    }, { deep: true })

    watch(() => companyId.value, (newValue) => {
      if (newValue && newValue.value != 0) {
        variablesRoutesByCompany.id = (newValue) ? newValue.value : 0;
        loadRoutesByCompany();
      } else {
        routesList.value = routesInitialList.value;
      }
    }, { deep: true })

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
          headersRoutesListExport.value = formatHeadersRoutesListExport(headersTable.value);
        } else {
          headersTable.value = formatTableHeaders(headersRoutesTable, "Vehículo", "vehicle.code");
          headersRoutesListExport.value = formatHeadersRoutesListExport(headersTable.value);
        }
      }
    );

    const formatHeadersRoutesListExport = (data) => {
      let array = new Map();
      for (let index = 0; index < data.length; index++) {
        array.set(data[index].label, data[index].field)
      }
      let valueFormatted = Array.from(array).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
      delete valueFormatted.Acciones;
      return valueFormatted;
    }

    const formatCompanySelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.companyId,
        label: item.name,
      }));
      return valueFormated;
    };

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
      companiesFormatted,
      companyId,
      routesList,
      headersRoutesListExport,
      isModalRouteSettingsOpen,
    };
  },
};
</script>
<style></style>
