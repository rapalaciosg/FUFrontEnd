<template>
  <modal-base>
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <p class="font-medium">Nombre de usuario:</p>
        <p>{{data.username}}</p>
        <p class="font-medium">Nombre:</p>
        <p>{{data.firstName}}</p>
        <p class="font-medium">Apellido:</p>
        <p>{{data.lastName}}</p>
        <p class="font-medium">Correo:</p>
        <p>{{data.email}}</p>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted, defineEmits } from "vue";
import ModalBase from "../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  props: {
    data: {
        type: Array,
        default: []
    }
  },
  emits: [],
  data() {
    return {};
  },
  setup(props, { emit }) {
    return {};
  },
};
</script>
