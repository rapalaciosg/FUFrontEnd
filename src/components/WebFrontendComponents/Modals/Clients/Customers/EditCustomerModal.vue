<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect
            label="Ruta"
            :options="routesFormatted"
            placeholder="Seleccione una ruta"
            v-model="routeId"
            :clearable="false"
            disabled
          />
          <VueSelect
            label="Provincia"
            :options="provincesFormatted"
            placeholder="Seleccione una provincia"
            v-model="provinceId"
            :clearable="false"
          />
          <Textinput
            type="text"
            label="Nombre"
            placeholder="Ingrese el nombre del cliente"
            v-model="name"
            :error="nameError"
            :maxlength="100"
          />
          <VueSelect
            label="Distrito"
            :options="districtsFormatted"
            placeholder="Seleccione un distrito"
            v-model="districtId"
            :clearable="false"
          />
          <Textinput
            type="text"
            label="Apellido"
            placeholder="Ingrese el apellido del cliente"
            v-model="lastName"
            :error="lastNameError"
            :maxlength="100"
          />
          <VueSelect
            label="Corregimiento"
            :options="townshipsFormatted"
            placeholder="Seleccione un corregimiento"
            v-model="townshipId"
            :clearable="false"
          />
          <Textinput
            type="text"
            label="Código"
            placeholder="Código del cliente"
            v-model="code"
            :error="codeError"
            disabled
          />
          <VueSelect
            label="Lugar poblado"
            :options="villagesFormatted"
            placeholder="Seleccione un lugar poblado"
            v-model="villageId"
            :clearable="false"
          />
          <Textinput
            type="text"
            label="Tarjeta de identificación"
            placeholder="Ingrese el identificador"
            v-model="identityCard"
            :error="identityCardError"
            :maxlength="50"
          />
          <Textinput
            type="text"
            label="Dirección"
            placeholder="Ingrese la dirección"
            v-model="address"
            :error="addressError"
            :maxlength="200"
          />
          <Textinput
            type="text"
            label="Número de casa"
            placeholder="Ingrese el número de casa"
            v-model="houseNumber"
            :error="houseNumberError"
            :maxlength="10"
          />
          <Textinput
            type="text"
            label="Nombre de contacto"
            placeholder="Ingrese el nombre de contacto"
            v-model="contactName"
            :error="contactNameError"
            :maxlength="100"
          />
          <Textinput
            type="text"
            label="latitud"
            placeholder="Ingrese la latitud"
            v-model="latitude"
            :error="latitudeError"
            :maxlength="12"
          />
          <Textinput
            type="text"
            label="Teléfono"
            placeholder="Ingrese el teléfono"
            v-model="phone"
            :error="phoneError"
            :maxlength="75"
          />
          <Textinput
            type="text"
            label="longitud"
            placeholder="Ingrese la longitud"
            v-model="longitude"
            :error="longitudeError"
            :maxlength="12"
          />
          <Textinput
            type="email"
            label="Correo"
            placeholder="Ingrese el correo"
            v-model="email"
            :error="emailError"
            :maxlength="250"
          />
          <VueSelect
            label="Tipo de impuesto"
            :options="taxPayerTypesFormatted"
            placeholder="Seleccione un tipo de impuesto"
            v-model="taxPayerTypeId"
            :clearable="false"
          />
          <VueSelect
            label="Tipo de cliente"
            :options="customerTypesFormatted"
            placeholder="Seleccione un tipo de cliente"
            v-model="customerTypeId"
            :clearable="false"
          />
          <Textinput
            type="text"
            label="Dv"
            placeholder="Ingrese dv"
            v-model="dv"
            :error="dvError"
            :maxlength="20"
          />
        </div>
        <div
          class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            class="btn btn-secondary block text-center"
            @click="closeModal()"
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
import { useField, useForm } from "vee-validate";

import * as yup from "yup";
import keycloak from "@/security/KeycloakService";
import moment from "moment";

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

