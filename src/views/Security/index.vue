<template>
  <div class="space-y-5">
    <AdvancedTable title="Listado de usuarios" :headers="headersUsersTable" :data="usersList" :actions="actions" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <CreateUserModal title="Crear usuario" btnClass="btn-success" @user-created="getUserList()" />
        </div>
      </template>
    </AdvancedTable>
    <UserDetailsModal title="Detalles de usuario" :activeModal="isModalDetailsOpen" :showButton="false" :data="userDetails" @close-modal="isModalDetailsOpen = false" />
    <EditUserModal title="Editar usuario" :activeModal="isModalEditOpen" :showButton="false" :data="userDetails" @close-modal="isModalEditOpen = false" @user-updated="getUserList()" />
    <EnableDisableUserModal :title="(userDetails.enabled) ? 'Deshabilitar' : 'Habilitar'" :activeModal="isModalOpen" :showButton="false" :action="(userDetails.enabled) ? 'Deshabilitar' : 'Habilitar'" :user="userDetails" @close-modal="isModalOpen = false" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersUsersTable } from "@/constant/security/users.js";
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";
import UserDetailsModal from "@/components/WebFrontendComponents/Modals/Security/UserDetailsModal.vue";
import CreateUserModal from "@/components/WebFrontendComponents/Modals/Security/CreateUserModal.vue";
import EditUserModal from "@/components/WebFrontendComponents/Modals/Security/EditUserModal.vue";
import EnableDisableUserModal from "@/components/WebFrontendComponents/Modals/Security/EnableDisableUserModal.vue";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    Textinput,
    FromGroup,
    UserDetailsModal,
    CreateUserModal,
    EnableDisableUserModal,
    EditUserModal
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
        { label: 'Habilitado', value: 'enabled' },
        { label: 'Deshabilitado', value: 'disabled' },
      ]
    };
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      userAdministrationService.getUsers(keycloak.token).then((response) => {
        this.usersList = response.data;
      });
    },
  },
  setup() {
    let userDetails = ref({});
    let isModalDetailsOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalOpen = ref(false);

    let filterSelect = ref("");

    const toggleModal = (value) => {
      if(value.action === 'details')
        isModalDetailsOpen.value = true
      if(value.action === 'edit')
        isModalEditOpen.value = true
      if(value.action === 'enable/disable')
        isModalOpen.value = true
      
        userDetails.value = value.row;
    }
    return { toggleModal, isModalDetailsOpen, isModalOpen, userDetails, isModalEditOpen, filterSelect }
  }
};
</script>
<style></style>
