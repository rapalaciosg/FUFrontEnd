<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de permisos"
      :headers="headersPermissionsTable"
      :data="permissionsList"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreatePermissionModal title="Crear permiso" btnClass="btn-success" @permission-created="getPermissionsList()" />
      </template>
    </AdvancedTable>
    <PermissionDetailsModal title="Detalles del permiso" :activeModal="isModalDetailsOpen" :showButton="false"  :data="permissionDetails" @close-modal="isModalDetailsOpen = false" />
    <DeletePermissionModal title="Eliminar permiso" :activeModal="isModalDeleteOpen" :showButton="false" :permission="permissionDetails" @close-modal="isModalDeleteOpen = false" @permission-deleted="getPermissionsList()" />
    <EditPermissionModal title="Editar permiso" :activeModal="isModalOpen" :showButton="false" :data="permissionDetails" @close-modal="isModalOpen = false" @permission-updated="getPermissionsList()" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
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
    let permissionDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const toggleModal = (value) => {
      if (value.action === "edit")
        isModalOpen.value = true;
      if (value.action === "details")
        isModalDetailsOpen.value = true;
      if (value.action === "delete")
        isModalDeleteOpen.value = true;

      permissionDetails.value = value.row;
    };
    return { toggleModal, isModalOpen, isModalDetailsOpen, isModalDeleteOpen, permissionDetails };
  },
};
</script>
<style></style>
