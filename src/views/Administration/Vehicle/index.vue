<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de vehículos"
      :headers="headersVehiclesTable"
      :data="vehicles"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
      :filter="filterSelect"
    >
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <CreateVehicleModal
            title="Crear vehículo"
            btnClass="btn-success"
            @vehicle-created="loadVehicles()"
          />
        </div>
      </template>
    </AdvancedTable>
    <VehicleDetailsModal
      title="Detalles del vehículo"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="vehicleDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditVehicleModal
      title="Editar vehículo"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="vehicleDetails"
      @close-modal="isModalOpen = false"
      @vehicle-updated="loadVehicles()"
    />
    <EnableDisableVehicleModal :title="(vehicleDetails.active) ? 'Deshabilitar' : 'Habilitar'" :activeModal="isModalEnableDisableOpen" :showButton="false" :action="(vehicleDetails.active) ? 'Deshabilitar' : 'Habilitar'" :vehicle="vehicleDetails" @close-modal="isModalEnableDisableOpen = false" @vehicle-updated="loadVehicles()" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { headersVehiclesTable } from "@/constant/administration/vehicle/constantVehicle.js";
import CreateVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/CreateVehicleModal.vue";
import EnableDisableVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/EnableDisableVehicleModal.vue";
import VehicleDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/VehicleDetailsModal.vue";
import EditVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/EditVehicleModal.vue";

import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    VueSelect,
    CreateVehicleModal,
    VehicleDetailsModal,
    EnableDisableVehicleModal,
    EditVehicleModal,
  },
  data() {
    return {
      headersVehiclesTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
      status: [
        { label: 'Habilitado', value: 'enabled' },
        { label: 'Deshabilitado', value: 'disabled' },
      ]
    };
  },
  mounted() {},
  methods: {},
  setup() {
    let vehicleDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let filterSelect = ref("");

    const queryGetVehicles = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_VEHICLES)
    );

    const vehicles = computed(
      () => queryGetVehicles.result.value?.srvVehicle ?? []
    );

    const loadVehicles = () => {
      queryGetVehicles.load() || queryGetVehicles.refetch();
    };

    onMounted(() => {
      loadVehicles();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if(value.action === 'enable/disable') isModalEnableDisableOpen.value = true;

      vehicleDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      vehicleDetails,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      vehicles,
      filterSelect,
      loadVehicles,
    };
  },
};
</script>
<style></style>
