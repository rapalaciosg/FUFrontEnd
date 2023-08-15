<template>
  <div class="space-y-5">
    <Card title="Configuración de rutas">
      <div class="grid grid-cols-1 gap-4 justify-items-center">
        <h4>{{ (!isConfigured) ? '¿Desea configurar las rutas?' : '¿Ver configuración de rutas?' }}</h4>
        <Button class="h-[40px]" text="Configurar rutas" btnClass="btn-success" @click="toggleModal()"/>
      </div>
    </Card>
    <RoutesSettingsModalVue v-if="isModalRouteSettingsOpen" title="Configurar rutas" :isConfigured="isConfigured" :routesSettings="routeSettings" @close-modal="isModalRouteSettingsOpen = false" @routes-updated="loadRoutesSettings()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch, reactive, onBeforeMount } from "vue";

import Button from "@/components/DashCodeComponents/Button";
import Card from "@/components/DashCodeComponents/Card";

import RoutesSettingsModalVue from '@/components/WebFrontendComponents/Modals/Settings/RoutesSettings/RoutesSettingsModal.vue';

import { GET_ROUTES_SETTINGS } from "@/services/settings/routeSettings/routeSettingsGraphql";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    Card,
    Button,
    RoutesSettingsModalVue,
  },
  setup() {

    // Variables declaration
    
    let isConfigured = ref(null);

    let isModalRouteSettingsOpen = ref(false);

    let routeSettings = reactive({
      routeBy: null,
      routeName: null,
    });

    // Apollo queries initialization

    const queryGetRoutesSettings = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ROUTES_SETTINGS));

    // Apollo fetching data

    const routesSettings = computed(() => queryGetRoutesSettings.result.value?.srvRouteSetting ?? []);

    // Apollo lazy functions

    const loadRoutesSettings = () => queryGetRoutesSettings.load() || queryGetRoutesSettings.refetch();

    // Before mounted function

    onBeforeMount(() => loadRoutesSettings());

    // Watchers

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

        if ( routeSettings.routeBy.value || routeSettings.routeName.value) {
          isConfigured.value = true;
        } else {
          isConfigured.value = false;
        }
      }
    );

    // toggle function

    const toggleModal = (value) => {
      if (!value) isModalRouteSettingsOpen.value = true;
    };

    // Returning values

    return {
      toggleModal,
      isModalRouteSettingsOpen,
      isConfigured,
      routeSettings,
      loadRoutesSettings,
    };
  },
};
</script>
