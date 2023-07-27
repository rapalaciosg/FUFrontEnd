<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Sucursales"
      :headers="headersBranchOfficesTable"
      :data="companies"
      :actions="actions"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateRolModal
          title="Crear rol"
          btnClass="btn-success"
          @rol-created="getRolesList()"
        />
      </template>
    </AdvancedTable>
    <RolDetailsModal
      title="Detalles del rol"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="rolDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditRolModal
      title="Editar rol"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="rolDetails"
      @close-modal="isModalOpen = false"
      @rol-updated="getRolesList()"
    />
    <DeleteRolModal
      title="Eliminar rol"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :rol="rolDetails"
      @close-modal="isModalDeleteOpen = false"
    />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersBranchOfficesTable } from "@/constant/administration/branchOffice/constantBranchOffice.js";
import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import keycloak from "@/security/KeycloakService.js";
import CreateRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/CreateRolModal.vue";
import DeleteRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/DeleteRolModal.vue";
import EditRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/EditRolModal.vue";
import RolDetailsModal from "@/components/WebFrontendComponents/Modals/Security/Roles/RolDetailsModal.vue";

import { GET_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    Textinput,
    CreateRolModal,
    RolDetailsModal,
    DeleteRolModal,
    EditRolModal,
  },
  data() {
    return {
      headersBranchOfficesTable,
      rolesList: [],
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
    };
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      roleAdministrationService.getRoles(keycloak.token).then((response) => {
        this.rolesList = response.data;
      });
    },
  },
  setup() {
    let rolDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetCompanies = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_COMPANIES)
    );

    const companies = computed(
      () => queryGetCompanies.result.value?.srvCompanies ?? []
    );

    onMounted(() => {
      queryGetCompanies.load();
    });

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "delete") isModalDeleteOpen.value = true;

      rolDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      rolDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      companies,
    };
  },
};
</script>
<style></style>
