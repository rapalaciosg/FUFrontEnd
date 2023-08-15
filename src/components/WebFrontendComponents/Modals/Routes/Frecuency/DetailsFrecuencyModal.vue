<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-5 gap-5 px-4 py-6">
        <p class="font-medium">Id:</p>
        <p class="col-span-2">{{ data.customerFrequencyId }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Lunes:</p>
          <Checkbox :checked="data.monday" disabled />
        </div>
        <p class="font-medium">Id del cliente:</p>
        <p class="col-span-2">{{ data.customer.customerId }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Martes:</p>
          <Checkbox :checked="data.tuesday" disabled />
        </div>
        <p class="font-medium">Nombre del cliente:</p>
        <p class="col-span-2">{{ data.customer.name }} {{ data.customer.lastName }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Miércoles:</p>
          <Checkbox :checked="data.wednesday" disabled />
        </div>
        <p class="font-medium">Frecuencia:</p>
        <p class="col-span-2">{{ data.frequency }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Jueves:</p>
          <Checkbox :checked="data.thursday" disabled />
        </div>
        <p class="font-medium">Última visita:</p>
        <p class="col-span-2">{{ data.lasstVisit }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Viernes:</p>
          <Checkbox :checked="data.friday" disabled />
        </div>
        <p class="font-medium">Próxima visita:</p>
        <p class="col-span-2">{{ data.nextVisit }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Sábado:</p>
          <Checkbox :checked="data.saturday" disabled />
        </div>
        <p class="font-medium">Observaciones:</p>
        <p class="col-span-2">{{ data.observations }}</p>
        <div class="grid grid-cols-2 gap-5 col-span-2">
          <p class="font-medium">Domingo:</p>
          <Checkbox :checked="data.sunday" disabled />
        </div>
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

    onMounted(() => activeModal.value = true);

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { activeModal, closeModal };
  },
};
</script>
