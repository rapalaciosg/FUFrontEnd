<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect
            label="Ruta"
            :options="routesFormatted"
            placeholder="Seleccione una ruta"
            v-model="routeId"
            :clearable="false"
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
          />
          <Textinput
            type="text"
            label="Dirección"
            placeholder="Ingrese la dirección"
            v-model="address"
            :error="addressError"
          />
          <Textinput
            type="text"
            label="Número de casa"
            placeholder="Ingrese el número de casa"
            v-model="houseNumber"
            :error="houseNumberError"
          />
          <Textinput
            type="text"
            label="Nombre de contacto"
            placeholder="Ingrese el nombre de contacto"
            v-model="contactName"
            :error="contactNameError"
          />
          <Textinput
            type="text"
            label="latitud"
            placeholder="Ingrese la latitud"
            v-model="latitude"
            :error="latitudeError"
          />
          <Textinput
            type="text"
            label="Teléfono"
            placeholder="Ingrese el teléfono"
            v-model="phone"
            :error="phoneError"
          />
          <Textinput
            type="text"
            label="longitud"
            placeholder="Ingrese la longitud"
            v-model="longitude"
            :error="longitudeError"
          />
          <Textinput
            type="email"
            label="Correo"
            placeholder="Ingrese el correo"
            v-model="email"
            :error="emailError"
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
import { useField, useForm } from "vee-validate";

import * as yup from "yup";
import keycloak from "@/security/KeycloakService";
import moment from 'moment';

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

