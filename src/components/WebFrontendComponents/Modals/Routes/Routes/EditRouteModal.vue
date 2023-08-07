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
            label="Código"
            placeholder="Código"
            v-model="code"
            :error="codeError"
            disabled
          />
          <Textinput
            type="text"
            label="Descripción"
            placeholder="Descripción"
            v-model="description"
            :error="descriptionError"
          />
          <Textinput
            type="text"
            label="Prefijo de cliente"
            placeholder="Prefijo de cliente"
            v-model="customerPrefix"
            :error="customerPrefixError"
          />
          <Textinput
            type="number"
            label="Secuencial de cliente"
            placeholder="Secuencial de cliente"
            v-model="customerSequential"
            :error="customerSequentialError"
            disabled
          />
          <VueSelect
            label="Compañia"
            :options="companiesFormatted"
            placeholder="Seleccione una compañia"
            v-model="companyId"
            :clearable="false"
          />
          <VueSelect
            :label="(routeSettings.routeBy.value === 'D' ? 'Conducrores' : 'Vehículos')"
            :options="driverVehicleFormatted"
            placeholder="Seleccione una opción"
            v-model="driverVehicleId"
            :clearable="false"
          />
          <div>
            <label class="ltr:inline-block rtl:block input-label">Creación de cliente</label>
            <div class="pt-2">
              <Checkbox label="Creación de cliente" v-model="activeCustomerCreation" :checked="defaultValue" />
            </div>
          </div>
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
import Checkbox from "@/components/DashCodeComponents/Checkbox";

import { UPDATE_ROUTE } from '@/services/routes/routes/routesGraphql';
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_DRIVERS } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_ALL_ROUTES } from "@/services/routes/routes/routesGraphql.js";
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
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    let driverVehicleFormatted = ref([]);
    let companiesFormatted = ref([]);

    const driverVehicleId = ref({});
    const companyId = ref({});
    const activeCustomerCreation = ref(false);
    const defaultValue = ref(false);

    const queryGetCompanies = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_COMPANIES)
    );

    const queryGetRoutes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_ROUTES)
    );

    const queryGetDrivers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_DRIVERS)
    );

    const queryGetVehicles = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_VEHICLES)
    );

    const companies = computed(
      () => queryGetCompanies.result.value?.srvCompanies ?? []
    );

    const routes = computed(
      () => queryGetRoutes.result.value?.srvRoutes ?? []
    );

    const drivers = computed(
      () => queryGetDrivers.result.value?.srvDriver ?? []
    );

    const vehicles = computed(
      () => queryGetVehicles.result.value?.srvVehicle ?? []
    );

    const loadCompanies = () => {
      queryGetCompanies.load() || queryGetCompanies.refetch();
    };

    const loadRoutes = () => {
      queryGetRoutes.load() || queryGetRoutes.refetch();
    };

    const loadDrivers = () => {
      queryGetDrivers.load() || queryGetDrivers.refetch();
    };

    const loadVehicles = () => {
      queryGetVehicles.load() || queryGetVehicles.refetch();
    };

    const initilize = () => {
      loadRoutes();
      loadCompanies();
    };

    onMounted(() => initilize());

    watch(() => props.routeSettings, (newValue) => {
      if (newValue.routeBy.value === "D") loadDrivers();
      else loadVehicles();
    }, { deep: true });

    watch(() => companies.value, (newValue) => {
      companiesFormatted.value = formatCompanySelect(companies);
      companyId.value = companiesFormatted.value[0];
    }, { deep: true })

    watch(() => drivers.value, (newValue) => {
      driverVehicleFormatted.value = formatDriverSelect(drivers);
      driverVehicleId.value = driverVehicleFormatted.value[0];
    }, { deep: true })

    watch(() => vehicles.value, (newValue) => {
      driverVehicleFormatted.value = formatVehicleSelect(vehicles, props.routeSettings.routeName.value);
      driverVehicleId.value = driverVehicleFormatted.value[0];
    }, { deep: true })

    const formatCompanySelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.companyId,
        label: item.name,
      }));
      return valueFormated;
    };

    const formatDriverSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.vehicleId,
        label: item.code,
      }));
      return valueFormated;
    };

    const formatVehicleSelect = (data, routeName) => {
      let valueFormated = [];

      if (routeName === "VC") {
        valueFormated = data.value.map((item) => ({
          value: item.vehicleId,
          label: item.code,
        }));
      } else {
        valueFormated = data.value.map((item) => ({
          value: item.vehicleId,
          label: item.licensePlate,
        }));
      }
      return valueFormated;
    };

    watch(() => props.data, (newValue) => {
      console.log('newValue => ', newValue);
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
      companyId.value = findSelectValues(
          companiesFormatted,
          newValue.company.companyId
        );
    }, { deep: true });

    const findSelectValues = (data, id) => {
      const filteredValue = data.value.find((item) => item.value === id);
      return filteredValue;
    };

    // const getSequential = (data) => {
    //   const listSequentials = data.value.map(item => item.customerSequential);
    //   const max = Math.max(...listSequentials);
    //   return max + 1;
    // }

    watch(
      () => routes.value,
      (newValue) => {
        //route.customerSequential = getSequential(routes);
        //customerSequential.value = getSequential(routes);
      },
      { deep: true }
    );

    const formValues = reactive({
      code: "",
      name: "",
      description: "",
      customerPrefix: "",
    });

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

    const schema = yup.object({
      code: yup.string().required("Código requerido").max(10),
      name: yup.string().required("Nombre requerido"),
      description: yup.string().required("Descripción requerida"),
      customerPrefix: yup.string().required("Prefijo de cliente requerido").max(10),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: formValues,
    });

    watch(
      () => closeModal.value,
      (newValue) => {
        resetForm();
        driverVehicleId.value = driverVehicleFormatted.value[0];
        activeCustomerCreation.value = false;
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
      value: customerPrefix,
      errorMessage: customerPrefixError,
      meta: customerPrefixMeta,
    } = useField("customerPrefix");
    const {
      value: customerSequential,
      errorMessage: customerSequentialError,
      meta: customerSequentialMeta,
    } = useField("customerSequential");

    const { mutate: updateRoute } = useMutation(UPDATE_ROUTE, () => ({
      variables: { inputModel: route },
    }));

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
          emit("route-updated");
          toast.success("Ruta actualizada exitosamente", {
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
      activeCustomerCreation.value = false;
    });

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
