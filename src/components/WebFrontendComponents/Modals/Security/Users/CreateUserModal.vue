<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput name="username" type="text" label="Nombre de usuario" placeholder="Nombre de usuario" v-model="username" :error="usernameError" />
          <Textinput name="email" type="email" label="Correo" placeholder="Correo" v-model="email" :error="emailError" />
          <Textinput name="firstName" type="text" label="Nombre" placeholder="Nombre" v-model="firstName" :error="firstNameError" />
          <Textinput name="lastName" type="text" label="Apellido" placeholder="Apellido" v-model="lastName" :error="lastNameError" />
          <Textinput name="password" type="password" label="Contraseña" placeholder="Contraseña" v-model="password" :error="passwordError" />
          <VueSelect name="groups" label="Roles" :options="rolesListFormatted" placeholder="Roles" v-model="groups" multiple />
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Guardar</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, reactive, onMounted } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import userAdministrationService from "@/services/keycloak/userAdministrationService";
import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  props: {},
  emits: ['user-created', 'close-modal'],
  data() {
    return {
      rolesList: [],
      rolesListFormatted: []
    };
  },
  watch: {
    rolesList(newValue) { this.rolesListFormatted = this.formatValuesSelect(newValue) },
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      roleAdministrationService.getRoles(keycloak.token).then((response) => {
        this.rolesList = response.data;
      });
    },
    formatValuesSelect(data) { return data.map(item => ({ value: item.id, label: item.name })) },
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const groups = ref([]);

    // Mounted function

    onMounted(() => activeModal.value = true);

    // Initial values

    const formValues = reactive({
      username: "",
      firstName: "",
      lastName: "",
      email: ""
    });

    // Yup validation rules

    const schema = yup.object({
      username: yup.string().required("Nombre de usuario requerido"),
      firstName: yup.string().required("Nombre requerido"),
      lastName: yup.string().required("Apellido requerido"),
      email: yup.string().required("Correo requerido").email(),
      password: yup.string().required("Contraseña requerida").min(3)
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate userField

    const { value: username, errorMessage: usernameError } = useField("username");
    const { value: firstName, errorMessage: firstNameError, meta: firstNameMeta } = useField("firstName");
    const { value: lastName, errorMessage: lastNameError } = useField("lastName");
    const { value: email, errorMessage: emailError } = useField("email");
    const { value: password, errorMessage: passwordError } = useField("password");

    // Functions to trigger

    const onSubmit = handleSubmit(async (values, actions) => {
      let userFormatted = {};
      let passwordFormatted = {};
      let groupsFormatted = {};

      userFormatted = {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        enabled: true,
        email: values.email,
        groups: [],
        emailVerified: true,
        credentials: []
      };

      passwordFormatted = {
        type: "password",
        value: values.password,
        temporary: false
      };

      groupsFormatted = groups.value.map(item => item.label);

      userFormatted.credentials.push(passwordFormatted);
      userFormatted.groups = groupsFormatted;

      await userAdministrationService.createUser(userFormatted, keycloak.token)
        .then((response) => {
          toast.success("Usuario creado exitosamente", { timeout: 2000 });
          emit('user-created')
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      onSubmit,
      closeModal,
      activeModal,
      username,
      usernameError,
      firstName,
      firstNameError,
      lastName,
      lastNameError,
      email,
      emailError,
      password,
      passwordError,
      groups,
    };
  },
};
</script>
