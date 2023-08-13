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
              <Checkbox label="Asociar vehículo" v-model="isAssociationVehicleActive" :checked="associationChecked" :disabled="hasVehicleAssociated" />
            </div>
          </div>
          <div :class="hasVehicleAssociated ? 'grid grid-cols-8' : ''">
            <VueSelect v-if="isAssociationVehicleActive" :class="(hasVehicleAssociated) ? 'col-span-7' : ''" label="Vehículo" :options="vehiclesFormatted" placeholder="Seleccione un vehículo" v-model="vehicleId" :disabled="hasVehicleAssociated ? true : false" :clearable="(vehicleId && !hasVehicleAssociated) ? true : false"/>
            <div v-if="hasVehicleAssociated && isAssociationVehicleActive" class="grid content-end py-3 px-4">
              <button type="button" class="block text-center" @click="deleteAsociation">
                <Icon icon="heroicons:trash" class="w-9" />
              </button>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Guardar</button>
        </div>
      </form>
      <DeleteVehicleDriverModalVue v-if="isModalDeleteVehicleDriverOpen" title="Eliminar asociación" :data="deleteAsociationPayload" @close-modal="isModalDeleteVehicleDriverOpen = false" @asociation-deleted="associationDeletedFunction()"/>
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
import Icon from "@/components/DashCodeComponents/Icon";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import DeleteVehicleDriverModalVue from '@/components/WebFrontendComponents/Modals/Administration/VehicleDriver/DeleteVehicleDriverModal.vue';

import { UPDATE_DRIVER, GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION, CREATE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Icon,
    Checkbox,
    Textinput,
    VueSelect,
    DeleteVehicleDriverModalVue,
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
  },
  emits: ["driver-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    let isModalDeleteVehicleDriverOpen = ref(false);

    const branchOfficeId = ref({});
    let branchOfficesFormatted = ref([]);

    const vehicleId = ref(null);
    let vehiclesFormatted = ref([]);

    const user = ref(null);
    const usersList = ref([]);
    let usersListAvailables = ref([]);

    let isAssociationVehicleActive = ref(false);
    let associationChecked = ref(false);
    let hasVehicleAssociated = ref(false);
    let associationVehicle = ref(null);

    let deleteAsociationPayload = ref({});

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

    // Function to get and set data from props

    const setData = (props) => {
      driver.driverId = props.driverId;
      driver.active = props.active;
      name.value = props.name;
      code.value = props.code;
      boxCode.value = props.boxCode;
      lastName.value = props.lastName;
      branchOfficeId.value = props.branchOfficeSelect;
      user.value = props.userSelect;
      associationChecked.value = props.hasVehicleAssociated;
      associationVehicle.value = props.vehicleAssociation;
      if (associationVehicle.value) isAssociationVehicleActive.value = true;
    }

    // Initialization function

    const initialize = () => {
      getUserList();
      loadBranchOffices();
      setData(props.data);
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initialize());

    // Getting users from keycloak

    const getUserList = () => userAdministrationService.getUsers(keycloak.token).then((response) => usersList.value = formatUserSelect(response.data));

    // Format functions

    const formatUserSelect = (data) => data.map((item) => ({ value: item.id, label: item.username }));

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

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
      }, 
      {deep: true}
    );

    watch(() => vehicles.value, (newValue) => {
      const differentValues = newValue.filter(object1 => {
        return !vehiclesDriversAsociation.value.some(object2 => {
          return object1.vehicleId === object2.vehicle.vehicleId;
        });
      });
      vehiclesFormatted.value = differentValues.map((item) => ({ value: item.vehicleId, label: item.code }));
    }, { deep: true });

    watch(() => branchOffices.value, (newValue) => { branchOfficesFormatted.value = formatbranchOfficeSelect(newValue) }, { deep: true });

    watch(() => vehiclesDriversAsociation.value, (newValue) => {
      if (isAssociationVehicleActive.value) {
        hasVehicleAssociated.value = true;
        vehicleId.value = { value: associationVehicle.value.vehicle.vehicleId, label: associationVehicle.value.vehicle.code };
      } else {
        vehicleId.value = null;
      }
    }, { deep: true });

    watch(
      () => props.data,
      (newValue) => {
        driver.driverId = newValue.driverId;
        driver.active = newValue.active;
        name.value = newValue.name;
        code.value = newValue.code;
        boxCode.value = newValue.boxCode;
        lastName.value = newValue.lastName;
        branchOfficeId.value = newValue.branchOfficeSelect;
        user.value = newValue.userSelect;
      },
      { deep: true }
    );

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

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    // vee validate use field

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: lastName, errorMessage: lastNameError, meta: lastNameMeta } = useField("lastName");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: boxCode, errorMessage: boxCodeError, meta: boxCodeMeta } = useField("boxCode");

    // Apollo mutations

    const { mutate: updateDriver } = useMutation(UPDATE_DRIVER, () => ({ variables: { inputModel: driver } }));

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

      await updateDriver()
        .then(async (response) => {
          if (response.data.updateDrive.statusCode === "OK") toast.success("Conductor actualizado exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateDrive.message, { timeout: 2000 });

          if (isAssociationVehicleActive.value && !hasVehicleAssociated.value) {
            vehicleDriver.vehicleId = vehicleId.value.value;
            vehicleDriver.driverId = driver.driverId;
            vehicleDriver.userName = keycloak.tokenParsed.preferred_username;

            await createVehicleDriver()
              .then((response) => {
                if (response.data.createVehicleDriver.statusCode === "OK") toast.success("Asociación exitosa", { timeout: 2000 });
                else toast.error(response.data.createVehicleDriver.message, { timeout: 2000 });
              })
              .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
          }
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      emit("driver-updated");
      loadVehiclesDriversAsociation();
      closeModal();
      actions.resetForm();
    });

    // Vehicle-driver association

    const deleteAsociation = () => {
      deleteAsociationPayload.value = {
        inputModel: {
          vehicleId: vehicleId.value.value,
          driverId: driver.driverId,
          userName: keycloak.tokenParsed.preferred_username
        },
        data: {
          commingFrom: 'conductor',
          label: vehicleId.value.label
        }
      }
      isModalDeleteVehicleDriverOpen.value = true;
    }

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Refres values after deletings a vehicle associated

    const associationDeletedFunction = () => {
      isAssociationVehicleActive.value = false;
      associationChecked.value = false;
      hasVehicleAssociated.value = false;
      loadVehiclesDriversAsociation();
      loadVehicles();
    }

    // Returning values

    return {
      onSubmit,
      closeModal,
      deleteAsociation,
      associationDeletedFunction,
      activeModal,
      hasVehicleAssociated,
      associationChecked,
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
      isModalDeleteVehicleDriverOpen,
      deleteAsociationPayload,
    };
  },
};
</script>
