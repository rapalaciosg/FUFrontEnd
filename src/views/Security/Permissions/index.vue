<template>
  <div class="space-y-5">
    <AdvancedTable title="Listado de permisos" :headers="headersPermissionsTable" :data="permissionsList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal">
      <template v-slot:button>
        <Button class="h-[40px]" text="Crear permiso" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <CreatePermissionModal v-if="isModalCreateOpen" title="Crear permiso" btnClass="btn-success" @permission-created="getPermissionsList()" @close-modal="isModalCreateOpen = false" />
    <PermissionDetailsModal v-if="isModalDetailsOpen" title="Detalles del permiso" :data="permissionDetails" @close-modal="isModalDetailsOpen = false" />
    <DeletePermissionModal v-if="isModalDeleteOpen" title="Eliminar permiso" :permission="permissionDetails" @close-modal="isModalDeleteOpen = false" @permission-deleted="getPermissionsList()"/>
    <EditPermissionModal v-if="isModalEditOpen" title="Editar permiso" :data="permissionDetails" @close-modal="isModalEditOpen = false" @permission-updated="getPermissionsList()" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Button from "@/components/DashCodeComponents/Button";

import { headersPermissionsTable } from "@/constant/security/permissions/permissions.js";

import permissionAdministrationService from "@/services/keycloak/permissionAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import DeletePermissionModal from "@/components/WebFrontendComponents/Modals/Security/Permissions/DeletePermissionModal.vue";
import CreatePermissionModal from "@/components/WebFrontendComponents/Modals/Security/Permissions/CreatePermissionModal.vue";
import EditPermissionModal from "@/components/WebFrontendComponents/Modals/Security/Permissions/EditPermissionModal.vue";
import PermissionDetailsModal from "@/components/WebFrontendComponents/Modals/Security/Permissions/PermissionDetailsModal.vue";

export default {
  components: {
    AdvancedTable,
    Button,
    DeletePermissionModal,
    PermissionDetailsModal,
    CreatePermissionModal,
    EditPermissionModal
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

    // Variables declaration

    let permissionDetails = ref({});

    let isModalEditOpen = ref(false);
    let isModalCreateOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    // Toggle function

    const toggleModal = (value) => {
      if (value) {
        permissionDetails.value = value.row;

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "delete") isModalDeleteOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values
    
    return { toggleModal, isModalCreateOpen, isModalEditOpen, isModalDetailsOpen, isModalDeleteOpen, permissionDetails };
  },
};
</script>
<style></style>
