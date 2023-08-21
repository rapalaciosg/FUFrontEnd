<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Id:</p>
        <p>{{ data.specialPriceId }}</p>
        <p class="font-medium">Cliente:</p>
        <p>{{ data.customer.name }} {{ data.customer.lastName }}</p>
        <p class="font-medium">Sucursal:</p>
        <p>{{ data.branchOffice.branchOfficeName }}</p>
        <p class="font-medium">Artículo:</p>
        <p>{{ data.product.name }}</p>
        <p class="font-medium">Ajuste precio:</p>
        <p>{{ data.adjustment }}</p>
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

export default {
  components: {
    ModalBase,
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

    onMounted(() => activeModal.value = true);

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { activeModal, closeModal };
  },
};
</script>

