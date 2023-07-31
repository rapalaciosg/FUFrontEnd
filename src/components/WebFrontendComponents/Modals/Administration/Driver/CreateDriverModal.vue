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
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";

import { CREATE_DRIVER } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
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
  },
  props: [],
  emits: ["vehicle-created"],
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

    let branchOfficesFormatted = ref([]);

    const branchOfficeId = ref({});

    const usersList = ref([]);

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    const initilize = () => {
      loadBranchOffices();
      getUserList();
    };

    onMounted(() => initilize());

    const getUserList = () => {
      userAdministrationService.getUsers(keycloak.token).then((response) => {
        usersList.value = formatUserSelect(response.data);
      });
    }

    watch(() => usersList.value, (newValue) => {
      user.value = newValue[0];
    }, {deep: true})

    const formatUserSelect = (data) => {
      const valueFormated = data.map((item) => ({
        value: item.id,
        label: item.username,
      }));
      return valueFormated;
    }

    const formatbranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(branchOffices);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

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

    const { mutate: createDriver } = useMutation(CREATE_DRIVER, () => ({
      variables: { inputModel: driver },
    }));

    const onSubmit = handleSubmit((values, actions) => {
      driver.name = values.name;
      driver.lastName = values.lastName;
      driver.code = values.code.toUpperCase();
      driver.boxCode = values.boxCode.toUpperCase();
      driver.branchOfficeId = branchOfficeId.value.value;
      driver.keycloakUser = user.value.label;
      driver.keycloakUserId = user.value.value;

      createDriver()
        .then((response) => {
          emit("driver-created");
          toast.success("Conductor creado exitosamente", {
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
      usersList
    };
  },
};
</script>
