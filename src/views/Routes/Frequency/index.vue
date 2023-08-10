<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect
          :options="routesSelect"
          :placeholder="'Seleccione una ruta'"
          v-model="filterValue"
          :clearable="(filterValue) ? true : false"
        />
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel 
            class="btn-info rounded pt-2 text-center" 
            :data="frecuenciesList"
            name="filename.xls"
          >
          Exportar
          </download-excel>
          <CreateFrequencyModal
            title="Crear frecuencia"
            btnClass="btn-success"
            @frequency-created="loadFrecuenciesByRoute()"
          />
        </div>
      </div>
    </Card>
    <AdvancedTable
      title="Frecuencias"
      :headers="headersFrecuencyTable"
      :data="frecuenciesList"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
    </AdvancedTable>
    <!-- <DetailsFrecuencyModal
      title="Detalles de frecuencia"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="frecuencyDetails"
      @close-modal="isModalDetailsOpen = false"
    /> -->
    <EditFrequencyModal
      title="Editar frecuencia"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="frecuencyDetails"
      @close-modal="isModalOpen = false"
      @frequency-updated="loadFrecuenciesByRoute()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch, onBeforeMount } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersFrecuencyTable } from "@/constant/routes/frecuency/constantFrecuency.js";
import DetailsFrecuencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/DetailsFrecuencyModal.vue";
import CreateFrequencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/CreateFrequencyModal.vue";
import EditFrequencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/EditFrequencyModal.vue";
import DeleteProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DeleteProductModal.vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import keycloak from "@/security/KeycloakService.js";

import { GET_ALL_FREQUENCIES, GET_FREQUENCIES_BY_ROUTE_ID } from "@/services/routes/frecuency/frecuencyGraphql.js";
import { GET_ROUTES_BY_USER_ID } from "@/services/routes/routes/routesGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    CreateFrequencyModal,
    DetailsFrecuencyModal,
    DeleteProductModal,
    EditFrequencyModal,
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

    let routesSelect = ref([]);

    const variablesRoutesByUserId = reactive({ userId: "" });
    const variablesFrequenciesRoutes = reactive({ id: 0 });

    let filterValue = ref(null);

    let frecuenciesList = ref([]);

    // const queryGetFrequencies = provideApolloClient(apolloClient)(() =>
    //   useLazyQuery(GET_ALL_FREQUENCIES)
    // );

    const queryGetRoutes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ROUTES_BY_USER_ID, variablesRoutesByUserId)
    );

    const queryGetFrecuenciesByRoute = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_FREQUENCIES_BY_ROUTE_ID, variablesFrequenciesRoutes)
    );

    // const frequencies = computed(
    //   () => queryGetFrequencies.result.value?.srvCustomerFrequency ?? []
    // );

    const routes = computed(
      () => queryGetRoutes.result.value?.srvRoutesByUserId ?? []
    );

    const frequenciesByRoute = computed(
      () => queryGetFrecuenciesByRoute.result.value?.srvCustomerFrequencyByRouteId ?? []
    );

    // const loadFrecuencies = () => {
    //   queryGetFrequencies.load() || queryGetFrequencies.refetch();
    // };

    const loadRoutes = () => {
      queryGetRoutes.load() || queryGetRoutes.refetch();
    };

    const loadFrecuenciesByRoute = () => {
      queryGetFrecuenciesByRoute.load() || queryGetFrecuenciesByRoute.refetch();
    };

    onBeforeMount(() => variablesRoutesByUserId.userId = keycloak.subject);

    onMounted(() => {
      loadRoutes();
    });

    watch(() => frecuenciesList.value, (newValue) => {
      frecuenciesList.value = newValue.map(item => ({
        customerFrequencyId: item.customerFrequencyId,
        customer: item.customer,
        frequency: item.frequency,
        nextVisit: item.nextVisit.split('T')[0],
        lasstVisit: item.lasstVisit.split('T')[0],
        observations: item.observations,
        monday: item.monday,
        tuesday: item.tuesday,
        wednesday: item.wednesday,
        thursday: item.thursday,
        friday: item.friday,
        saturday: item.saturday,
        sunday: item.sunday
      }));
    }, { deep: true })

    watch(() => routes.value, (newValue) => {
      routesSelect.value = formatRoutesSelect(routes);
    }, { deep: true })

    watch(() => frequenciesByRoute.value, (newValue) => {
      frecuenciesList.value = newValue;
    }, { deep: true })

    watch(() => filterValue.value, (newValue) => {
      if (newValue) {
        variablesFrequenciesRoutes.id = newValue.value;
        loadFrecuenciesByRoute();
      } else {
        frecuenciesList.value = [];
      }
    }, { deep: true })

    const formatRoutesSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.routeId,
        label: item.code,
      }));
      return valueFormated;
    };

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
      routesSelect,
      filterValue,
      frecuenciesList,
      loadFrecuenciesByRoute,
    };
  },
};
</script>
<style></style>
