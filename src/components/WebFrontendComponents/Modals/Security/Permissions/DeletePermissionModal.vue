<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deletePermission">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar este permiso: {{ permission.name }}?</h5>
        </div>
        <div
          class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            class="btn btn-secondary block text-center"
            @click="closeModal = !closeModal"
          >
            Cerrar
          </button>
          <button type="submit" class="btn btn-success block text-center">
            Eliminar
          </button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";
import permissionAdministrationService from "@/services/keycloak/permissionAdministrationService";
import { useToast } from "vue-toastification";
import keycloak from "@/security/KeycloakService.js";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

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
  emits: ["permission-deleted"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const deletePermission = () => {
        permissionAdministrationService
        .deletePermission(keycloak.token, props.permission.name)
        .then((response) => {
          toast.success(`Permiso eliminado exitosamente`, {
            timeout: 2000,
          });
          emit("permission-deleted");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });
      closeModal.value = !closeModal.value;
    };

    return { closeModal, deletePermission };
  },
};
</script>
