<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 pl-10 py-6">
        <p class="font-medium">Id interno:</p>
        <p>{{ data.posId }}</p>
        <p class="font-medium">Sucursal:</p>
        <p>{{ data.branchOfficeId }}</p>
        <p class="font-medium">Id del dispositivo:</p>
        <p>{{ data.deviceId }}</p>
        <p class="font-medium">dPtoFacDF:</p>
        <p>{{ data.dPtoFacDF }}</p>
        <p class="font-medium">Prefijo de factura:</p>
        <p>{{ data.invoicePrefix }}</p>
        <p class="font-medium">Secuencial de factura:</p>
        <p>{{ data.invoiceSequential }}</p>
        <p class="font-medium">Número de copia de factura:</p>
        <p>{{ data.invoiceNumberCopies }}</p>
        <p class="font-medium">Número de cierre de factura:</p>
        <p>{{ data.invoiceNumberClosings }}</p>
        <p class="font-medium">Número de factura electrónica:</p>
        <p>{{ data.eInvoiceSequential }}</p>
        <p class="font-medium">Prefijo de crédito:</p>
        <p>{{ data.creditPrefix }}</p>
        <p class="font-medium">Secuencial de crédito:</p>
        <p>{{ data.creditSequential }}</p>
        <p class="font-medium">Impresor:</p>
        <p>{{ data.printer }}</p>
        <p class="font-medium">Factura en línea:</p>
        <Checkbox :checked="data.invoiceOnline" disabled />
        <p class="font-medium">Transporte:</p>
        <Checkbox :checked="data.freight" disabled />
        <p class="font-medium">Estado:</p>
        <span class="grid grid-cols-2 gap-5">
          <div v-if="data.active" class="grid grid-cols-2 gap-5">
            <img :src="checkedImg" alt="" class="block object-cover" />
          </div>
          <div v-else class="grid grid-cols-2 gap-5">
            <img :src="disabledImg" alt="" class="block object-cover" />
          </div>
        </span>
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
import checkedImg from "@/assets/images/all-img/icons8-checked-25.png";
import disabledImg from "@/assets/images/all-img/icons8-disabled-25.png";
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
    return {
      checkedImg,
      disabledImg,
    };
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
