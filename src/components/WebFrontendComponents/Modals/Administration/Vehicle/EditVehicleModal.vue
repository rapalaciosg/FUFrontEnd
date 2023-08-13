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
              <Checkbox label="Asociar conductor" v-model="isAssociationDriverActive" :checked="associationChecked" :disabled="hasDriverAssociated" />
            </div>
          </div>
          <div :class="hasDriverAssociated ? 'grid grid-cols-8' : ''">
            <VueSelect v-if="isAssociationDriverActive" :class="(hasDriverAssociated) ? 'col-span-7' : ''" label="Conductor" :options="driversFormatted" placeholder="Seleccione un conductor" v-model="driverId" :disabled="hasDriverAssociated ? true : false" :clearable="(driverId && !hasDriverAssociated) ? true : false"/>
            <div v-if="hasDriverAssociated && isAssociationDriverActive" class="grid content-end py-3 px-4">
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
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Icon from "@/components/DashCodeComponents/Icon";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import keycloak from "@/security/KeycloakService";

import DeleteVehicleDriverModalVue from '@/components/WebFrontendComponents/Modals/Administration/VehicleDriver/DeleteVehicleDriverModal.vue';

import { UPDATE_VEHICLE, GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION, CREATE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import { GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";

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
  emits: ["vehicle-updated", "close-modal"],
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

    const driverId = ref(null);
    let driversFormatted = ref([]);

    let isAssociationDriverActive = ref(false);
    let associationChecked = ref(false);
    let hasDriverAssociated = ref(false);
    let associationDriver = ref(null);

    let deleteAsociationPayload = ref({});

    // Apollo queries initialization

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION));

    const queryGetDrivers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_DRIVERS));

    // Apollo fetching data from queries

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    const drivers = computed(() => queryGetDrivers.result.value?.srvDriver ?? []);

    const vehiclesDriversAsociation = computed(() => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    // Apollo lazy functions

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadDrivers = () => queryGetDrivers.load() || queryGetDrivers.refetch();

    const loadVehiclesDriversAsociation = () => queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();

    // Before mounted

    onBeforeMount(() => {
      loadVehicles();
      loadVehiclesDriversAsociation();
      loadDrivers();
    });

    // Function to get and set data from props

    const setData = (props) => {
      vehicle.vehicleId = props.vehicleId;
      vehicle.active = props.active;
      name.value = props.name;
      code.value = props.code;
      description.value = props.description;
      licensePlate.value = props.licensePlate;
      branchOfficeId.value = props.branchOfficeSelect;
      associationChecked.value = props.hasDriverAssociated;
      associationDriver.value = props.driverAssociation;
      if (associationDriver.value) isAssociationDriverActive.value = true;
    }

    // Initialization function

    const initilize = () => {
      loadBranchOffices();
      setData(props.data);
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

    // Watchers

    watch(() => drivers.value, (newValue) => {
      const differentValues = newValue.filter(object1 => {
        return !vehiclesDriversAsociation.value.some(object2 => {
          return object1.driverId === object2.driver.driverId;
        });
      });
      driversFormatted.value = differentValues.map((item) => ({ value: item.driverId, label: item.code }));
    }, { deep: true });

    watch(() => branchOffices.value, (newValue) => { branchOfficesFormatted.value = formatbranchOfficeSelect(newValue) }, { deep: true });

    watch(() => vehiclesDriversAsociation.value, (newValue) => {
      if (isAssociationDriverActive.value) {
        hasDriverAssociated.value = true;
        driverId.value = { value: associationDriver.value.driver.driverId, label: associationDriver.value.driver.code };
      } else {
        driverId.value = null;
      }
    }, { deep: true });

    watch(
      () => props.data,
      (newValue) => {
        vehicle.vehicleId = newValue.vehicleId;
        vehicle.active = newValue.active;
        name.value = newValue.name;
        code.value = newValue.code;
        description.value = newValue.description;
        licensePlate.value = newValue.licensePlate;
        branchOfficeId.value = newValue.branchOfficeSelect;
      },
      { deep: true }
    );

    // Input model

    const vehicle = reactive({
      vehicleId: 0,
      name: "",
      code: "",
      description: "",
      licensePlate: "",
      branchOfficeId: 0,
      active: false,
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

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: description, errorMessage: descriptionError, meta: descriptionMeta } = useField("description");
    const { value: licensePlate, errorMessage: licensePlateError, meta: licensePlateMeta } = useField("licensePlate");

    // vee validate use field

    const { mutate: updateVehicle } = useMutation(UPDATE_VEHICLE, () => ({ variables: { inputModel: vehicle } }));

    const { mutate: createVehicleDriver } = useMutation(CREATE_VEHICLE_DRIVER, () => ({ variables: { inputModel: vehicleDriver } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      vehicle.name = values.name;
      vehicle.code = values.code.toUpperCase();
      vehicle.description = values.description;
      vehicle.licensePlate = licensePlate;
      vehicle.branchOfficeId = branchOfficeId.value.value;

      await updateVehicle()
        .then(async (response) => {
          if (response.data.updateVehicle.statusCode === "OK") toast.success("Vehículo actualizado exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateVehicle.message, { timeout: 2000 });

          if (isAssociationDriverActive.value && !hasDriverAssociated.value) {
            vehicleDriver.vehicleId = vehicle.vehicleId;
            vehicleDriver.driverId = driverId.value.value;
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

      emit("vehicle-updated");
      loadVehiclesDriversAsociation();
      closeModal();
      actions.resetForm();
    });

    // Vehicle-driver association

    const deleteAsociation = () => {
      deleteAsociationPayload.value = {
        inputModel: {
          vehicleId: vehicle.vehicleId,
          driverId: driverId.value.value,
          userName: keycloak.tokenParsed.preferred_username
        },
        data: {
          commingFrom: 'vehículo',
          label: driverId.value.label
        }
      }
      isModalDeleteVehicleDriverOpen.value = true;
    }

     // Close modal function

     const closeModal = () => emit('close-modal');

    // Refres values after deletings a vehicle associated

    const associationDeletedFunction = () => {
      isAssociationDriverActive.value = false;
      associationChecked.value = false;
      hasDriverAssociated.value = false;
      loadVehiclesDriversAsociation();
      loadDrivers();
    }

    // Returning values

    return {
      onSubmit,
      closeModal,
      deleteAsociation,
      associationDeletedFunction,
      activeModal,
      hasDriverAssociated,
      associationChecked,
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
      driversFormatted,
      driverId,
      isAssociationDriverActive,
      isModalDeleteVehicleDriverOpen,
      deleteAsociationPayload,
    };
  },
};
</script>