import {
  GET_ALL_CUSTOMERS,
  UPDATE_CUSTOMER,
} from "@/services/clients/customers/customersGraphql.js";
import { GET_ALL_ROUTES } from "@/services/routes/routes/routesGraphql.js";
import { GET_ALL_CUSTOMER_TYPE } from "@/services/catalogs/customerType/customerTypeGraphql.js";
import { GET_ALL_TAX_PAYER_TYPE } from "@/services/catalogs/taxPayerType/taxPayerTypeGraphql.js";
import { GET_ALL_PROVINCES } from "@/services/catalogs/provinces/provincesGraphql.js";
import { GET_ALL_DISTRICTS_BY_PROVINCE_ID } from "@/services/catalogs/district/districtGraphql.js";
import { GET_ALL_TOWNSHIP_BY_DISTRICT_ID } from "@/services/catalogs/township/twonshipGraphql.js";
import { GET_ALL_VILLAGE_BY_TOWNSHIP_ID } from "@/services/catalogs/village/villageGraphql.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ["customer-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    let routesFormatted = ref([]);
    let customerTypesFormatted = ref([]);
    let taxPayerTypesFormatted = ref([]);
    let provincesFormatted = ref([]);
    let districtsFormatted = ref([]);
    let townshipsFormatted = ref([]);
    let villagesFormatted = ref([]);

    const routeId = ref({});
    const customerTypeId = ref({});
    const taxPayerTypeId = ref({});
    const provinceId = ref({});
    const districtId = ref({});
    const townshipId = ref({});
    const villageId = ref({});

    let routeSelected = ref({});

    // Apollo variables

    const variablesDistrics = reactive({ id: "" });
    const variablesTownShips = reactive({ id: "" });
    const variablesVillages = reactive({ id: "" });

    // Apollo queries initialization

    const queryGetCustomers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_CUSTOMERS)
    );

    const queryGetRoutes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_ROUTES)
    );

    const queryGetCustomerTypes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_CUSTOMER_TYPE)
    );

    const queryGetTaxPayerTypes = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_TAX_PAYER_TYPE)
    );

    const queryGetProvinces = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_PROVINCES)
    );

    const queryGetDistricts = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_DISTRICTS_BY_PROVINCE_ID, variablesDistrics)
    );

    const queryGetTownships = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_TOWNSHIP_BY_DISTRICT_ID, variablesTownShips)
    );

    const queryGetVillages = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_VILLAGE_BY_TOWNSHIP_ID, variablesVillages)
    );

    // Apollo fetching data from queries

    const customers = computed(
      () => queryGetCustomers.result.value?.srvCustomer ?? []
    );

    const routes = computed(() => queryGetRoutes.result.value?.srvRoutes ?? []);

    const customerTypes = computed(
      () => queryGetCustomerTypes.result.value?.srvCustomerTypes ?? []
    );

    const taxPayerTypes = computed(
      () => queryGetTaxPayerTypes.result.value?.srvTaxpayerTypes ?? []
    );

    const provinces = computed(
      () => queryGetProvinces.result.value?.srvProvince ?? []
    );

    const districts = computed(
      () => queryGetDistricts.result.value?.srvDistrictByProvinceId ?? []
    );

    const townships = computed(
      () => queryGetTownships.result.value?.srvTownshipByDistrictId ?? []
    );

    const villages = computed(
      () => queryGetVillages.result.value?.srvVillageByTownshipId ?? []
    );

    // Apollo lazy functions

    const loadCustomers = () =>
      queryGetCustomers.load() || queryGetCustomers.refetch();

    const loadRoutes = () => queryGetRoutes.load() || queryGetRoutes.refetch();

    const loadCustomerTypes = () =>
      queryGetCustomerTypes.load() || queryGetCustomerTypes.refetch();

    const loadTaxPayerTypes = () =>
      queryGetTaxPayerTypes.load() || queryGetTaxPayerTypes.refetch();

    const loadProvinces = () =>
      queryGetProvinces.load() || queryGetProvinces.refetch();

    const loadDistricts = () =>
      queryGetDistricts.load() || queryGetDistricts.refetch();

    const loadTownships = () =>
      queryGetTownships.load() || queryGetTownships.refetch();

    const loadVillages = () =>
      queryGetVillages.load() || queryGetVillages.refetch();

    // Before mounted function

    onBeforeMount(() => {
      loadRoutes();
      loadCustomerTypes();
      loadTaxPayerTypes();
      loadProvinces();
      loadCustomers();
    });

    // Function to get and set data from props

    const setData = (props) => {
      customer.customerId = props.customerId;
      customer.active = props.active;
      customer.createBy = props.createBy;
      routeId.value = props.routeSelect;
      name.value = props.name;
      lastName.value = props.lastName;
      code.value = props.code;
      address.value = props.address;
      identityCard.value = props.identityCard;
      address.value = props.address;
      provinceId.value = props.provinceSelect;
      districtId.value = props.districtSelect;
      townshipId.value = props.townshipSelect;
      villageId.value = props.villageSelect;
      houseNumber.value = props.houseNumber;
      latitude.value = props.latitude;
      longitude.value = props.longitude;
      customerTypeId.value = props.customerTypeSelect;
      contactName.value = props.contactName;
      phone.value = props.phone;
      email.value = props.email;
      taxPayerTypeId.value = props.taxpayerTypeSelect;
      dv.value = props.dv;
    }

    // Initialization function

    const initilize = () => {
      setData(props.data);
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatRouteSelect = (data) =>
      data.map((item) => ({
        value: item.routeId,
        label: item.name,
        code: item.customerPrefix,
      }));

    const formatCustomerTypeSelect = (data) =>
      data.map((item) => ({ value: item.customerTypeId, label: item.name }));

    const formatTaxPayerTypeSelect = (data) =>
      data.map((item) => ({ value: item.taxpayerTypeId, label: item.name }));

    const formatProvinceSelect = (data) =>
      data.map((item) => ({ value: item.provinceId, label: item.name }));

    const formatDistrictSelect = (data) =>
      data.map((item) => ({ value: item.districtId, label: item.name }));

    const formatTownshipSelect = (data) =>
      data.map((item) => ({ value: item.townshipId, label: item.name }));

    const formatVillageSelect = (data) =>
      data.map((item) => ({ value: item.villageId, label: item.name }));

    const getSCustomerCode = (data) => {
      const listSequentials = data.value.map((item) => item.customerSequential);
      const max = Math.max(...listSequentials);
      return max + 1;
    };

    const generateSequential = (num, totalLength) =>
      String(num).padStart(totalLength, "0");

    // Watchers

    watch(
      () => routes.value,
      (newValue) => {
        routesFormatted.value = formatRouteSelect(newValue);
        routeId.value = routesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => customerTypes.value,
      (newValue) => {
        customerTypesFormatted.value = formatCustomerTypeSelect(newValue);
        customerTypeId.value = customerTypesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => taxPayerTypes.value,
      (newValue) => {
        taxPayerTypesFormatted.value = formatTaxPayerTypeSelect(newValue);
        taxPayerTypeId.value = taxPayerTypesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => provinces.value,
      (newValue) => {
        provincesFormatted.value = formatProvinceSelect(newValue);
        provinceId.value = provincesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => districts.value,
      (newValue) => {
        districtsFormatted.value = formatDistrictSelect(newValue);
        districtId.value = districtsFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => townships.value,
      (newValue) => {
        townshipsFormatted.value = formatTownshipSelect(newValue);
        townshipId.value = townshipsFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => villages.value,
      (newValue) => {
        villagesFormatted.value = formatVillageSelect(newValue);
        villageId.value = villagesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => props.data,
      (newValue) => {
        customer.customerId = newValue.customerId;
        customer.active = newValue.active;
        customer.createBy = newValue.createBy;
        routeId.value = newValue.routeSelect;
        name.value = newValue.name;
        lastName.value = newValue.lastName;
        code.value = newValue.code;
        address.value = newValue.address;
        identityCard.value = newValue.identityCard;
        address.value = newValue.address;
        provinceId.value = newValue.provinceSelect;
        districtId.value = newValue.districtSelect;
        townshipId.value = newValue.townshipSelect;
        villageId.value = newValue.villageSelect;
        houseNumber.value = newValue.houseNumber;
        latitude.value = newValue.latitude;
        longitude.value = newValue.longitude;
        customerTypeId.value = newValue.customerTypeSelect;
        contactName.value = newValue.contactName;
        phone.value = newValue.phone;
        email.value = newValue.email;
        taxPayerTypeId.value = newValue.taxpayerTypeSelect;
        dv.value = newValue.dv;
      },
      { deep: true }
    );

    // Hierarchical function

    watch(
      () => provinceId.value,
      (newValue) => {
        variablesDistrics.id = newValue.value;
        loadDistricts();
      },
      { deep: true }
    );

    watch(
      () => districtId.value,
      (newValue) => {
        variablesTownShips.id = newValue.value;
        loadTownships();
      },
      { deep: true }
    );

    watch(
      () => townshipId.value,
      (newValue) => {
        variablesVillages.id = newValue.value;
        loadVillages();
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      code: "",
      name: "",
      lastName: "",
      identityCard: "",
      address: "",
      houseNumber: "",
      latitude: "",
      longitude: "",
      contactName: "",
      phone: "",
      email: "",
      dv: "",
    });

    // Input model

    const customer = reactive({
      customerId: 0,
      routeId: 0,
      code: "",
      name: "",
      lastName: "",
      identityCard: "",
      provinceId: "",
      districtId: "",
      townshipId: "",
      villageId: "",
      address: "",
      houseNumber: "",
      latitude: "",
      longitude: "",
      customerTypeId: 0,
      contactName: "",
      phone: "",
      email: "",
      taxpayerTypeId: 0,
      dv: "",
      createBy: "",
      updateBy: "",
      updateDate: moment(),
      active: false,
    });

    const schema = yup.object({
      name: yup.string().required("Nombre requerido").max(100),
      lastName: yup.string().required("Apellido requerido").max(100),
      identityCard: yup
        .string()
        .required("Tarjeta de identificación requerida")
        .max(50),
      address: yup.string().required("Dirección requerida").max(200),
      houseNumber: yup.string().required("Número de casa requerido").max(10),
      latitude: yup.string().required("Latitud requerida").max(12),
      longitude: yup.string().required("Longitud requerida").max(12),
      contactName: yup
        .string()
        .required("Nombre de contacto requerido")
        .max(100),
      phone: yup.string().required("Teléfono requerido").max(75),
      email: yup.string().required("Correo requerido").email().max(250),
      dv: yup.string().required("Dv requerido").max(20),
    });

    // Vee validate useForm

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: formValues,
    });

    // Vee validate useField

    const {
      value: code,
      errorMessage: codeError,
      meta: codeMeta,
    } = useField("code");
    const {
      value: name,
      errorMessage: nameError,
      meta: nameMeta,
    } = useField("name");
    const {
      value: lastName,
      errorMessage: lastNameError,
      meta: lastNameMeta,
    } = useField("lastName");
    const {
      value: identityCard,
      errorMessage: identityCardError,
      meta: identityCardMeta,
    } = useField("identityCard");
    const {
      value: address,
      errorMessage: addressError,
      meta: addressMeta,
    } = useField("address");
    const {
      value: houseNumber,
      errorMessage: houseNumberError,
      meta: houseNumberMeta,
    } = useField("houseNumber");
    const {
      value: latitude,
      errorMessage: latitudeError,
      meta: latitudeMeta,
    } = useField("latitude");
    const {
      value: longitude,
      errorMessage: longitudeError,
      meta: longitudeMeta,
    } = useField("longitude");
    const {
      value: contactName,
      errorMessage: contactNameError,
      meta: contactNameMeta,
    } = useField("contactName");
    const {
      value: phone,
      errorMessage: phoneError,
      meta: phoneMeta,
    } = useField("phone");
    const {
      value: email,
      errorMessage: emailError,
      meta: emailMeta,
    } = useField("email");
    const { value: dv, errorMessage: dvError, meta: dvMeta } = useField("dv");

    // Apollo mutations

    const { mutate: updateCustomer } = useMutation(UPDATE_CUSTOMER, () => ({
      variables: { inputModel: customer },
    }));

    // Trigger function

    const onSubmit = handleSubmit(async (values, actions) => {
      customer.code = values.code;
      customer.name = values.name;
      customer.lastName = values.lastName;
      customer.identityCard = values.identityCard;
      customer.address = values.address;
      customer.houseNumber = values.houseNumber;
      customer.latitude = values.latitude;
      customer.longitude = values.longitude;
      customer.contactName = values.contactName;
      customer.phone = values.phone;
      customer.email = values.email;
      customer.dv = values.dv;
      customer.routeId = routeId.value.value;
      customer.customerTypeId = customerTypeId.value.value;
      customer.taxpayerTypeId = taxPayerTypeId.value.value;
      customer.provinceId = provinceId.value.value;
      customer.districtId = districtId.value.value;
      customer.townshipId = townshipId.value.value;
      customer.villageId = villageId.value.value;
      customer.updateBy = keycloak.tokenParsed.preferred_username;

      await updateCustomer()
        .then((response) => {
          if (response.data.updateCustomer.statusCode === "OK")
            toast.success("Cliente actualizado exitosamente", { timeout: 2000 });
          else
            toast.error(response.data.updateCustomer.message, {
              timeout: 2000,
            });

          emit("customer-updated");
        })
        .catch((error) =>
          toast.error("Ha ocurrido un error", { timeout: 2000 })
        );

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return {
      onSubmit,
      closeModal,
      activeModal,
      code,
      codeError,
      name,
      nameError,
      lastName,
      lastNameError,
      identityCard,
      identityCardError,
      address,
      addressError,
      houseNumber,
      houseNumberError,
      latitude,
      latitudeError,
      longitude,
      longitudeError,
      contactName,
      contactNameError,
      phone,
      phoneError,
      email,
      emailError,
      dv,
      dvError,
      routesFormatted,
      routeId,
      customerTypesFormatted,
      customerTypeId,
      taxPayerTypesFormatted,
      taxPayerTypeId,
      provincesFormatted,
      provinceId,
      districtsFormatted,
      districtId,
      townshipsFormatted,
      townshipId,
      villagesFormatted,
      villageId,
    };
  },
};
</script>
