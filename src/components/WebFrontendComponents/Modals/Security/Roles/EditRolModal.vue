<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre del rol" placeholder="Nombre del rol" v-model="name" :error="nameError"/>
          <VueSelect label="Permisos" :options="permissionsListFormatted" placeholder="Permisos" v-model="permissions" multiple/>
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
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  emits: ["rol-updated", "close-modal"],
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

    // Variables declarion

    const toast = useToast();

    const activeModal = ref(false);

    const permissions = ref([]);
    const rolDetails = ref({});
    const rolId = ref("");

    // Mounted function

    onMounted(() => {
      getRolDetails(keycloak.token, props.data.id);
      rolId.value = props.data.id;
      name.value = props.data.name;
      activeModal.value = true;
    });

    // Watchers

    watch(() => props.data, (newValue) => {
        getRolDetails(keycloak.token, newValue.id);
        rolId.value = newValue.id;
        name.value = newValue.name;
      }
    );

    watch(() => rolDetails.value, (newValue) => { permissions.value = newValue.realmRoles.map((item) => ({ value: item, label: item })) }, { deep: true });

    // Function to get rol details

    const getRolDetails = (token, rolId) => {
      roleAdministrationService.getRolDetails(token, rolId)
        .then((response) => rolDetails.value = response.data)
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
    };

    // Yup validation rules

    const schema = yup.object({
      name: yup.string().required("Nombre del rol requerido"),
    });

    // Vee validate useForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    // Vee validate useField

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");

    // Trigger function

    const updateRol = (rol, id) => {
      

      closeModal.value = !closeModal.value;
    };

    const onSubmit = handleSubmit(async (values, actions) => {
      let rolFormatted = {};
      let permissionsFormatted = {};

      rolFormatted = {
        name: values.name.toUpperCase(),
        realmRoles: [],
      };

      permissionsFormatted = permissions.value.map((item) => item.label);

      rolFormatted.realmRoles = permissionsFormatted;

      await roleAdministrationService.updateRol(rolFormatted, keycloak.token, rolId.value)
        .then((response) => {
          toast.success("Rol actualizado exitosamente", { timeout: 2000 });
          emit("rol-updated");
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
      name,
      nameError,
      permissions,
    };
  },
};
</script>
