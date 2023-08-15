<template>
  <div class="space-y-5">
    <AdvancedTable title="Listado de roles" :headers="headersRolesTable" :data="rolesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal">
      <template v-slot:button>
        <Button class="h-[40px]" text="Crear rol" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <CreateRolModal v-if="isModalCreateOpen" title="Crear rol" @rol-created="getRolesList()" @close-modal="isModalCreateOpen = false"/>
    <RolDetailsModal v-if="isModalDetailsOpen" title="Detalles del rol" :data="rolDetails" @close-modal="isModalDetailsOpen = false"/>
    <EditRolModal v-if="isModalEditOpen" title="Editar rol" :data="rolDetails" @close-modal="isModalEditOpen = false" @rol-updated="getRolesList()"/>
    <DeleteRolModal v-if="isModalDeleteOpen" title="Eliminar rol" :rol="rolDetails" @close-modal="isModalDeleteOpen = false" @rol-deleted="getRolesList()"/>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";

import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";

import { headersRolesTable } from "@/constant/security/roles/roles.js";

import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import CreateRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/CreateRolModal.vue";
import DeleteRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/DeleteRolModal.vue";
import EditRolModal from "@/components/WebFrontendComponents/Modals/Security/Roles/EditRolModal.vue";
import RolDetailsModal from "@/components/WebFrontendComponents/Modals/Security/Roles/RolDetailsModal.vue";

export default {
  components: {
    Button,
    AdvancedTable,
    CreateRolModal,
    RolDetailsModal,
    DeleteRolModal,
    EditRolModal,
  },
  data() {
    return {
      headersRolesTable,
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

    // Variables declaration

    let rolDetails = ref({});

    let isModalEditOpen = ref(false);
    let isModalCreateOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    // Toggle function

    const toggleModal = (value) => {
      if (value) {
        
        rolDetails.value = value.row;

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "delete") isModalDeleteOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      rolDetails,
      isModalEditOpen,
      isModalCreateOpen,
      isModalDetailsOpen,
      isModalDeleteOpen,
    };
  },
};
</script>
<style></style>
