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
            :data="vehiclesList"
            :fields="headersVehiclesListExport"
            name="filename.xls"
          >
          Exportar
          </download-excel>
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
      <!-- <template v-slot:button>
        <CreateProductModal
          title="Crear producto"
          btnClass="btn-success"
          @product-created="loadFrecuency()"
        />
      </template> -->
    </AdvancedTable>
    <!-- <DetailsFrecuencyModal
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
    /> -->
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch, onBeforeMount } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersFrecuencyTable } from "@/constant/routes/frecuency/constantFrecuency.js";
import DetailsFrecuencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/DetailsFrecuencyModal.vue";
import CreateProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/CreateProductModal.vue";
import EditProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/EditProductModal.vue";
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

    watch(() => routes.value, (newValue) => {
      routesSelect.value = formatRoutesSelect(routes);
    }, { deep: true })

    watch(() => frequenciesByRoute.value, (newValue) => {
      frecuenciesList.value = newValue;
    }, { deep: true })

    watch(() => filterValue.value, (newValue) => {
      console.log('filterValue => ', newValue);
      if (newValue) {
        variablesFrequenciesRoutes.id = newValue.value;
        loadFrecuenciesByRoute();
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
    };
  },
};
</script>
<style></style>
