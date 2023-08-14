<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Id:</p>
        <p>{{ data.routeId }}</p>
        <p class="font-medium">Compañia:</p>
        <p>{{ data.company.name }}</p>
        <p class="font-medium">Código:</p>
        <p>{{ data.code }}</p>
        <p class="font-medium">Nombre:</p>
        <p>{{ data.name }}</p>
        <p class="font-medium">Descripción:</p>
        <p>{{ data.description }}</p>
        <p class="font-medium">Prefijo de clientes:</p>
        <p>{{ data.customerPrefix }}</p>
        <p class="font-medium">Secuencial de clientes:</p>
        <p>{{ data.customerSequential }}</p>
        <p class="font-medium">Sucursal:</p>
        <p>{{ data.branchOffice.branchOfficeName }}</p>
        <p class="font-medium">Conductor:</p>
        <p>{{ data.driver.code }}</p>
        <p class="font-medium">Vehículo:</p>
        <p>{{ (routeSettings.routeName.value === 'VC') ? data.vehicle.code : data.vehicle.licensePlate }}</p>
        <p class="font-medium">Creación de clientes:</p>
        <Checkbox :checked="data.activeCustomerCreation" disabled />
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
    Checkbox
  },
  props: {
    routeSettings: {
      type: Object,
      default: {}
    },
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
