<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de conductores"
      :headers="headersDriversTable"
      :data="drivers"
      :actions="actions"
      @open-modal="toggleModal"
      :filter="filterSelect"
    >
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect
            :options="status"
            placeholder="Todos"
            v-model="filterSelect"
          />
          <CreateDriverModal
            title="Crear conductor"
            btnClass="btn-success"
            @driver-created="loadDrivers()"
          />
        </div>
      </template>
    </AdvancedTable>
    <DriverDetailsModal
      title="Detalles del conductor"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="driverDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditDriverModal
      title="Editar conductor"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="driverDetails"
      @close-modal="isModalOpen = false"
      @driver-updated="loadDrivers()"
    />
    <EnableDisableDriverModal
      :title="driverDetails.active ? 'Deshabilitar' : 'Habilitar'"
      :activeModal="isModalEnableDisableOpen"
      :showButton="false"
      :action="driverDetails.active ? 'Deshabilitar' : 'Habilitar'"
      :driver="driverDetails"
      @close-modal="isModalEnableDisableOpen = false"
      @driver-updated="loadDrivers()"
    />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { headersDriversTable } from "@/constant/administration/driver/constantDriver.js";
import EnableDisableDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/EnableDisableDriverModal.vue";
import CreateDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/CreateDriverModal.vue";
import EditDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/EditDriverModal.vue";
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
    VueSelect,
    CreateDriverModal,
    DriverDetailsModal,
    EnableDisableDriverModal,
    EditDriverModal,
  },
  data() {
    return {
      headersDriversTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
      status: [
        { label: "Habilitado", value: "enabled" },
        { label: "Deshabilitado", value: "disabled" },
      ],
    };
  },
  mounted() {},
  methods: {},
  setup() {
    let driverDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let filterSelect = ref("");

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

      if (value.action === "enable/disable")
        isModalEnableDisableOpen.value = true;

      driverDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      driverDetails,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      drivers,
      loadDrivers,
      filterSelect,
    };
  },
};
</script>
<style></style>
