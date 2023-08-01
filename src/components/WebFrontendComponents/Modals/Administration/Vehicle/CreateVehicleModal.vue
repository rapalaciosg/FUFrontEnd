<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput
            type="text"
            label="Nombre"
            placeholder="Nombre"
            v-model="name"
            :error="nameError"
          />
          <Textinput
            type="text"
            label="Codigo"
            placeholder="Codigo"
            v-model="code"
            :error="codeError"
          />
          <Textinput
            type="text"
            label="Placa"
            placeholder="Placa"
            v-model="licensePlate"
            :error="licensePlateError"
          />
          <Textinput
            type="text"
            label="Descripción"
            placeholder="Descripción"
            v-model="description"
            :error="descriptionError"
          />
          <VueSelect
            label="Sucursal"
            :options="branchOfficesFormatted"
            placeholder="Seleccione una sucursal"
            v-model="branchOfficeId"
            :clearable="false"
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
import { ref, watch, reactive, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { CREATE_VEHICLE } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
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
    VueSelect,
  },
  props: [],
  emits: ["vehicle-created"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    let branchOfficesFormatted = ref([]);

    const branchOfficeId = ref({});

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    const initilize = () => {
      loadBranchOffices();
    };

    onMounted(() => initilize());

    const formatbranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(branchOffices);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    const formValues = reactive({
      name: "",
      code: "",
      description: "",
      licensePlate: "",
    });

    const vehicle = reactive({
      vehicleId: 0,
      name: "",
      code: "",
      description: "",
      licensePlate: "",
      branchOfficeId: 0,
      active: true,
    });

    const schema = yup.object({
      name: yup.string().required("Nombre requerido"),
      code: yup.string().required("Código requerido").max(10),
      description: yup.string().required("Descripción requerida"),
      licensePlate: yup.string().required("Placa requerida").max(10),
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
      value: code,
      errorMessage: codeError,
      meta: codeMeta,
    } = useField("code");
    const {
      value: description,
      errorMessage: descriptionError,
      meta: descriptionMeta,
    } = useField("description");
    const {
      value: licensePlate,
      errorMessage: licensePlateError,
      meta: licensePlateMeta,
    } = useField("licensePlate");

    const { mutate: createVehicle } = useMutation(CREATE_VEHICLE, () => ({
      variables: { inputModel: vehicle },
    }));

    const onSubmit = handleSubmit((values, actions) => {
      vehicle.name = values.name;
      vehicle.code = values.code.toUpperCase();
      vehicle.description = values.description;
      vehicle.licensePlate = values.licensePlate;
      vehicle.branchOfficeId = branchOfficeId.value.value;

      createVehicle()
        .then((response) => {
          emit("vehicle-created");
          toast.success("Vehículo creado exitosamente", {
            timeout: 2000,
          });
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });

      closeModal.value = !closeModal.value;
      actions.resetForm();
    });

    return {
      closeModal,
      name,
      nameError,
      code,
      codeError,
      description,
      descriptionError,
      licensePlate,
      licensePlateError,
      onSubmit,
      branchOfficesFormatted,
      branchOfficeId,
    };
  },
};
</script>
