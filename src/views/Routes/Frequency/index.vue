<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="routesSelect" :placeholder="'Seleccione una ruta'" v-model="filterValue" :clearable="(filterValue) ? true : false"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="frecuenciesList" :fields="headersFrecuenciesListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Frecuencias" :headers="headersFrecuencyTable" :data="frecuenciesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal">
      <template v-slot:button>
        <Button class="h-[40px]" text="Crear frecuencia" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <CreateFrequencyModal v-if="isModalCreateOpen" title="Crear frecuencia" @close-modal="isModalCreateOpen = false" @frequency-created="refetchFrequencies()"/>
    <DetailsFrecuencyModal v-if="isModalDetailsOpen" title="Detalles de frecuencia" :data="frecuencyDetails" @close-modal="isModalDetailsOpen = false"/>
    <EditFrequencyModal v-if="isModalEditOpen" title="Editar frecuencia" :data="frecuencyDetails" @close-modal="isModalEditOpen = false" @frequency-updated="refetchFrequencies()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch, onBeforeMount } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Button from "@/components/DashCodeComponents/Button";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { headersFrecuencyTable } from "@/constant/routes/frecuency/constantFrecuency.js";

import DetailsFrecuencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/DetailsFrecuencyModal.vue";
import CreateFrequencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/CreateFrequencyModal.vue";
import EditFrequencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/EditFrequencyModal.vue";

import keycloak from "@/security/KeycloakService.js";

import { GET_ALL_FREQUENCIES, GET_FREQUENCIES_BY_ROUTE_ID } from "@/services/routes/frecuency/frecuencyGraphql.js";
import { GET_ROUTES_BY_USER_ID } from "@/services/routes/routes/routesGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateFrequencyModal,
    DetailsFrecuencyModal,
    EditFrequencyModal,
  },
  data() {
    return {
      headersFrecuencyTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
      ],
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let frecuencyDetails = ref({});

    let isModalEditOpen = ref(false);
    let isModalCreateOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    let routesSelect = ref([]);

    let filterValue = ref(null);

    let frecuenciesList = ref([]);

    let headersFrecuenciesListExport = ref({});

    // Apollo variables

    const variablesRoutesByUserId = reactive({ userId: "" });
    const variablesFrequenciesRoutes = reactive({ id: 0 });

    // Apollo queries initialization

    const queryGetRoutes = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ROUTES_BY_USER_ID, variablesRoutesByUserId));

    const queryGetFrecuenciesByRoute = provideApolloClient(apolloClient)(() => useLazyQuery(GET_FREQUENCIES_BY_ROUTE_ID, variablesFrequenciesRoutes));

    const queryGetFrecuencies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_FREQUENCIES));

    // Apollo fetching data

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutesByUserId ?? []);

    const frequenciesByRoute = computed(() => queryGetFrecuenciesByRoute.result.value?.srvCustomerFrequencyByRouteId ?? []);

    const frequencies = computed(() => queryGetFrecuencies.result.value?.srvCustomerFrequency ?? []);

    // Apollo lazy functions

    const loadRoutes = () => queryGetRoutes.load() || queryGetRoutes.refetch();

    const loadFrecuenciesByRoute = () => queryGetFrecuenciesByRoute.load() || queryGetFrecuenciesByRoute.refetch();

    const loadFrequencies = () => queryGetFrecuencies.load() || queryGetFrecuencies.refetch();

    // Before mounted function

    onBeforeMount(() => variablesRoutesByUserId.userId = keycloak.subject);

    // Mounted function

    onMounted(() => {
      loadRoutes();
      loadFrequencies();
      headersFrecuenciesListExport.value = formatHeadersListExport(headersFrecuencyTable);
    });

    // Watchers

    watch(() => routes.value, (newValue) => { routesSelect.value = formatRoutesSelect(newValue) }, { deep: true });

    watch(() => frequenciesByRoute.value, (newValue) => { frecuenciesList.value = newValue }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue) {
        variablesFrequenciesRoutes.id = newValue.value;
        loadFrecuenciesByRoute();
      } else {
        frecuenciesList.value = [];
      }
    }, { deep: true });

    // watch(() => frecuenciesList.value, (newValue) => {
    //   frecuenciesList.value = newValue.map(item => ({
    //     customerFrequencyId: item.customerFrequencyId,
    //     customer: item.customer,
    //     frequency: item.frequency,
    //     nextVisit: item.nextVisit.split('T')[0],
    //     lasstVisit: item.lasstVisit.split('T')[0],
    //     observations: item.observations,
    //     monday: item.monday,
    //     tuesday: item.tuesday,
    //     wednesday: item.wednesday,
    //     thursday: item.thursday,
    //     friday: item.friday,
    //     saturday: item.saturday,
    //     sunday: item.sunday
    //   }));
    // }, { deep: true })

    // Format functions

    const formatHeadersListExport = (data) => {
      let array = new Map();
      for (let index = 0; index < data.length; index++) {
        array.set(data[index].label, data[index].field);
      }
      let valueFormatted = Array.from(array).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

      delete valueFormatted.Acciones;

      return valueFormatted;
    }

    const formatRoutesSelect = (data) => data.map((item) => ({ value: item.routeId, label: item.code }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        frecuencyDetails.value = value.row;

        frecuencyDetails.value['customerSelect'] = { value: value.row.customer.customerId, label: `${value.row.customer.name} ${value.row.customer.lastName}` };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Load function

    const refetchFrequencies = () => {
      loadFrequencies();
      loadFrecuenciesByRoute();
    }

    // Returning values
    
    return {
      toggleModal,
      refetchFrequencies,
      frecuencyDetails,
      isModalEditOpen,
      isModalCreateOpen,
      isModalDetailsOpen,
      isModalDeleteOpen,
      routesSelect,
      filterValue,
      frecuenciesList,
      headersFrecuenciesListExport,
    };
  },
};
</script>
<style></style>