import { GET_ALL_CUSTOMERS, CREATE_CUSTOMER } from "@/services/clients/customers/customersGraphql.js";
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
  props: [],
  emits: ["customer-created"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const variablesDistrics = reactive({ id: ""});
    const variablesTownShips = reactive({ id: ""});
    const variablesVillages = reactive({ id: ""});

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

    const customers = computed(
      () => queryGetCustomers.result.value?.srvCustomer ?? []
    );

    const routes = computed(
      () => queryGetRoutes.result.value?.srvRoutes ?? []
    );

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

    const loadCustomers = () => {
      queryGetCustomers.load() || queryGetCustomers.refetch();
    };

    const loadRoutes = () => {
      queryGetRoutes.load() || queryGetRoutes.refetch();
    };

    const loadCustomerTypes = () => {
      queryGetCustomerTypes.load() || queryGetCustomerTypes.refetch();
    };

    const loadTaxPayerTypes = () => {
      queryGetTaxPayerTypes.load() || queryGetTaxPayerTypes.refetch();
    };

    const loadProvinces = () => {
      queryGetProvinces.load() || queryGetProvinces.refetch();
    };

    const loadDistricts = () => {
      queryGetDistricts.load() || queryGetDistricts.refetch();
    };

    const loadTownships = () => {
      queryGetTownships.load() || queryGetTownships.refetch();
    };

    const loadVillages = () => {
      queryGetVillages.load() || queryGetVillages.refetch();
    };

    const initilize = () => {
      loadCustomers();
      loadRoutes();
      loadCustomerTypes();
      loadTaxPayerTypes();
      loadProvinces();
    };

    onMounted(() => initilize());

    const formatRouteSelect = (data) => data.value.map((item) => ({ value: item.routeId, label: item.name, code: item.customerPrefix }));

    const formatCustomerTypeSelect = (data) => data.value.map((item) => ({ value: item.customerTypeId, label: item.name }));

    const formatTaxPayerTypeSelect = (data) => data.value.map((item) => ({ value: item.taxpayerTypeId, label: item.name }));

    const formatProvinceSelect = (data) => data.value.map((item) => ({ value: item.provinceId, label: item.name }));

    const formatDistrictSelect = (data) => data.value.map((item) => ({ value: item.districtId, label: item.name }));

    const formatTownshipSelect = (data) => data.value.map((item) => ({ value: item.townshipId, label: item.name }));

    const formatVillageSelect = (data) => data.value.map((item) => ({ value: item.villageId, label: item.name }));

    const getSCustomerCode = (data) => {
      const listSequentials = data.value.map(item => item.customerSequential);
      const max = Math.max(...listSequentials);
      return max + 1;
    }

    watch(
      () => customers.value,
      (newValue) => {
        console.log('customers => ', newValue);
      },
      { deep: true }
    );

    let customersPrefix = ref([]);

    watch(
      () => routeId.value,
      (newValue) => {
        console.log('customerPrefix => ', newValue.code);
        customersPrefix.value = customers.value.map(item => item.code)
        console.log('customersCodes => ', customersPrefix.value);
        customersPrefix.value = customers.value.filter(item => item.code.includes(newValue.code));
        console.log('customersPrefix.value => ', customersPrefix.value);
      },
      { deep: true }
    );

    watch(
      () => routes.value,
      (newValue) => {
        routesFormatted.value = formatRouteSelect(routes);
        routeId.value = routesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => customerTypes.value,
      (newValue) => {
        customerTypesFormatted.value = formatCustomerTypeSelect(customerTypes);
        customerTypeId.value = customerTypesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => taxPayerTypes.value,
      (newValue) => {
        taxPayerTypesFormatted.value = formatTaxPayerTypeSelect(taxPayerTypes);
        taxPayerTypeId.value = taxPayerTypesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => provinces.value,
      (newValue) => {
        provincesFormatted.value = formatProvinceSelect(provinces);
        provinceId.value = provincesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => districts.value,
      (newValue) => {
        districtsFormatted.value = formatDistrictSelect(districts);
        districtId.value = districtsFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => townships.value,
      (newValue) => {
        townshipsFormatted.value = formatTownshipSelect(townships);
        townshipId.value = townshipsFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => villages.value,
      (newValue) => {
        villagesFormatted.value = formatVillageSelect(villages);
        villageId.value = villagesFormatted.value[0];
      },
      { deep: true }
    );

    // Hierarchical function
    watch(() => provinceId.value, (newValue) => {
      variablesDistrics.id = newValue.value;
      loadDistricts()
    }, { deep: true })

    watch(() => districtId.value, (newValue) => {
      variablesTownShips.id = newValue.value;
      loadTownships()
    }, { deep: true })

    watch(() => townshipId.value, (newValue) => {
      variablesVillages.id = newValue.value;
      loadVillages()
    }, { deep: true })

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
      active: true,
      createdDate: moment()
    });

    const schema = yup.object({
      //code: yup.string().required("Código requerido"),
      name: yup.string().required("Nombre requerido"),
      lastName: yup.string().required("Apellido requerido"),
      identityCard: yup.string().required("Tarjeta de identificación requerida"),
      address: yup.string().required("Dirección requerida"),
      houseNumber: yup.string().required("Número de casa requerido"),
      latitude: yup.string().required("Latitud requerida"),
      longitude: yup.string().required("Longitud requerida"),
      contactName: yup.string().required("Nombre de contacto requerido"),
      phone: yup.string().required("Teléfono requerido"),
      email: yup.string().required("Correo requerido").email(),
      dv: yup.string().required("Dv requerido"),
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

    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: lastName, errorMessage: lastNameError, meta: lastNameMeta } = useField("lastName");
    const { value: identityCard, errorMessage: identityCardError, meta: identityCardMeta } = useField("identityCard");
    const { value: address, errorMessage: addressError, meta: addressMeta } = useField("address");
    const { value: houseNumber, errorMessage: houseNumberError, meta: houseNumberMeta } = useField("houseNumber");
    const { value: latitude, errorMessage: latitudeError, meta: latitudeMeta } = useField("latitude");
    const { value: longitude, errorMessage: longitudeError, meta: longitudeMeta } = useField("longitude");
    const { value: contactName, errorMessage: contactNameError, meta: contactNameMeta } = useField("contactName");
    const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField("phone");
    const { value: email, errorMessage: emailError, meta: emailMeta } = useField("email");
    const { value: dv, errorMessage: dvError, meta: dvMeta } = useField("dv");

    const { mutate: createCustomer } = useMutation(
      CREATE_CUSTOMER,
      () => ({
        variables: { inputModel: customer },
      })
    );

    const onSubmit = handleSubmit((values, actions) => {
      //customer.code = values.code;
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
      customer.createBy = keycloak.tokenParsed.preferred_username

      createCustomer()
        .then((response) => {
          emit("customer-created");
          toast.success("Cliente creado exitosamente", {
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
      onSubmit,
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
      villageId
    };
  },
};
</script>
