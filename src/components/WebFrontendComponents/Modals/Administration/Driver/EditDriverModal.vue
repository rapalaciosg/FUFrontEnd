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
            label="Apellido"
            placeholder="Apellido"
            v-model="lastName"
            :error="lastNameError"
          />
          <Textinput
            type="text"
            label="Codigo"
            placeholder="Codigo"
            v-model="code"
            :error="codeError"
          />
          <Textinput
            type="text"
            label="Código de caja"
            placeholder="Código de caja"
            v-model="boxCode"
            :error="boxCodeError"
          />
          <VueSelect
            label="Sucursal"
            :options="branchOfficesFormatted"
            placeholder="Seleccione una sucursal"
            v-model="branchOfficeId"
            :clearable="false"
          />
          <VueSelect
            label="Usuarios"
            :options="usersList"
            placeholder="Seleccione un usuario"
            v-model="user"
            :clearable="false"
          />
          <div>
            <label class="ltr:inline-block rtl:block input-label">Asociar a un vehículo</label>
            <div class="pt-2">
              <Checkbox label="Asociar vehículo" v-model="isAssociationVehicleActive" :checked="(isAssociationVehicleActive) ? true : false" :disabled="hasVehicleAssociated ? true : false" />
            </div>
          </div>
          <div :class="hasVehicleAssociated ? 'grid grid-cols-8' : ''">
            <VueSelect
              :class="(hasVehicleAssociated) ? 'col-span-7' : ''"
              v-if="isAssociationVehicleActive"
              label="Vehículo"
              :options="vehiclesFormatted"
              placeholder="Seleccione un vehículo"
              v-model="vehicleId"
              :disabled="hasVehicleAssociated ? true : false"
              :clearable="(vehicleId && !hasVehicleAssociated) ? true : false"
            />
            <div v-if="hasVehicleAssociated && isAssociationVehicleActive" class="grid content-end py-3 px-4">
              <button type="button" class="block text-center" @click="deleteAsociation">
                <Icon icon="heroicons:trash" class="w-9" />
              </button>
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

