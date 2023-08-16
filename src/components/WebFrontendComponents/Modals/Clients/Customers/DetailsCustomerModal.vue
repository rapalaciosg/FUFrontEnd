<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-3 px-6 py-6">
        <p class="font-medium">Id:</p>
        <p>{{ data.customerId }}</p>
        <p class="font-medium">Ruta:</p>
        <p>{{ data.route.name }}</p>
        <p class="font-medium">Provincia:</p>
        <p>{{ data.province.name }}</p>
        <p class="font-medium">Nombre:</p>
        <p>{{ data.name }}</p>
        <p class="font-medium">Distrito:</p>
        <p>{{ data.district.name }}</p>
        <p class="font-medium">Apellido:</p>
        <p>{{ data.lastName }}</p>
        <p class="font-medium">Corregimiento:</p>
        <p>{{ data.township.name }}</p>
        <p class="font-medium">Código:</p>
        <p>{{ data.code }}</p>
        <p class="font-medium">Lugar poblado:</p>
        <p>{{ data.village.name }}</p>
        <p class="font-medium">Tarjeta de identificación:</p>
        <p>{{ data.identityCard }}</p>
        <p class="font-medium">Dirección:</p>
        <p>{{ data.address }}</p>
        <p class="font-medium">Número de casa:</p>
        <p>{{ data.houseNumber }}</p>
        <p class="font-medium">Nombre de contacto:</p>
        <p>{{ data.contactName }}</p>
        <p class="font-medium">Latitud:</p>
        <p>{{ data.latitude }}</p>
        <p class="font-medium">Longitud:</p>
        <p>{{ data.longitude }}</p>
        <p class="font-medium">Correo:</p>
        <p>{{ data.email }}</p>
        <p class="font-medium">Tipo de impuesto:</p>
        <p>{{ data.taxpayerType.name }}</p>
        <p class="font-medium">Tipo de cliente:</p>
        <p>{{ data.customerType.name }}</p>
        <p class="font-medium">Dv:</p>
        <p>{{ data.dv }}</p>
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
