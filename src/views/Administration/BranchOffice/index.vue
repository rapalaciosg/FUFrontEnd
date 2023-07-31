<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Sucursales"
      :headers="headersBranchOfficesTable"
      :data="branchOffices"
      :actions="actions"
      @open-modal="toggleModal"
      :filter="filterSelect"
    >
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <CreateBranchOfficeModal title="Crear sucursal" btnClass="btn-success" @branch-office-created="loadBranchOffices()" />
        </div>
      </template>
    </AdvancedTable>
    <branchOfficeDetailsModal
      title="Detalles de sucursal"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="branchOfficeDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditBranchOfficeModal
      title="Editar sucursal"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="branchOfficeDetails"
      @close-modal="isModalOpen = false"
      @branch-office-updated="loadBranchOffices()"
    />
    <EnableDisableBranchOfficeModal :title="(branchOfficeDetails.active) ? 'Deshabilitar' : 'Habilitar'" :activeModal="isModalEnableDisableOpen" :showButton="false" :action="(branchOfficeDetails.active) ? 'Deshabilitar' : 'Habilitar'" :branchOffice="branchOfficeDetails" @close-modal="isModalEnableDisableOpen = false" @branch-office-updated="loadBranchOffices()" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersBranchOfficesTable } from "@/constant/administration/branchOffice/constantBranchOffice.js";
import branchOfficeDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/branchOfficeDetailsModal.vue";
import CreateBranchOfficeModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/CreateBranchOfficeModal.vue";
import EditBranchOfficeModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/EditBranchOfficeModal.vue";
import EnableDisableBranchOfficeModal from "@/components/WebFrontendComponents/Modals/Administration/BranchOffice/EnableDisableBranchOfficeModal.vue";

import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    CreateBranchOfficeModal,
    branchOfficeDetailsModal,
    EnableDisableBranchOfficeModal,
    EditBranchOfficeModal,
    VueSelect
  },
  data() {
    return {
      headersBranchOfficesTable,
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
    let branchOfficeDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let filterSelect = ref("");

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    onMounted(() => {
      loadBranchOffices();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if(value.action === 'enable/disable') isModalEnableDisableOpen.value = true;

      branchOfficeDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      filterSelect,
      branchOfficeDetails,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      branchOffices,
      loadBranchOffices
    };
  },
};
</script>
<style></style>
