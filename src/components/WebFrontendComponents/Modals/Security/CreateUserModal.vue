<template>
  <modal-base @save="createUser()" :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput name="username" type="text" label="Nombre de usuario" placeholder="Nombre de usuario" v-model="user.username" />
        <Textinput name="email" type="text" label="Correo" placeholder="Correo" v-model="user.email" />
        <Textinput name="firstName" type="text" label="Nombre" placeholder="Nombre" v-model="user.firstName" />
        <Textinput name="lastName" type="text" label="Apellido" placeholder="Apellido" v-model="user.lastName" />
        <Textinput name="password" type="text" label="Contraseña" placeholder="Contraseña" v-model="password.value" />
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
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import { useToast } from "vue-toastification";
import keycloak from "@/security/KeycloakService.js";

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
    const toast = useToast();

    let closeModal = ref(false);

    onMounted(() => {
      Object.keys(user).every(x => user[x] = "")
      password.value = ""
    })

    const user = reactive({
      username: "",
      firstName: "",
      lastName: "",
      enabled: true,
      email: "",
      groups: [],
      emailVerified: true,
      credentials: []
    })

    const password = reactive({
      type: "password",
      value: "",
      temporary: false
    })

    const createUser = () => {
      user.credentials.push(password)
      console.log('user => ', user);
      userAdministrationService.createUser(user, keycloak.token).then((response) => {
        console.log('response => ', response);
        toast.success("Precio especial creado exitosamente", {
          timeout: 2000,
        });
      }).catch((error) => {
        toast.error("Ha ocurrido un error", {
          timeout: 2000,
        });
      });
      closeModal.value = true
    }

    return { user, password, closeModal, createUser };
  },
};
</script>
F
