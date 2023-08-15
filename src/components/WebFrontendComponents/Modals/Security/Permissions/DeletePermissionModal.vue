<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deletePermission">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar este permiso: {{ permission.name }}?</h5>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Eliminar</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";

import permissionAdministrationService from "@/services/keycloak/permissionAdministrationService";

import keycloak from "@/security/KeycloakService.js";

export default {
  components: {
    ModalBase,
  },
  props: {
    permission: {
      type: Object,
      default: {},
    },
  },
  emits: ["permission-deleted", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Mounted function

    onMounted(() => activeModal.value = true);

    // Trigger function

    const deletePermission = async () => {

        await permissionAdministrationService.deletePermission(keycloak.token, props.permission.name)
        .then((response) => {
          toast.success(`Permiso eliminado exitosamente`, { timeout: 2000 });
          emit("permission-deleted");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
    };

    // Close modal functions

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, deletePermission, activeModal };
  },
};
</script>
