<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput name="username" type="text" label="Nombre de usuario" placeholder="Nombre de usuario" v-model="username" :error="usernameError" />
          <Textinput name="email" type="email" label="Correo" placeholder="Correo" v-model="email" :error="emailError" />
          <Textinput name="firstName" type="text" label="Nombre" placeholder="Nombre" v-model="firstName" :error="firstNameError" />
          <Textinput name="lastName" type="text" label="Apellido" placeholder="Apellido" v-model="lastName" :error="lastNameError" />
          <Textinput name="password" type="password" label="Contraseña" placeholder="Contraseña" v-model="password" :error="passwordError" />
          <VueSelect name="groups" label="Roles" :options="rolesListFormatted" placeholder="Roles" v-model="groups" multiple />
          <div>
            <label class="ltr:inline-block rtl:block input-label">Conductor</label>
            <div class="pt-2">
              <Checkbox label="Conductor" v-model="isDriver" />
            </div>
          </div>
        </div>
        <div v-if="isDriver" class="grid grid-cols-2 gap-5 py-6 border-t border-slate-100 dark:border-slate-700">
          <Textinput type="text" label="Codigo" placeholder="Codigo" v-model="code" :error="codeError" :maxlength="10"/>
          <Textinput type="text" label="Código de caja" placeholder="Código de caja" v-model="boxCode" :error="boxCodeError" :maxlength="50"/>
          <VueSelect label="Sucursal" :options="branchOfficesFormatted" placeholder="Seleccione una sucursal" v-model="branchOfficeId" :clearable="false"/>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Asociar a un vehículo</label>
            <div class="pt-2">
              <Checkbox label="Asociar vehículo" v-model="isAssociationVehicleActive" />
            </div>
          </div>
          <VueSelect v-if="isAssociationVehicleActive" label="Vehículos" :options="vehiclesFormatted" placeholder="Seleccione un vehículo" v-model="vehicleId" :clearable="false"/>
        </div>
        <div v-else class="grid grid-cols-2 gap-5 py-6 border-t border-slate-100 dark:border-slate-700">
          <div class="grid grid-cols-8 gap-x-3">
            <div class="col-span-6">
              <VueSelect ref="select" label="Compañías" :options="companiesFormatted" placeholder="Seleccione las compañías" v-model="companyIds" multiple :disabled="allCompanies" />
            </div>
            <div class="pt-10">
              <Checkbox label="Todo" v-model="allCompanies" />
            </div>
          </div>
          <div class="grid grid-cols-8 gap-x-3">
            <div class="col-span-6">
              <VueSelect label="Sucursales" :options="branchOfficesByCompanyFormatted" placeholder="Seleccione las sucursales" v-model="branchOfficeIds" multiple :disabled="allBranchOffices"/>
            </div>
            <div class="pt-10">
              <Checkbox label="Todo" v-model="allBranchOffices" />
            </div>
          </div>
          <div class="grid grid-cols-8 gap-x-3">
            <div class="col-span-6">
              <VueSelect label="Rutas" :options="routesByCompanyFormatted" placeholder="Seleccione las rutas" v-model="routeIds" multiple :disabled="allRoutes" />
            </div>
            <div class="pt-10">
              <Checkbox label="Todo" v-model="allRoutes" />
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
import { ref, watch, reactive, onMounted, computed, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import userAdministrationService from "@/services/keycloak/userAdministrationService";
import roleAdministrationService from "@/services/keycloak/roleAdministrationService";

import keycloak from "@/security/KeycloakService.js";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_BRANCH_OFFICES, GET_BRANCH_OFFICES_BY_LIST_OF_COMPANIES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ROUTES_BY_LIST_OF_COMPANIES } from "@/services/routes/routes/routesGraphql.js";

import { CREATE_DRIVER } from "@/services/administration/driver/driverGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION, CREATE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";

