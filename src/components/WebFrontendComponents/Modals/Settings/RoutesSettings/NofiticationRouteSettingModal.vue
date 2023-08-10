<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-1 gap-5 px-4 py-3">
        <h4>¿Desea configurar rutas?</h4>
      </div>
      <div
        class="px-4 pt-3 pb-1 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
      >
        <button
          class="btn btn-secondary block text-center"
          @click="closeModal = !closeModal"
        >
          Cancelar
        </button>
        <button
          class="btn btn-success block text-center"
          @click="goToRoutesSettingsModal"
        >
          Configurar
        </button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref } from "vue";
import ModalBase from "../../ModalBase.vue";
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import keycloak from "@/security/KeycloakService.js";

export default {
  components: {
    ModalBase,
  },
  props: {
    data: {},
  },
  emits: ["open-route-setting-modal"],
  data() {
    return {
      rolDetails: {},
      rolesList: [],
    };
  },
  watch: {},
  methods: {},
  setup(props, { emit }) {
    let closeModal = ref(false);

    const goToRoutesSettingsModal = () => {
      closeModal.value = !closeModal.value;
      emit("open-route-setting-modal");
    }
    
    return { closeModal, goToRoutesSettingsModal };
  },
};
</script>
