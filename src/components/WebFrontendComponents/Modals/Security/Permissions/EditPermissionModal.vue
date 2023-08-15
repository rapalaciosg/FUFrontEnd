<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre del permiso" placeholder="Nombre del permiso" v-model="name" :error="nameError"/>
          <Textinput type="text" label="Descripción del permiso" placeholder="Descripción del permiso" v-model="description" :error="descriptionError"/>
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

import permissionAdministrationService from "@/services/keycloak/permissionAdministrationService";

import keycloak from "@/security/KeycloakService.js";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

export default {
  components: {
    ModalBase,
    Textinput,
  },
  props: {
    data: {
        type: Object,
        default: {}
    }
  },
  emits: ["permission-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Getting data from props

    const getData = (props) => {
      name.value = props.name;
      description.value = props.description;
    }

    // Mounted values

    onMounted(() => {
      getData(props.data);
      activeModal.value = true;
    });

    // Initial values

    const formValues = reactive({
      name: "",
      description: "",
    });

    // Watchers

    watch(
      () => props.data,
      (newValue) => {
        name.value = newValue.name;
        description.value = newValue.description;
      }
    );

    // Yup validation rules

    const schema = yup.object({
      name: yup.string().required("Nombre del permiso requerido"),
      description: yup.string().required("Descripción del permiso requerido"),
    });

    // Vee validate useForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate useField

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: description, errorMessage: descriptionError, meta: descriptionMeta } = useField("description");

    const onSubmit = handleSubmit(async (values, actions) => {
      let permissionFormatted = {};

      permissionFormatted = {
        name: values.name,
        description: values.description,
      };

      await permissionAdministrationService.updatePermission(permissionFormatted, keycloak.token, permissionFormatted.name)
        .then((response) => {
          toast.success("Permiso creado exitosamente", { timeout: 2000 });
          emit("permission-created");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
      actions.resetForm();
    });

    // Close modal functions

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      onSubmit,
      closeModal,
      activeModal,
      name,
      nameError,
      description,
      descriptionError,
    };
  },
};
</script>