import { CREATE_GRAPH_USER } from "@/services/keycloak/userGraphqlServices/userGraphql.js";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
    Checkbox
  },
  props: {},
  emits: ['user-created', 'close-modal'],
  data() {
    return {
      rolesList: [],
      rolesListFormatted: []
    };
  },
  watch: {
    rolesList(newValue) { this.rolesListFormatted = this.formatValuesSelect(newValue) },
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      roleAdministrationService.getRoles(keycloak.token).then((response) => {
        this.rolesList = response.data;
      });
    },
    formatValuesSelect(data) { return data.map(item => ({ value: item.id, label: item.name })) },
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const groups = ref([]);

    const isDriver = ref(false);

    // Not driver

    const allCompanies = ref(false);
    const allBranchOffices = ref(false);
    const allRoutes = ref(false);

    let allCompaniesSelected = ref([]);
    let allBranchOfficesSelected = ref([]);
    let allRoutesSelected = ref([]);

    const companyIds = ref(null);
    let companyIdsSelected = ref(null);
    let companiesFormatted = ref([]);

    const branchOfficeIds = ref(null);
    let branchOfficesByCompanyFormatted = ref([]);

    const routeIds = ref(null);
    let routesByCompanyFormatted = ref([]);

    // Driver

    const branchOfficeId = ref(null);
    let branchOfficesFormatted = ref([]);

    const vehicleId = ref({});
    let vehiclesFormatted = ref([]);

    const isAssociationVehicleActive = ref(false);

    const userCreated = ref({});

    // Apollo variables

    const variablesCompanyIds = reactive({ ids: [] });

    // Apollo queries initialization

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION));

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    const queryGetBranchOfficesByCompanyIds = provideApolloClient(apolloClient)(() => useLazyQuery(GET_BRANCH_OFFICES_BY_LIST_OF_COMPANIES, variablesCompanyIds));

    const queryGetRoutesByCompanyIds = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ROUTES_BY_LIST_OF_COMPANIES, variablesCompanyIds));

    // Apollo fetching data from queries

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    const vehiclesDriversAsociation = computed(() => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []);

    const vehiclesBranchOfficesByCompanyIds = computed(() => queryGetBranchOfficesByCompanyIds.result.value?.srvBranchOfficeByListCompany ?? []);
    
    const vehiclesRoutesByCompanyIds = computed(() => queryGetRoutesByCompanyIds.result.value?.srvRoutesByListCompanyId ?? []);

    // Apollo lazy functions

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    const loadVehiclesDriversAsociation = () => queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();

    const loadBranchOfficesByCompanyIds = () => queryGetBranchOfficesByCompanyIds.load() || queryGetBranchOfficesByCompanyIds.refetch();

    const loadRoutesByCompanyIds = () => queryGetRoutesByCompanyIds.load() || queryGetRoutesByCompanyIds.refetch();

    // Before mounted

    onBeforeMount(() => {
      loadVehiclesDriversAsociation();
    });

    // Mounted function

    onMounted(() => {
      loadVehicles();
      loadCompanies();
      loadBranchOffices();
      activeModal.value = true;
    });

    // Format functions

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName}));

    const formatCompanySelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    const formatRouteSelect = (data) => data.map((item) => ({ value: item.routeId, label: item.name }));

    // Watchers

    watch(
      () => allCompanies.value,
      (newValue) => {
        if (newValue === true) {
          allCompaniesSelected.value = companiesFormatted.value.map(item => item.value);
          companyIds.value = companiesFormatted.value;
        } else {
          companyIds.value = [];
        }
      },
      { deep: true }
    );

    watch(() => companyIds.value, (newValue) => {
      companyIdsSelected.value = [];
      companyIdsSelected.value = newValue.map(item => item.value);
      variablesCompanyIds.ids = companyIdsSelected.value;

      loadBranchOfficesByCompanyIds();
      loadRoutesByCompanyIds();
    }, { deep: true });

    watch(
      () => allBranchOffices.value,
      (newValue) => {
        if (newValue === true) {
          allBranchOfficesSelected.value = branchOfficesByCompanyFormatted.value.map(item => item.value);
          branchOfficeIds.value = branchOfficesByCompanyFormatted.value;
        } else {
          branchOfficeIds.value = [];
        }
      },
      { deep: true }
    );

    watch(
      () => vehiclesBranchOfficesByCompanyIds.value,
      (newValue) => {
        if (newValue) {
          branchOfficesByCompanyFormatted.value = formatbranchOfficeSelect(newValue);
        } else {
          branchOfficesByCompanyFormatted.value = [];
        }
      },
      { deep: true }
    );

    watch(
      () => allRoutes.value,
      (newValue) => {
        if (newValue === true) {
          allRoutesSelected.value = routesByCompanyFormatted.value.map(item => item.value);
          routeIds.value = routesByCompanyFormatted.value;
        } else {
          routeIds.value = [];
        }
      },
      { deep: true }
    );

    watch(
      () => vehiclesRoutesByCompanyIds.value,
      (newValue) => {
        if (newValue) {
          routesByCompanyFormatted.value = formatRouteSelect(newValue);
        } else {
          routesByCompanyFormatted.value = [];
        }
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

    watch(
      () => companies.value,
      (newValue) => {
        companiesFormatted.value = formatCompanySelect(newValue);
      },
      { deep: true }
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

    // Initial values

    const formValues = reactive({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
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

    const userIntern = reactive({
      userId: "",
      userName: "",
      companiesAll: false,
      companiesList: "",
      branchesOfficesAll: false,
      brancheOfficeList: "",
      routesAll: false,
      routeList: "",
    });

    // Yup validation rules

    const schema = yup.object({
      username: yup.string().required("Nombre de usuario requerido"),
      firstName: yup.string().required("Nombre requerido"),
      lastName: yup.string().required("Apellido requerido"),
      email: yup.string().required("Correo requerido").email(),
      password: yup.string().required("Contraseña requerida").min(3),
      // Driver creation yup validation
      // code: yup.string().required("Código requerido").max(10),
      // boxCode: yup.string().required("Código de caja requerido").max(50),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate userField

    const { value: username, errorMessage: usernameError } = useField("username");
    const { value: firstName, errorMessage: firstNameError, meta: firstNameMeta } = useField("firstName");
    const { value: lastName, errorMessage: lastNameError } = useField("lastName");
    const { value: email, errorMessage: emailError } = useField("email");
    const { value: password, errorMessage: passwordError } = useField("password");

    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: boxCode, errorMessage: boxCodeError, meta: boxCodeMeta } = useField("boxCode");

    // Apollo mutations

    const { mutate: createUserIntern } = useMutation(CREATE_GRAPH_USER, () => ({ variables: { inputModel: userIntern }}));

    const { mutate: createDriver } = useMutation(CREATE_DRIVER, () => ({ variables: { inputModel: driver } }));

    const { mutate: createVehicleDriver } = useMutation(CREATE_VEHICLE_DRIVER, () => ({ variables: { inputModel: vehicleDriver } }));

    // Functions to trigger

    const onSubmit = handleSubmit(async (values, actions) => {
      let userFormatted = {};
      let passwordFormatted = {};
      let groupsFormatted = {};

      userFormatted = {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        enabled: true,
        email: values.email,
        groups: [],
        emailVerified: true,
        credentials: []
      };

      passwordFormatted = {
        type: "password",
        value: values.password,
        temporary: false
      };

      groupsFormatted = groups.value.map(item => item.label);

      userFormatted.credentials.push(passwordFormatted);
      userFormatted.groups = groupsFormatted;

      await userAdministrationService.createUser(userFormatted, keycloak.token)
        .then(async (response) => {

          // Getting user created

          await userAdministrationService.getUserByUsername(keycloak.token, userFormatted.username)
            .then((response) => userCreated.value = response.data.find(item => item.username === userFormatted.username))
            .catch((error) => toast.error("Usuario creado no encontrado", { timeout: 2000 }))

          toast.success("Usuario creado exitosamente", { timeout: 2000 });

          if (isDriver.value !== true) {

            // Not driver

            // Intern user format

            if (allCompanies.value === true) {
              userIntern.companiesAll = true;
              userIntern.companiesList = "";
            } else {
              userIntern.companiesAll = false;
              userIntern.companiesList = companyIds.value.map(item => item.value ).join(',');
            }

            if (allBranchOffices.value === true) {
              userIntern.branchesOfficesAll = true;
              userIntern.brancheOfficeList = "";
            } else {
              userIntern.branchesOfficesAll = false;
              userIntern.brancheOfficeList = branchOfficeIds.value.map(item => item.value ).join(',');
            }

            if (allRoutes.value === true) {
              userIntern.routesAll = true;
              userIntern.routeList = "";
            } else {
              userIntern.routesAll = false;
              userIntern.routeList = routeIds.value.map(item => item.value ).join(',');
            }

            userIntern.userId = userCreated.value.id;
            userIntern.userName = userCreated.value.username;

            // Create user intern

            await createUserIntern()
              .then((response) => {
                if (response.data.createUser.statusCode === "OK") toast.success("Usuario interno creado exitosamente", { timeout: 2000 });
                else toast.error(response.data.createUser.message, { timeout: 2000 });
              })
              .catch((error) => toast.error("Ha ocurrido un error al crear un usuario interno", { timeout: 2000 }))

          } else {
            driver.name = values.firstName;
            driver.lastName = values.lastName;
            driver.code = values.code.toUpperCase();
            driver.boxCode = values.boxCode.toUpperCase();
            driver.branchOfficeId = branchOfficeId.value.value;
            driver.keycloakUser = userCreated.value.username;
            driver.keycloakUserId = userCreated.value.id;

            await createDriver()
              .then(async (response) => {
                if (response.data.createDrive.statusCode === "OK") toast.success("Conductor creado exitosamente", { timeout: 2000 });
                else toast.error(response.data.createDrive.message, { timeout: 2000 });

                if (isAssociationVehicleActive.value === true) {
                  vehicleDriver.vehicleId = vehicleId.value.value;
                  vehicleDriver.driverId = +response.data.createDrive.idObject;
                  vehicleDriver.userName = keycloak.tokenParsed.preferred_username;

                  console.log('vehicleDriver => ', vehicleDriver);

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
          }

          emit('user-created')
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
      username,
      usernameError,
      firstName,
      firstNameError,
      lastName,
      lastNameError,
      email,
      emailError,
      password,
      passwordError,
      groups,
      isDriver,
      companyIds,
      branchOfficeId,
      branchOfficeIds,
      branchOfficesByCompanyFormatted,
      routeIds,
      companiesFormatted,
      branchOfficesFormatted,
      routesByCompanyFormatted,
      isAssociationVehicleActive,
      vehicleId,
      vehiclesFormatted,
      allCompanies,
      allBranchOffices,
      allRoutes,
      code,
      codeError,
      boxCode,
      boxCodeError,
    };
  },
};
</script>
