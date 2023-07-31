<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Id:</p>
        <p>{{ data.driverId }}</p>
        <p class="font-medium">Nombre:</p>
        <p>{{ data.name }}</p>
        <p class="font-medium">Apellido:</p>
        <p>{{ data.lastName }}</p>
        <p class="font-medium">Sucursal:</p>
        <p>{{ data.branchOffice.branchOfficeName }}</p>
        <p class="font-medium">Código:</p>
        <p>{{ data.code }}</p>
        <p class="font-medium">Código de caja:</p>
        <p>{{ data.boxCode }}</p>
        <p class="font-medium">Nombre de usuario:</p>
        <p>{{ data.keycloakUser }}</p>
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
      <div
        class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
      >
        <button
          class="btn btn-secondary block text-center"
          @click="closeModal = !closeModal"
        >
          Cerrar
        </button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref } from "vue";
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
  emits: [],
  data() {
    return {
      checkedImg,
      disabledImg,
    };
  },
  watch: {},
  methods: {},
  setup(props, { emit }) {
    let closeModal = ref(false);

    return { closeModal };
  },
};
</script>
