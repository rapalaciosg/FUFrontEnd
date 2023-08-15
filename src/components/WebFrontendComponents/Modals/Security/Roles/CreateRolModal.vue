<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput name="name" type="text" label="Nombre del rol" placeholder="Nombre del rol" v-model="name" :error="nameError" />
          <VueSelect name="Permissions" label="Permisos" :options="permissionsListFormatted" placeholder="Permisos" v-model="permissions" multiple />
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

import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import permissionAdministrationService from "@/services/keycloak/permissionAdministrationService";

import keycloak from "@/security/KeycloakService.js";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  props: [],
  emits: ["rol-created", "close-modal"],
  data() {
    return {
      permissionsList: [],
      permissionsListFormatted: [],
    };
  },
  watch: {
    permissionsList(newValue) {
      this.permissionsListFormatted = this.formatValuesSelect(newValue);
    },
  },
  mounted() {
    this.getPermissionsList();
  },
  methods: {
    getPermissionsList() {
      permissionAdministrationService
        .getPermissions(keycloak.token)
        .then((response) => {
          this.permissionsList = response.data;
        });
    },
    formatValuesSelect(data) {
      const valueFormated = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      return valueFormated;
    },
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const permissions = ref([]);

    // Mounted function

    onMounted(() => activeModal.value = true);

    // Inital values

    const formValues = reactive({ name: "" });

    // Yup validations rules

    const schema = yup.object({
      name: yup.string().required("Nombre del rol requerido"),
    });

    // Vee validate useForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate userField

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");

    // Trigger function

    const onSubmit = handleSubmit(async (values, actions) => {
      let rolFormatted = {};
      let permissionsFormatted = {};

      rolFormatted = {
        name: values.name.toUpperCase(),
        realmRoles: [],
      };

      permissionsFormatted = permissions.value.map((item) => item.label);

      rolFormatted.realmRoles = permissionsFormatted;

      await roleAdministrationService.createRol(rolFormatted, keycloak.token)
        .then((response) => {
          toast.success("Rol creado exitosamente", { timeout: 2000 });
          emit("rol-created");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
      actions.resetForm();
    });

    // Close modal functions

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      closeModal,
      onSubmit,
      activeModal,
      name,
      nameError,
      permissions,
    };
  },
};
</script>
