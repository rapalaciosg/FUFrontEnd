<template>
  <div class="space-y-5">
    <AdvancedTable title="Listado de usuarios" :headers="headersUsersTable" :data="usersList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect"/>
          <Button class="h-[40px]" text="Crear usuario" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <CreateUserModal v-if="isModalCreateOpen" title="Crear usuario" @user-created="getUserList()" @close-modal="isModalCreateOpen = false"/>
    <UserDetailsModal v-if="isModalDetailsOpen" title="Detalles de usuario" :data="userDetails" @close-modal="isModalDetailsOpen = false"/>
    <EditUserModal v-if="isModalEditOpen" title="Editar usuario" :data="userDetails" @close-modal="isModalEditOpen = false" @user-updated="getUserList()"/>
    <EnableDisableUserModal v-if="isModalEnableDisableOpen" :title="userDetails.enabled ? 'Deshabilitar' : 'Habilitar'" :action="userDetails.enabled ? 'Deshabilitar' : 'Habilitar'" :user="userDetails" @close-modal="isModalEnableDisableOpen = false" @user-updated="getUserList()"/>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";

import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";

import { headersUsersTable } from "@/constant/security/users.js";

import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import UserDetailsModal from "@/components/WebFrontendComponents/Modals/Security/Users/UserDetailsModal.vue";
import CreateUserModal from "@/components/WebFrontendComponents/Modals/Security/Users/CreateUserModal.vue";
import EditUserModal from "@/components/WebFrontendComponents/Modals/Security/Users/EditUserModal.vue";
import EnableDisableUserModal from "@/components/WebFrontendComponents/Modals/Security/Users/EnableDisableUserModal.vue";

export default {
  components: {
    VueSelect,
    Button,
    AdvancedTable,
    UserDetailsModal,
    CreateUserModal,
    EnableDisableUserModal,
    EditUserModal,
  },
  data() {
    return {
      headersUsersTable,
      usersList: [],
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
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      userAdministrationService.getUsers(keycloak.token).then((response) => {
        this.usersList = response.data;
      });
    },
  },
  setup() {

    // Variables declaration

    let userDetails = ref({});

    let isModalDetailsOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalCreateOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let filterSelect = ref("");

    // Toggle function

    const toggleModal = (value) => {
      if (value) {
        userDetails.value = value.row;

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "enable/disable") isModalEnableDisableOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values
    
    return {
      toggleModal,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      isModalCreateOpen,
      isModalEditOpen,
      userDetails,
      filterSelect,
    };
  },
};
</script>
<style></style>
