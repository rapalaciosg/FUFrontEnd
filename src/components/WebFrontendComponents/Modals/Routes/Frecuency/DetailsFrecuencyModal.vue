<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Id:</p>
        <p>{{ data.customerFrequencyId }}</p>
        <p class="font-medium">Nombre:</p>
        <p>{{ data.name }}</p>
        <p class="font-medium">Cliente:</p>
        <p>{{ data.customerName }}</p>
        <p class="font-medium">Frecuencia:</p>
        <p>{{ data.frequency }}</p>
        <p class="font-medium">Última visita:</p>
        <p>{{ data.lasstVisit }}</p>
        <p class="font-medium">Próxima visita:</p>
        <p>{{ data.nextVisit }}</p>
        <p class="font-medium">Observaciones:</p>
        <p>{{ data.observations }}</p>
        <p class="font-medium">Lunes:</p>
        <p>{{ data.monday }}</p>
        <p class="font-medium">Martes:</p>
        <p>{{ data.tuesday }}</p>
        <p class="font-medium">Miércoles:</p>
        <p>{{ data.wednesday }}</p>
        <p class="font-medium">Jueves:</p>
        <p>{{ data.thursday }}</p>
        <p class="font-medium">Viernes:</p>
        <p>{{ data.friday }}</p>
        <p class="font-medium">Sábado:</p>
        <p>{{ data.saturday }}</p>
        <p class="font-medium">Domingo:</p>
        <p>{{ data.sunday }}</p>
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
