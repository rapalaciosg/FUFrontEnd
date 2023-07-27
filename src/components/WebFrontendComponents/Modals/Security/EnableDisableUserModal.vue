<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateUser">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{action}} este usuario: {{user.firstName}}?</h5>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal = !closeModal">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">{{action}}</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import ModalBase from "../ModalBase.vue";
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import { useToast } from "vue-toastification";
import keycloak from "@/security/KeycloakService.js";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

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
  emits: ['user-updated'],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const updateUser = () => {
      props.user.enabled = !props.user.enabled
      userAdministrationService
        .updateUser({enabled: props.user.enabled}, keycloak.token, props.user.id)
        .then((response) => {
          toast.success(`Usuario actualizado exitosamente`, {
            timeout: 2000,
          });
          emit('user-updated');
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });
      closeModal.value = !closeModal.value;
    };

    return { closeModal, updateUser };
  },
};
</script>
