<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre" placeholder="Nombre" v-model="name" :error="nameError" :maxlength="50"/>
          <Textinput type="text" label="Codigo" placeholder="Codigo" v-model="code" :error="codeError" :maxlength="10"/>
          <Textinput type="text" label="Placa" placeholder="Placa" v-model="licensePlate" :error="licensePlateError" :maxlength="10"/>
          <Textinput type="text" label="Descripción" placeholder="Descripción" v-model="description" :error="descriptionError" :maxlength="250"/>
          <VueSelect label="Sucursal" :options="branchOfficesFormatted" placeholder="Seleccione una sucursal" v-model="branchOfficeId" :clearable="false"/>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Asociar a un conductor</label>
            <div class="pt-2">
              <Checkbox label="Asociar conductor" v-model="isAssociationDriverActive" />
            </div>
          </div>
          <VueSelect v-if="isAssociationDriverActive" label="Conductor" :options="driversFormatted" placeholder="Seleccione un conductor" v-model="driverId" :clearable="false"/>
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

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Checkbox,
    Textinput,
    VueSelect,
  },
  props: {},
  emits: ["vehicle-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const isAssociationDriverActive = ref(false);

    const driverId = ref({});
    let driversFormatted = ref([]);

    const branchOfficeId = ref({});
    let branchOfficesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION));

    const queryGetDrivers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_DRIVERS));

    // Apollo fetching data from queries

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const drivers = computed(() => queryGetDrivers.result.value?.srvDriver ?? []);

    const vehiclesDriversAsociation = computed(() => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []);

    // Apollo lazy functions

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadDrivers = () => queryGetDrivers.load() || queryGetDrivers.refetch();

    const loadVehiclesDriversAsociation = () => queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();

    // Before mounted

    onBeforeMount(() => {
      loadVehiclesDriversAsociation();
      loadDrivers();
    });

    // Initialization function

    const initilize = () => {
      loadBranchOffices();
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

    // Watchers

    watch(
      () => drivers.value,
      (newValue) => {
        const differentValues = newValue.filter(object1 => {
        return !vehiclesDriversAsociation.value.some(object2 => {
          return object1.driverId === object2.driver.driverId;
        });
      });
        driversFormatted.value = differentValues.map((item) => ({ value: item.driverId, label: item.code }));
        driverId.value = driversFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(newValue);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      name: "",
      code: "",
      description: "",
      licensePlate: "",
    });

    // Input model

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

    // Yup validations rules

    const schema = yup.object({
      name: yup.string().required("Nombre requerido").max(50),
      code: yup.string().required("Código requerido").max(10),
      description: yup.string().required("Descripción requerida").max(250),
      licensePlate: yup.string().required("Placa requerida").max(10),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // vee validate use field

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: description, errorMessage: descriptionError, meta: descriptionMeta } = useField("description");
    const { value: licensePlate, errorMessage: licensePlateError, meta: licensePlateMeta } = useField("licensePlate");

    // Apollo mutations

    const { mutate: createVehicle } = useMutation(CREATE_VEHICLE, () => ({ variables: { inputModel: vehicle } }));

    const { mutate: createVehicleDriver } = useMutation(CREATE_VEHICLE_DRIVER, () => ({ variables: { inputModel: vehicleDriver } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      vehicle.name = values.name;
      vehicle.code = values.code.toUpperCase();
      vehicle.description = values.description;
      vehicle.licensePlate = values.licensePlate;
      vehicle.branchOfficeId = branchOfficeId.value.value;

      await createVehicle()
        .then(async (response) => {
          if (response.data.createVehicle.statusCode === "OK") toast.success("Vehículo creado exitosamente", { timeout: 2000 });
          else toast.error(response.data.createVehicle.message, { timeout: 2000 });

          emit("vehicle-created");

          if (isAssociationDriverActive.value) {
            vehicleDriver.vehicleId = +response.data.createVehicle.idObject;
            vehicleDriver.driverId = driverId.value.value;
            vehicleDriver.userName = keycloak.tokenParsed.preferred_username;

            await createVehicleDriver()
              .then((response) => {
                if (response.data.createVehicleDriver.statusCode === "OK") toast.success("Asociación exitosa", { timeout: 2000 });
                else toast.error(response.data.createVehicleDriver.message, { timeout: 2000 });

                loadVehiclesDriversAsociation();
                isAssociationDriverActive.value = false;
              })
              .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
          }
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      loadVehiclesDriversAsociation();
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
      code,
      codeError,
      description,
      descriptionError,
      licensePlate,
      licensePlateError,
      branchOfficesFormatted,
      branchOfficeId,
      driverId,
      driversFormatted,
      isAssociationDriverActive,
    };
  },
};
</script>
