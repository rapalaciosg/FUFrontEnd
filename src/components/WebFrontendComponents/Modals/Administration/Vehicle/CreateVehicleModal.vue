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
          <div>
            <label class="ltr:inline-block rtl:block input-label">Asociar a un conductor</label>
            <div class="pt-2">
              <Checkbox label="Asociar conductor" v-model="isAssociationDriverActive" />
            </div>
          </div>
          <VueSelect
            v-if="isAssociationDriverActive"
            label="Conductor"
            :options="driversFormatted"
            placeholder="Seleccione un conductor"
            v-model="driverId"
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
import { ref, watch, reactive, computed, onMounted, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";
import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import keycloak from "@/security/KeycloakService";

import { CREATE_VEHICLE } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION, CREATE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import { GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
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
    Checkbox,
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

    const isAssociationDriverActive = ref(false);

    let branchOfficesFormatted = ref([]);
    let driversFormatted = ref([]);

    const branchOfficeId = ref({});

    const driverId = ref({});

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION)
    );

    const queryGetDrivers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_DRIVERS)
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const drivers = computed(
      () => queryGetDrivers.result.value?.srvDriver ?? []
    );

    const vehiclesDriversAsociation = computed(
      () => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []
    );

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    const loadDrivers = () => {
      queryGetDrivers.load() || queryGetDrivers.refetch();
    };

    const loadVehiclesDriversAsociation = () => {
      queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();
    };

    onBeforeMount(() => {})

    const initilize = () => {
      loadBranchOffices();
      loadVehiclesDriversAsociation();
    };

    onMounted(() => initilize());

    const formatbranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    const formatDriverSelect = (driversAll, driversNotAvailable) => {
      const differentValues = driversAll.value.filter(object1 => {
        return !driversNotAvailable.value.some(object2 => {
          return object1.driverId === object2.driver.driverId;
        });
      });
      const valueFormated = differentValues.map((item) => ({
        value: item.driverId,
        label: item.code,
      }));
      return valueFormated;
    };

    watch(
      () => drivers.value,
      (newValue) => {
        driversFormatted.value = formatDriverSelect(drivers, vehiclesDriversAsociation);
        driverId.value = driversFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(branchOffices);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => vehiclesDriversAsociation.value,
      (newValue) => {
        loadDrivers();
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

    const vehicleDriver = reactive({
      vehicleId: 0,
      driverId: 0,
      userName: "",
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
        isAssociationDriverActive.value = false;
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

    const { mutate: createVehicleDriver } = useMutation(CREATE_VEHICLE_DRIVER, () => ({
      variables: { inputModel: vehicleDriver },
    }));

    const onSubmit = handleSubmit((values, actions) => {
      vehicle.name = values.name;
      vehicle.code = values.code.toUpperCase();
      vehicle.description = values.description;
      vehicle.licensePlate = values.licensePlate;
      vehicle.branchOfficeId = branchOfficeId.value.value;

      createVehicle()
        .then((response) => {
          toast.success("Vehículo creado exitosamente", {
            timeout: 2000,
          });
          if (isAssociationDriverActive.value) {
            vehicleDriver.vehicleId = +response.data.createVehicle.idObject;
            vehicleDriver.driverId = driverId.value.value;
            vehicleDriver.userName = keycloak.tokenParsed.preferred_username;
            createVehicleDriver()
              .then((response) => {
                if (response.data.createVehicleDriver.statusCode === "OK") {
                  toast.success("Asociación exitosa", {
                    timeout: 2000,
                  });
                } else {
                  toast.error(response.data.createVehicleDriver.message, {
                    timeout: 2000,
                  });
                }
                loadVehiclesDriversAsociation();
                isAssociationDriverActive.value = false;
              })
              .catch((error) => {
                toast.error("Ha ocurrido un error", {
                  timeout: 2000,
                });
              })
          }
          emit("vehicle-created");
          closeModal.value = !closeModal.value;
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
          closeModal.value = !closeModal.value;
        });

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
      driversFormatted,
      driverId,
      isAssociationDriverActive,
    };
  },
};
</script>
