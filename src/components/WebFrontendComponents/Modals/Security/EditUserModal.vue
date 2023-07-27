<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput name="username" type="text" label="Nombre de usuario" placeholder="Nombre de usuario" v-model="username" :error="usernameError" :isReadonly="true" />
          <Textinput name="email" type="email" label="Correo" placeholder="Correo" v-model="email" :error="emailError" />
          <Textinput name="firstName" type="text" label="Nombre" placeholder="Nombre" v-model="firstName" :error="firstNameError" />
          <Textinput name="lastName" type="text" label="Apellido" placeholder="Apellido" v-model="lastName" :error="lastNameError" />
          <VueSelect name="groups" label="Roles" :options="rolesListFormatted" placeholder="Roles" v-model="groupsUserFormatted" multiple />
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal = !closeModal">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Guardar</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { reactive, ref, watch } from "vue";
import ModalBase from "../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import { useToast } from "vue-toastification";
import keycloak from "@/security/KeycloakService.js";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ['user-updated'],
  data() {
    return {
      rolesList: [],
      rolesListFormatted: [],
    };
  },
  watch: {
    rolesList(newValue) {
      this.rolesListFormatted = this.formatValuesSelect(newValue)
    }
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
    formatValuesSelect(data) {
      const valueFormated = data.map(item => ({ value: item.id, label: item.name }));
      return valueFormated;
    }
  },
  setup(props, { emit }) {
    const toast = useToast();

    const groupsUser = ref([]);
    const groupsUserFormatted = ref([]);

    const userId = ref("");

    let closeModal = ref(false);

    const schema = yup.object({
      username: yup.string().required("Nombre de usuario requerido"),
      firstName: yup.string().required("Nombre requerido"),
      lastName: yup.string().required("Apellido requerido"),
      email: yup.string().required("Correo requerido").email(),
    });

    watch(() => props.data, (newValue) => {
      getGroupsUser(newValue.id)
      userId.value = newValue.id
      username.value = newValue.username
      firstName.value = newValue.firstName
      lastName.value = newValue.lastName
      email.value = newValue.email
    })

    watch(() => groupsUser.value, (newValue) => {
      groupsUserFormatted.value = newValue.map(item => ({ value: item.id, label: item.name }))
    }, {deep:true})

    const { handleSubmit } = useForm({
      validationSchema: schema
    });

    const { value: username, errorMessage: usernameError } = useField("username");
    const { value: firstName, errorMessage: firstNameError, meta: firstNameMeta } = useField("firstName");
    const { value: lastName, errorMessage: lastNameError } = useField("lastName");
    const { value: email, errorMessage: emailError } = useField("email");
    const { value: groups, errorMessage: groupsError } = useField("groups");

    const getGroupsUser = (id) => {
      userAdministrationService.getUserGroups(keycloak.token, id).then((response) => {
        groupsUser.value = response.data;
      });
    }

    const updateUser = (user, id) => {
      userAdministrationService.updateUser(user, keycloak.token, id).then((response) => {
        toast.success("Usuario editado exitosamente", {
          timeout: 2000,
        });
        emit('user-updated')
      }).catch((error) => {
        toast.error("Ha ocurrido un error", {
          timeout: 2000,
        });
      });

      closeModal.value = !closeModal.value
    }

    const onSubmit = handleSubmit((values, actions) => {
      let userFormatted = {}
      let groupsFormatted = {}

      userFormatted = {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        enabled: true,
        email: values.email,
        groups: [],
        emailVerified: true,
      }

      groupsFormatted = groupsUserFormatted.value.map(item => item.label)

      userFormatted.groups = groupsFormatted

      updateUser(userFormatted, userId.value);

      actions.resetForm();
    });

    return {
      closeModal,
      username,
      usernameError,
      firstName,
      firstNameError,
      lastName,
      lastNameError,
      email,
      emailError,
      groups,
      groupsError,
      onSubmit,
      groupsUserFormatted
    };
  },
};
</script>
