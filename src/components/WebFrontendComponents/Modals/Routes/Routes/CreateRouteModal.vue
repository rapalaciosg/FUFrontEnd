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
              <Checkbox label="Creación de cliente" v-model="activeCustomerCreation" />
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

import { CREATE_ROUTE, GET_ALL_ROUTES } from '@/services/routes/routes/routesGraphql';
import { GET_ALL_COMPANIES, UPDATE_COMPANY } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";

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
    }
  },
  emits: ["route-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const companyId = ref({});
    let companiesFormatted = ref([]);

    const driverVehicleId = ref({});
    let driverVehicleFormatted = ref([]);
    
    const activeCustomerCreation = ref(false);

    const companySelected = ref({});

    const companyPrefix = ref("");
    const companySequential = ref("");
    const sequential = ref("");

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

    // Initialization function

    const initilize = () => {
      loadRoutes();
      loadCompanies();
      if (props.routeSettings.routeBy.value === "D") loadDrivers();
      else loadVehicles();
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Watchers

    watch(() => props.routeSettings, (newValue) => {
      if (newValue.routeBy.value === "D") loadDrivers();
      else loadVehicles();
    }, { deep: true });

    watch(() => companies.value, (newValue) => {
      companiesFormatted.value = formatCompanySelect(newValue);
      companyId.value = companiesFormatted.value[0];
    }, { deep: true });

    watch(() => drivers.value, (newValue) => {
      driverVehicleFormatted.value = formatDriverSelect(newValue);
      driverVehicleId.value = driverVehicleFormatted.value[0];
    }, { deep: true });

    watch(() => vehicles.value, (newValue) => {
      driverVehicleFormatted.value = formatVehicleSelect(newValue, props.routeSettings.routeName.value);
      driverVehicleId.value = driverVehicleFormatted.value[0];
    }, { deep: true });

    watch(() => routes.value, (newValue) => { customerSequential.value = getCustomerSequential(newValue) }, { deep: true });

    watch(
      () => companyId.value,
      (newValue) => {
        companyPrefix.value = getCompanyPrefix(companies, newValue.value);
        companySequential.value = getCompanySequential(companies, newValue.value);
        sequential.value = generateSequential(companySequential.value, 4);

        code.value = `${companyPrefix.value}-${sequential.value}`;

        companySelected.value = companies.value.find(item => item.companyId === newValue.value);

        company.companyId = companySelected.value.companyId;
        company.address = companySelected.value.address;
        company.companyTypeId = companySelected.value.companyType.companyTypeId;
        company.isDistributor = companySelected.value.isDistributor;
        company.name = companySelected.value.name;
        company.prefix = companySelected.value.prefix;
        company.provinceId = companySelected.value.province.provinceId;
        company.sequential = companySelected.value.sequential + 1;
      },
      { deep: true }
    );

    // Format functions

    const formatCompanySelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    const formatDriverSelect = (data) => data.map((item) => ({ value: item.vehicleId, label: item.code }));

    const formatVehicleSelect = (data, routeName) => {
      let valueFormated = [];

      if (routeName === "VC")  valueFormated = data.map((item) => ({ value: item.vehicleId, label: item.code }));
      else valueFormated = data.map((item) => ({ value: item.vehicleId, label: item.licensePlate }));
      
      return valueFormated;
    };

    // Function to get sequentials and generate route code

    const generateSequential = (num, totalLength) => String(num).padStart(totalLength, '0');

    const getCompanyPrefix = (data, companyId) => {
      const company = data.value.find(item => item.companyId === companyId);
      return company.prefix;
    }

    const getCustomerSequential = (data) => {
      const listSequentials = data.map(item => item.customerSequential);
      const max = Math.max(...listSequentials);
      return max;
    }

    const getCompanySequential = (data, companyId) => {
      const companySequential = data.value.find(item => item.companyId === companyId);
      return companySequential.sequential;
    }

    // Initial values

    const formValues = reactive({
      code: "",
      name: "",
      description: "",
      customerPrefix: "",
    });

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

    const company = reactive({
      companyId: 0,
      name: "",
      prefix: "",
      address: "",
      provinceId: "",
      companyTypeId: 0,
      sequential: 0,
      isDistributor: false
    });

    // Yup validations rules

    const schema = yup.object({
      code: yup.string().required("Código requerido").max(10),
      name: yup.string().required("Nombre requerido").max(50),
      description: yup.string().required("Descripción requerida").max(250),
      customerPrefix: yup.string().required("Prefijo de cliente requerido").max(10),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate userField

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: description, errorMessage: descriptionError, meta: descriptionMeta } = useField("description");
    const { value: customerPrefix, errorMessage: customerPrefixError, meta: customerPrefixMeta } = useField("customerPrefix");
    const { value: customerSequential, errorMessage: customerSequentialError, meta: customerSequentialMeta } = useField("customerSequential");

    // Apollo mutations

    const { mutate: createRoute } = useMutation(CREATE_ROUTE, () => ({ variables: { inputModel: route } }));

    const { mutate: updateCompanySequential } = useMutation(UPDATE_COMPANY, () => ({ variables: { inputModel: company } }));

    // Trigger function form

    const onSubmit = handleSubmit((values, actions) => {
      route.name = values.name;
      route.code = values.code;
      route.description = values.description;
      route.customerPrefix = values.customerPrefix.toUpperCase();
      route.customerSequential = values.customerSequential;
      route.companyId = companyId.value.value;
      route.activeCustomerCreation = activeCustomerCreation.value;
      if (props.routeSettings.routeBy.value === "V") route.vehicleId = driverVehicleId.value.value;
      else route.driverId = driverVehicleId.value.value;

      createRoute()
        .then((response) => {
          if (response.data.createRoute.statusCode === "OK") toast.success("Ruta creada exitosamente", { timeout: 2000 });
          else toast.error(response.data.createRoute.message, { timeout: 2000 });

          updateCompanySequential()
            .then(() => {
              if (response.data.updateCompany.statusCode === "OK") toast.success("Secuencial de la compañía actualizado", { timeout: 2000 });
              else toast.error(response.data.updateCompany.message, { timeout: 2000 });
            })
            .catch((error) => toast.error("Error al actualizar el secuencial de la compañía", { timeout: 2000 }))

          emit("route-created");
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
      code,
      codeError,
      description,
      descriptionError,
      customerPrefix,
      customerPrefixError,
      customerSequential,
      customerSequentialError,
      activeCustomerCreation,
      driverVehicleFormatted,
      driverVehicleId,
      companiesFormatted,
      companyId,
    };
  },
};
</script>
