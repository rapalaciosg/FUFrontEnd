<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Id:</p>
        <p>{{ data.transferId }}</p>
        <p class="font-medium">Producto:</p>
        <p>{{ data.product.name }}</p>
        <p class="font-medium">Cantidad:</p>
        <p>{{ data.quantity }}</p>
        <p class="font-medium">Almacen de origen:</p>
        <p>{{ data.warehouseInputOrigin.name }}</p>
        <p class="font-medium">Almacen destino:</p>
        <p>{{ data.warehouseInputDestination.name }}</p>
      </div>
      <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
        <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";
import Checkbox from "@/components/DashCodeComponents/Checkbox";

export default {
  components: {
    ModalBase,
    Checkbox,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  emits: ["close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const activeModal = ref(false);

    // Mounted function

    onMounted(() => (activeModal.value = true));

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return { activeModal, closeModal };
  },
};
</script>
