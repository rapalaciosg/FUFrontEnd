<template>
  <modal-base>
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <h1>Create invetory transfer</h1>
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

import {
  GET_LOCAL_TYPE,
  GET_PROVINCES,
  GET_DISTRICTS,
  GET_CORRECTIONS,
  CREATE_CLIENT,
} from "@/services/clients/clientsGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  props: [],
  emits: ["transfer-created"],
  data() {
    return {
      dateDefault: "",
      routes: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ],
      customerType: [
        { value: "0", label: "PLV. Tiendas Nuevas" },
        { value: "1", label: "Clientes comercial" },
        { value: "2", label: "Cliente residencial" },
        { value: "3", label: "Cliente existente con Tanques PLV" },
      ],
    };
  },
  setup(props, { emit }) {
    return {};
  },
};
</script>
