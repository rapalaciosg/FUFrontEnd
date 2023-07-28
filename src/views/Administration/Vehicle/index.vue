<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de vehículos"
      :headers="headersVehiclesTable"
      :data="vehicles"
      :actions="actions"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateVehicleModal
          title="Crear vehículo"
          btnClass="btn-success"
          @vehicle-created="loadVehicles()"
        />
      </template>
    </AdvancedTable>
    <VehicleDetailsModal
      title="Detalles del vehículo"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="vehicleDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <!-- <EditRolModal
      title="Editar vehículo"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="vehicleDetails"
      @close-modal="isModalOpen = false"
      @vehicle-updated="loadVehicles()"
    />
    <DeleteRolModal
      title="Eliminar vehículo"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :vehicle="vehicleDetails"
      @close-modal="isModalDeleteOpen = false"
      @vehicle-deleted="loadVehicles()"
    /> -->
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersVehiclesTable } from "@/constant/administration/vehicle/constantVehicle.js";
import CreateVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/CreateVehicleModal.vue";
import DeleteRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/DeleteRolModal.vue";
import EditRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/EditRolModal.vue";
import VehicleDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/VehicleDetailsModal.vue";

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
    CreateVehicleModal,
    VehicleDetailsModal,
    DeleteRolModal,
    EditRolModal,
  },
  data() {
    return {
      headersVehiclesTable,
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
    let vehicleDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

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

      if (value.action === "delete") isModalDeleteOpen.value = true;

      vehicleDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      vehicleDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      vehicles,
      loadVehicles,
    };
  },
};
</script>
<style></style>
