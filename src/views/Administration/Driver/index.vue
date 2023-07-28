<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de conductores"
      :headers="headersDriversTable"
      :data="drivers"
      :actions="actions"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateRolModal
          title="Crear conductor"
          btnClass="btn-success"
          @driver-created="loadDrivers()"
        />
      </template>
    </AdvancedTable>
    <DriverDetailsModal
      title="Detalles del conductor"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="driverDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditRolModal
      title="Editar conductor"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="driverDetails"
      @close-modal="isModalOpen = false"
      @driver-updated="loadDrivers()"
    />
    <DeleteRolModal
      title="Eliminar conductor"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :driver="driverDetails"
      @close-modal="isModalDeleteOpen = false"
      @driver-deleted="loadDrivers()"
    />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersDriversTable } from "@/constant/administration/driver/constantDriver.js";
import CreateRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/CreateRolModal.vue";
import DeleteRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/DeleteRolModal.vue";
import EditRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/EditRolModal.vue";
import DriverDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/DriverDetailsModal.vue";

import { GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    CreateRolModal,
    DriverDetailsModal,
    DeleteRolModal,
    EditRolModal,
  },
  data() {
    return {
      headersDriversTable,
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
    let driverDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetDrivers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_DRIVERS)
    );

    const drivers = computed(
      () => queryGetDrivers.result.value?.srvDriver ?? []
    );

    const loadDrivers = () => {
      queryGetDrivers.load() || queryGetDrivers.refetch();
    };

    onMounted(() => {
      loadDrivers();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "delete") isModalDeleteOpen.value = true;

      driverDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      driverDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      drivers,
      loadDrivers,
    };
  },
};
</script>
<style></style>
