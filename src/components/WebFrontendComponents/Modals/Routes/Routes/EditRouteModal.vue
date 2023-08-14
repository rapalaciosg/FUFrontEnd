<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre" placeholder="Nombre" v-model="name" :error="nameError" :maxlength="50"/>
          <Textinput type="text" label="Código" placeholder="Código" v-model="code" :error="codeError" disabled/>
          <Textinput type="text" label="Descripción" placeholder="Descripción" v-model="description" :error="descriptionError" :maxlength="250"/>
          <Textinput type="text" label="Prefijo de cliente" placeholder="Prefijo de cliente" v-model="customerPrefix" :error="customerPrefixError" :maxlength="10"/>
          <Textinput type="number" label="Secuencial de cliente" placeholder="Secuencial de cliente" v-model="customerSequential" :error="customerSequentialError" disabled/>
          <VueSelect label="Compañía" :options="companiesFormatted" placeholder="Seleccione una compañía" v-model="companyId" :clearable="false"/>
          <VueSelect :label="(routeSettings.routeBy.value === 'D' ? 'Conductores' : 'Vehículos')" :options="driverVehicleFormatted" placeholder="Seleccione una opción" v-model="driverVehicleId" :clearable="false"/>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Creación de cliente</label>
            <div class="pt-2">
              <Checkbox label="Creación de cliente" v-model="activeCustomerCreation" :checked="defaultValue" />
            </div>
          </div>
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
import { ref, watch, reactive, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Checkbox from "@/components/DashCodeComponents/Checkbox";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { UPDATE_ROUTE } from '@/services/routes/routes/routesGraphql';
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_ALL_ROUTES } from "@/services/routes/routes/routesGraphql.js";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
    Checkbox
  },
  props: {
    routeSettings: {
      type: Object,
      default: {}
    },
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ["route-updated"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const driverVehicleId = ref({});
    let driverVehicleFormatted = ref([]);

    const companyId = ref({});
    let companiesFormatted = ref([]);
    
    const activeCustomerCreation = ref(false);
    const defaultValue = ref(false);

    // Apollo queries initialization

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetRoutes = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_ROUTES));

    const queryGetDrivers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_DRIVERS));

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    // Apollo fetching data from queries

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutes ?? []);

    const drivers = computed(() => queryGetDrivers.result.value?.srvDriver ?? []);

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    // Apollo lazy functions

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    const loadRoutes = () => queryGetRoutes.load() || queryGetRoutes.refetch();

    const loadDrivers = () => queryGetDrivers.load() || queryGetDrivers.refetch();

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    // Function to get and set data from props

    const setData = (props) => {
      route.routeId = props.routeId;
      customerSequential.value = props.customerSequential;
      activeCustomerCreation.value = props.activeCustomerCreation;
      name.value = props.name;
      code.value = props.code;
      description.value = props.description;
      customerPrefix.value = props.customerPrefix;

      if (activeCustomerCreation.value) defaultValue.value = true;
      else defaultValue.value = false;

      if (props.routeSettings.routeBy.value === "V") {
        driverVehicleId.value = findSelectValues(
          driverVehicleFormatted,
          props.vehicle.vehicleId
        );
      } else {
        driverVehicleId.value = findSelectValues(
          driverVehicleFormatted,
          props.driver.driverId
        );
      }
      companyId.value = props.companySelect;
    }

    // Initialization function

    const initilize = () => {
      loadRoutes();
      loadCompanies();
      setData(props.data);
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Watchers

    watch(() => props.routeSettings, (newValue) => {
      if (newValue.routeBy.value === "D") loadDrivers();
      else loadVehicles();
    }, { deep: true });

    watch(() => companies.value, (newValue) => { companiesFormatted.value = formatCompanySelect(newValue) }, { deep: true });

    watch(() => drivers.value, (newValue) => { driverVehicleFormatted.value = formatDriverSelect(newValue) }, { deep: true });

    watch(() => vehicles.value, (newValue) => { driverVehicleFormatted.value = formatVehicleSelect(newValue, props.routeSettings.routeName.value) }, { deep: true });

    watch(() => props.data, (newValue) => {
      route.routeId = newValue.routeId;
      customerSequential.value = newValue.customerSequential;
      activeCustomerCreation.value = newValue.activeCustomerCreation;
      name.value = newValue.name;
      code.value = newValue.code;
      description.value = newValue.description;
      customerPrefix.value = newValue.customerPrefix;
      if (activeCustomerCreation.value) defaultValue.value = true;
      else defaultValue.value = false;
      if (props.routeSettings.routeBy.value === "V") {
        driverVehicleId.value = findSelectValues(
          driverVehicleFormatted,
          newValue.vehicle.vehicleId
        );
      } else {
        driverVehicleId.value = findSelectValues(
          driverVehicleFormatted,
          newValue.driver.driverId
        );
      }
      companyId.value = newValue.companySelect;
    }, { deep: true });

    // Format functions

    const formatCompanySelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    const formatDriverSelect = (data) => data.map((item) => ({ value: item.vehicleId, label: item.code }));

    const formatVehicleSelect = (data, routeName) => {
      let valueFormated = [];

      if (routeName === "VC") valueFormated = data.map((item) => ({ value: item.vehicleId, label: item.code }));
      else valueFormated = data.map((item) => ({ value: item.vehicleId, label: item.licensePlate }));

      return valueFormated;
    };

    const findSelectValues = (data, id) => data.value.find((item) => item.value === id);

    // Input model

    const route = reactive({
      routeId: 0,
      companyId: 0,
      code: "",
      name: "",
      description: "",
      customerPrefix: "",
      customerSequential: 0,
      activeCustomerCreation: false,
      vehicleId: null,
      driverId: null
    });

    // Yup validations rules

    const schema = yup.object({
      code: yup.string().required("Código requerido").max(10),
      name: yup.string().required("Nombre requerido").max(50),
      description: yup.string().required("Descripción requerida").max(250),
      customerPrefix: yup.string().required("Prefijo de cliente requerido").max(10),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    // Vee validate userField

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: description, errorMessage: descriptionError, meta: descriptionMeta } = useField("description");
    const { value: customerPrefix, errorMessage: customerPrefixError, meta: customerPrefixMeta } = useField("customerPrefix");
    const { value: customerSequential, errorMessage: customerSequentialError, meta: customerSequentialMeta } = useField("customerSequential");

    // Apollo mutations

    const { mutate: updateRoute } = useMutation(UPDATE_ROUTE, () => ({ variables: { inputModel: route } }));

    const onSubmit = handleSubmit((values, actions) => {
      route.name = values.name;
      route.code = values.code.toUpperCase();
      route.description = values.description;
      route.customerPrefix = values.customerPrefix.toUpperCase();
      route.customerSequential = values.customerSequential;
      route.companyId = companyId.value.value;
      route.activeCustomerCreation = activeCustomerCreation.value;
      if (props.routeSettings.routeBy.value === "V") route.vehicleId = driverVehicleId.value.value;
      else route.driverId = driverVehicleId.value.value;

      updateRoute()
        .then((response) => {
          if (response.data.updateRoute.statusCode === "OK") toast.success("Ruta actualizada exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateRoute.message, { timeout: 2000 });

          emit("route-updated");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      closeModal,
      name,
      nameError,
      code,
      codeError,
      description,
      descriptionError,
      customerPrefix,
      customerPrefixError,
      customerSequential,
      customerSequentialError,
      onSubmit,
      activeCustomerCreation,
      driverVehicleFormatted,
      driverVehicleId,
      defaultValue,
      companiesFormatted,
      companyId,
    };
  },
};
</script>
