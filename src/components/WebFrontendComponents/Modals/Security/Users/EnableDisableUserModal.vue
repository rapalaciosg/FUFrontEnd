<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateUser">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{action}} este usuario: {{user.firstName}}?</h5>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">{{action}}</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";

import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";

export default {
  components: {
    ModalBase,
  },
  props: {
    action: {
      type: String,
      default: ""
    },
    user: {
      type: Object,
      default: {}
    }
  },
  emits: ['user-updated', 'close-modal'],
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

    const updateUser = async () => {
      props.user.enabled = !props.user.enabled;

      await userAdministrationService.updateUser({enabled: props.user.enabled}, keycloak.token, props.user.id)
        .then((response) => {
          toast.success(`Usuario actualizado exitosamente`, { timeout: 2000 });
          emit('user-updated');
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, updateUser, activeModal };
  },
};
</script>
