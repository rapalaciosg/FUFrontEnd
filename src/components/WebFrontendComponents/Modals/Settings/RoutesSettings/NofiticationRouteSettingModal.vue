<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-1 gap-5 px-4 py-3">
        <h4>¿Desea configurar rutas?</h4>
      </div>
      <div class="px-4 pt-3 pb-1 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
        <button class="btn btn-secondary block text-center" @click="closeModal()">Cancelar</button>
        <button class="btn btn-success block text-center" @click="goToRoutesSettingsModal">Configurar</button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";

export default {
  components: {
    ModalBase,
  },
  props: {
    data: {},
  },
  emits: ["open-route-setting-modal", "close-modal"],
  data() {
    return {
      rolDetails: {},
      rolesList: [],
    };
  },
  setup(props, { emit }) {

    // Variables declaration

    const activeModal = ref(false);

    // Mounted function

    onMounted(() => activeModal.value = true);

    // Function to go to settings modal
    
    const goToRoutesSettingsModal = () => {
      emit("open-route-setting-modal");
      closeModal();
    }

    // Close modal function

    const closeModal = () => emit('close-modal');
    
    return { closeModal, goToRoutesSettingsModal, activeModal };
  },
};
</script>
