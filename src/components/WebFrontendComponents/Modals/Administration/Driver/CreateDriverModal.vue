<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre" placeholder="Nombre" v-model="name" :error="nameError" :maxlength="100"/>
          <Textinput type="text" label="Apellido" placeholder="Apellido" v-model="lastName" :error="lastNameError" :maxlength="100"/>
          <Textinput type="text" label="Codigo" placeholder="Codigo" v-model="code" :error="codeError" :maxlength="10"/>
          <Textinput type="text" label="Código de caja" placeholder="Código de caja" v-model="boxCode" :error="boxCodeError" :maxlength="50"/>
          <VueSelect label="Sucursal" :options="branchOfficesFormatted" placeholder="Seleccione una sucursal" v-model="branchOfficeId" :clearable="false"/>
          <VueSelect label="Usuarios" :options="usersListAvailables" placeholder="Seleccione un usuario" v-model="user" :clearable="false"/>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Asociar a un vehículo</label>
            <div class="pt-2">
              <Checkbox label="Asociar vehículo" v-model="isAssociationVehicleActive" />
            </div>
          </div>
          <VueSelect v-if="isAssociationVehicleActive" label="Vehículos" :options="vehiclesFormatted" placeholder="Seleccione un vehículo" v-model="vehicleId" :clearable="false"/>
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

import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import { CREATE_DRIVER, GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION, CREATE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
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
  emits: ["driver-created"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const isAssociationVehicleActive = ref(false);

    const user = ref(null);
    const usersList = ref([]);
    let usersListAvailables = ref([]);

    const vehicleId = ref({});
    let vehiclesFormatted = ref([]);

    const branchOfficeId = ref({});
    let branchOfficesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetDrivers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_DRIVERS));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION));

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    // Apollo fetching data from queries

    const drivers = computed(() => queryGetDrivers.result.value?.srvDriver ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    const vehiclesDriversAsociation = computed(() => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []);

    // Apollo lazy functions

    const loadDrivers = () => queryGetDrivers.load() || queryGetDrivers.refetch();

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    const loadVehiclesDriversAsociation = () => queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();

    // Before mounted

    onBeforeMount(() => {
      loadDrivers();
      loadVehiclesDriversAsociation();
      loadVehicles();
    });

    // Initialization function

    const initialize = () => {
      getUserList();
      loadBranchOffices();
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initialize());

    // Getting users from keycloak

    const getUserList = () => userAdministrationService.getUsers(keycloak.token).then((response) => usersList.value = formatUserSelect(response.data));

    // Format functions

    const formatUserSelect = (data) =>  data.map((item) => ({ value: item.id, label: item.username }));

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName}));

    // Watchers

    watch(
      () => usersList.value, 
      (newValue) => {
        const differentValues = newValue.filter(object1 => {
          return !drivers.value.some(object2 => {
            return object1.value === object2.keycloakUserId;
          });
        });
        usersListAvailables.value = differentValues.map((item) => ({ value: item.id, label: item.label }));
        user.value = usersListAvailables.value[0] 
      }, 
      {deep: true}
    );

    watch(
      () => vehicles.value,
      (newValue) => {
        const differentValues = newValue.filter(object1 => {
          return !vehiclesDriversAsociation.value.some(object2 => {
            return object1.vehicleId === object2.vehicle.vehicleId;
          });
        });
        vehiclesFormatted.value = differentValues.map((item) => ({ value: item.vehicleId, label: item.code }));
        vehicleId.value = vehiclesFormatted.value[0];
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
      lastName: "",
      code: "",
      boxCode: "",
    });

    // Input model

    const driver = reactive({
      driverId: 0,
      branchOfficeId: 0,
      name: "",
      lastName: "",
      code: "",
      boxCode: "",
      active: true,
      keycloakUserId: "",
      keycloakUser: "",
    });

    const vehicleDriver = reactive({
      vehicleId: 0,
      driverId: 0,
      userName: "",
    });

    // Yup validations rules

    const schema = yup.object({
      name: yup.string().required("Nombre requerido").max(100),
      lastName: yup.string().required("Apellido requerido").max(100),
      code: yup.string().required("Código requerido").max(10),
      boxCode: yup.string().required("Código de caja requerido").max(50),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // vee validate use field

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: lastName, errorMessage: lastNameError, meta: lastNameMeta } = useField("lastName");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: boxCode, errorMessage: boxCodeError, meta: boxCodeMeta } = useField("boxCode");

    // Apollo mutations

    const { mutate: createDriver } = useMutation(CREATE_DRIVER, () => ({ variables: { inputModel: driver } }));

    const { mutate: createVehicleDriver } = useMutation(CREATE_VEHICLE_DRIVER, () => ({ variables: { inputModel: vehicleDriver } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      driver.name = values.name;
      driver.lastName = values.lastName;
      driver.code = values.code.toUpperCase();
      driver.boxCode = values.boxCode.toUpperCase();
      driver.branchOfficeId = branchOfficeId.value.value;
      driver.keycloakUser = user.value.label;
      driver.keycloakUserId = user.value.value;

      await createDriver()
        .then(async (response) => {
          if (response.data.createDrive.statusCode === "OK") toast.success("Conductor creado exitosamente", { timeout: 2000 });
          else toast.error(response.data.createDrive.message, { timeout: 2000 });

          emit("driver-created");

          if (isAssociationVehicleActive.value) {
            vehicleDriver.vehicleId = vehicleId.value.value;
            vehicleDriver.driverId = +response.data.createDrive.idObject;
            vehicleDriver.userName = keycloak.tokenParsed.preferred_username;

            await createVehicleDriver()
              .then((response) => {
                if (response.data.createVehicleDriver.statusCode === "OK") toast.success("Asociación exitosa", { timeout: 2000 });
                else toast.error(response.data.createVehicleDriver.message, { timeout: 2000 });

                loadVehiclesDriversAsociation();
                isAssociationVehicleActive.value = false;
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
      lastName,
      lastNameError,
      boxCode,
      boxCodeError,
      branchOfficesFormatted,
      branchOfficeId,
      user,
      usersList,
      usersListAvailables,
      vehiclesFormatted,
      vehicleId,
      isAssociationVehicleActive,
    };
  },
};
</script>
