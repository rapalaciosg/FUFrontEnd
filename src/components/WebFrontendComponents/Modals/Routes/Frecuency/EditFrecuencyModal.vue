<template>
  <modal-base>
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-x-5 gap-y-1">
        <h1>Frecuencia</h1>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { useQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

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
      default: [],
    },
  },
  mounted() {},
  watch: {},
  data() {
    return {
      dateDefault: "",
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ],
    };
  },
  setup() {
    
    return {};
  },
};
</script>