import { UPDATE_DRIVER } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION, CREATE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Icon,
    Checkbox,
    Textinput,
    VueSelect,
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    asociationDeleted: Boolean
  },
  emits: ["driver-updated", "delete-asociation"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    const user = ref(null);

    let closeModal = ref(false);

    const isAssociationVehicleActive = ref(false);

    let hasVehicleAssociated = ref(false);

    let associationVehicle = ref(null);

    let branchOfficesFormatted = ref([]);
    let vehiclesFormatted = ref([]);

    const branchOfficeId = ref({});

    const vehicleId = ref(null);

    const usersList = ref([]);

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION)
    );

    const queryGetVehicles = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_VEHICLES)
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const vehicles = computed(
      () => queryGetVehicles.result.value?.srvVehicle ?? []
    );

    const vehiclesDriversAsociation = computed(
      () => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []
    );

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    const loadVehicles = () => {
      queryGetVehicles.load() || queryGetVehicles.refetch();
    };

    const loadVehiclesDriversAsociation = () => {
      queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();
    };

    onBeforeMount(() => loadVehiclesDriversAsociation());

    const initilize = () => {
      loadBranchOffices();
      getUserList();
    };

    onMounted(() => initilize());

    const getUserList = () => {
      userAdministrationService.getUsers(keycloak.token).then((response) => {
        usersList.value = formatUserSelect(response.data);
      });
    };

    watch(
      () => usersList.value,
      (newValue) => {
        user.value = newValue[0];
      },
      { deep: true }
    );

    const formatUserSelect = (data) => {
      const valueFormated = data.map((item) => ({
        value: item.id,
        label: item.username,
      }));
      return valueFormated;
    };

    const formatbranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    const formatVehicleSelect = (vehiclesAll, vehiclesNotAvailable) => {
      const differentValues = vehiclesAll.value.filter(object1 => {
        return !vehiclesNotAvailable.value.some(object2 => {
          return object1.vehicleId === object2.vehicle.vehicleId;
        });
      });
      const valueFormated = differentValues.map((item) => ({
        value: item.vehicleId,
        label: item.code,
      }));
      return valueFormated;
    };

    watch(
      () => vehicles.value,
      (newValue) => {
        vehiclesFormatted.value = formatVehicleSelect(vehicles, vehiclesDriversAsociation);
      },
      { deep: true }
    );

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(branchOffices);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => vehiclesDriversAsociation.value,
      (newValue) => {
        loadVehicles();
      },
      { deep: true }
    );

    watch(
      () => vehicleId.value,
      (newValue) => {
        // if (!newValue) {
        //   hasVehicleAssociated.value = true;
        // } else {
        //   hasVehicleAssociated.value = false;
        // }
      },
      { deep: true }
    );

    watch(() => props.asociationDeleted, (newValue) => {
      loadVehiclesDriversAsociation();
      closeModal.value = !closeModal.value;
    }, { deep: true })

    watch(
      () => props.data,
      (newValue) => {
        driver.driverId = newValue.driverId;
        driver.active = newValue.active;
        name.value = newValue.name;
        code.value = newValue.code;
        boxCode.value = newValue.boxCode;
        lastName.value = newValue.lastName;
        // driver.keycloakUser = newValue.keycloakUser;
        // driver.keycloakUserId = newValue.keycloakUserId;
        branchOfficeId.value = findSelectValues(
          branchOfficesFormatted,
          newValue.branchOffice.branchOfficeId
        );
        user.value = findSelectValues(
          usersList,
          newValue.keycloakUserId
        );
        associationVehicle.value = vehiclesDriversAsociation.value.find(item => item.driver.driverId === newValue.driverId);
        if (associationVehicle.value) {
          isAssociationVehicleActive.value = true;
          vehicleId.value = findDefaultVehicleSelect(vehicles, associationVehicle.value.vehicle.vehicleId);
          hasVehicleAssociated.value = true;
        } else {
          vehicleId.value = null;
        }
      },
      { deep: true }
    );

    const findSelectValues = (data, id) => {
      const filteredValue = data.value.find((item) => item.value === id);
      return filteredValue;
    };

    const findDefaultVehicleSelect = (data, id) => {
      const filteredValue = data.value.find((item) => item.vehicleId === id);
      const valueFormated = {
        value: filteredValue.vehicleId,
        label: filteredValue.code,
      };
      return valueFormated;
    };

    const formValues = reactive({
      name: "",
      lastName: "",
      code: "",
      boxCode: "",
    });

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

    const schema = yup.object({
      name: yup.string().required("Nombre requerido"),
      lastName: yup.string().required("Apellido requerido"),
      code: yup.string().required("Código requerido"),
      boxCode: yup.string().required("Código de caja requerido"),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: formValues,
    });

    watch(
      () => closeModal.value,
      (newValue) => {
        resetForm();
        isAssociationVehicleActive.value = false;
        hasVehicleAssociated.value = false;
      },
      { deep: true }
    );

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
      value: code,
      errorMessage: codeError,
      meta: codeMeta,
    } = useField("code");
    const {
      value: boxCode,
      errorMessage: boxCodeError,
      meta: boxCodeMeta,
    } = useField("boxCode");

    const { mutate: updateDriver } = useMutation(UPDATE_DRIVER, () => ({
      variables: { inputModel: driver },
    }));

    const { mutate: createVehicleDriver } = useMutation(CREATE_VEHICLE_DRIVER, () => ({
      variables: { inputModel: vehicleDriver },
    }));

    const deleteAsociation = () => {
      const payload = {
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
      emit("delete-asociation", payload);
    }

    const onSubmit = handleSubmit((values, actions) => {
      driver.name = values.name;
      driver.lastName = values.lastName;
      driver.code = values.code.toUpperCase();
      driver.boxCode = values.boxCode.toUpperCase();
      driver.branchOfficeId = branchOfficeId.value.value;
      driver.keycloakUser = user.value.label;
      driver.keycloakUserId = user.value.value;

      updateDriver()
        .then((response) => {
          toast.success("Conductor actualizado exitosamente", {
            timeout: 2000,
          });
          if (isAssociationVehicleActive.value) {
            vehicleDriver.vehicleId = vehicleId.value.value;
            vehicleDriver.driverId = driver.driverId;
            vehicleDriver.userName = keycloak.tokenParsed.preferred_username;
            createVehicleDriver()
              .then((response) => {
                if (response.data.createVehicleDriver.statusCode === "OK") {
                  toast.success("Asociación exitosa", {
                    timeout: 2000,
                  });
                } else {
                  toast.error(response.data.createVehicleDriver.message, {
                    timeout: 2000,
                  });
                }
                loadVehiclesDriversAsociation();
                isAssociationVehicleActive.value = false;
              })
              .catch((error) => {
                toast.error("Ha ocurrido un error", {
                  timeout: 2000,
                });
              })
          }
          emit("driver-updated");
          closeModal.value = !closeModal.value;
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
          closeModal.value = !closeModal.value;
        });

      actions.resetForm();
    });

    return {
      closeModal,
      name,
      nameError,
      code,
      codeError,
      lastName,
      lastNameError,
      boxCode,
      boxCodeError,
      onSubmit,
      branchOfficesFormatted,
      branchOfficeId,
      user,
      usersList,
      vehiclesFormatted,
      vehicleId,
      isAssociationVehicleActive,
      hasVehicleAssociated,
      deleteAsociation,
    };
  },
};
</script>
