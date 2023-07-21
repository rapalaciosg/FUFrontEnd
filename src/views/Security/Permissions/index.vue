<template>
  <div class="space-y-5">
    <Card>
      <h4>Administración de roles</h4>
    </Card>
    <AdvancedTable
      :headers="headersPermissionsTable"
      :data="permissionsList"
      :actions="actions"
      @open-modal="toggleModal"
    />
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
import { headersPermissionsTable } from "@/constant/security/permissions/permissions.js";
import permissionAdministrationService from "@/services/keycloak/permissionAdministrationService";
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
    UserDetailsModal,
  },
  data() {
    return {
        headersPermissionsTable,
        permissionsList: [],
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
    };
  },
  mounted() {
    this.getPermissionsList();
  },
  methods: {
    getPermissionsList() {
        permissionAdministrationService.getPermissions(keycloak.token).then((response) => {
        this.permissionsList = response.data;
      });
    },
  },
  setup() {
    let usernameDetails = ref({});
    let isModalOpen = ref(false);

    const toggleModal = (value) => {
      if (value.action === "edit" || value.action === "details");
      isModalOpen.value = true;

      usernameDetails.value = value.row;
      console.log(value.row);
    };
    return { toggleModal, isModalOpen, usernameDetails };
  },
};
</script>
<style></style>
