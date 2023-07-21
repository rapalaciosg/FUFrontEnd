<template>
  <div class="space-y-5">
    <Card>
      <h4>Administración de usuarios</h4>
    </Card>
    <AdvancedTable :headers="headersUsersTable" :data="usersList" :actions="actions" @open-modal="toggleModal" />
    <UserDetailsModal title="Detalles de usuario" :activeModal="isModalOpen" :showButton="false" :isDetailModal="false" :data="usernameDetails" @close-modal="isModalOpen = false" />
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
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    Textinput,
    FromGroup,
    UserDetailsModal
  },
  data() {
    return {
      headersUsersTable,
      usersList: [],
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
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
    let usernameDetails = ref({});
    let isModalOpen = ref(false);

    const toggleModal = (value) => {
      if(value.action === 'edit' || value.action === 'details');
        isModalOpen.value = true

      usernameDetails.value = value.row
    }
    return { toggleModal, isModalOpen, usernameDetails }
  }
};
</script>
<style></style>
