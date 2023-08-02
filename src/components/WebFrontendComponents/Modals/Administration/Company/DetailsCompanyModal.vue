<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Nombre:</p>
        <p>{{ data.name }}</p>
        <p class="font-medium">Prefijo:</p>
        <p>{{ data.prefix }}</p>
        <p class="font-medium">Dirección:</p>
        <p>{{ data.address }}</p>
        <p class="font-medium">Provincia:</p>
        <p>{{ data.province.name }}</p>
        <p class="font-medium">Tipo de compañia:</p>
        <p>{{ data.companyType.name }}</p>
        <p class="font-medium">Secuencial:</p>
        <p>{{ data.sequential }}</p>
        <p class="font-medium">Distribuidor:</p>
        <Checkbox :checked="data.isDistributor" disabled />
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
  emits: [],
  data() {
    return {};
  },
  watch: {},
  methods: {},
  setup(props, { emit }) {
    let closeModal = ref(false);

    return { closeModal };
  },
};
</script>