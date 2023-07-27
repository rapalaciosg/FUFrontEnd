<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput
            name="name"
            type="text"
            label="Nombre del permiso"
            placeholder="Nombre del permiso"
            v-model="name"
            :error="nameError"
          />
          <Textinput
            name="name"
            type="text"
            label="Descripción del permiso"
            placeholder="Descripción del permiso"
            v-model="description"
            :error="descriptionError"
          />
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
          <button type="submit" class="btn btn-success block text-center">
            Guardar
          </button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, reactive } from "vue";
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
  emits: ["permission-created"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const formValues = reactive({
      name: "",
      description: ""
    });

    const schema = yup.object({
      name: yup.string().required("Nombre del permiso requerido"),
      description: yup.string().required("Descripción del permiso requerido"),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: formValues,
    });

    watch(
      () => closeModal.value,
      (newValue) => {
        resetForm();
      },
      { deep: true }
    );

    const {
      value: name,
      errorMessage: nameError,
      meta: nameMeta,
    } = useField("name");
    const {
      value: description,
      errorMessage: descriptionError,
      meta: descriptionMeta,
    } = useField("description");

    const createPermission = (rol) => {
        permissionAdministrationService
        .createPermission(rol, keycloak.token)
        .then((response) => {
          toast.success("Rol creado exitosamente", {
            timeout: 2000,
          });
          emit("permission-created");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });

      closeModal.value = !closeModal.value;
    };

    const onSubmit = handleSubmit((values, actions) => {
      let permissionFormatted = {};

      permissionFormatted = {
        name: values.name,
        description: values.description,
      };

      createPermission(permissionFormatted);

      actions.resetForm();
    });

    return {
      closeModal,
      name,
      nameError,
      description,
      descriptionError,
      onSubmit,
    };
  },
};
</script>
