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
          <VueSelect
            label="Compañia"
            :options="companiesFormatted"
            placeholder="Seleccione una compañia"
            v-model="companyId"
            :clearable="false"
          />
          <div>
            <label class="ltr:inline-block rtl:block input-label"
              >Creación de cliente</label
            >
            <div class="pt-2">
              <Checkbox
                label="Creación de cliente"
                v-model="activeCustomerCreation"
                :checked="defaultValue"
              />
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

import { UPDATE_ROUTE } from "@/services/routes/routes/routesGraphql";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
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
    Checkbox,
  },
  props: {
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

    let companiesFormatted = ref([]);

    const companyId = ref({});
    const activeCustomerCreation = ref(false);
    const defaultValue = ref(false);

    const queryGetCompanies = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_COMPANIES)
    );

    const companies = computed(
      () => queryGetCompanies.result.value?.srvCompanies ?? []
    );

    const loadCompanies = () => {
      queryGetCompanies.load() || queryGetCompanies.refetch();
    };

    const initilize = () => {
      loadCompanies();
    };

    onMounted(() => initilize());

    const formatCompanySelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.companyId,
        label: item.name,
      }));
      return valueFormated;
    };

    watch(
      () => companies.value,
      (newValue) => {
        companiesFormatted.value = formatCompanySelect(companies);
        companyId.value = companiesFormatted.value[0];
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
    });

    const schema = yup.object({
      code: yup.string().required("Código requerido").max(10),
      name: yup.string().required("Nombre requerido"),
      description: yup.string().required("Descripción requerida"),
      customerPrefix: yup.string().required("Prefijo de cliente requerido"),
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

    watch(
      () => props.data,
      (newValue) => {
        route.routeId = newValue.routeId;
        activeCustomerCreation.value = newValue.activeCustomerCreation;
        name.value = newValue.name;
        code.value = newValue.code;
        description.value = newValue.description;
        customerPrefix.value = newValue.customerPrefix;
        if (activeCustomerCreation.value) defaultValue.value = true
        else defaultValue.value = false
        companyId.value = findSelectValues(
          companiesFormatted,
          newValue.company.companyId
        );
      },
      { deep: true }
    );

    const findSelectValues = (data, id) => {
      const filteredValue = data.value.find((item) => item.value === id);
      return filteredValue;
    };

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

    const { mutate: updateRoute } = useMutation(UPDATE_ROUTE, () => ({
      variables: { inputModel: route },
    }));

    const onSubmit = handleSubmit((values, actions) => {
      route.name = values.name;
      route.code = values.code.toUpperCase();
      route.description = values.description;
      route.customerPrefix = values.customerPrefix;
      route.companyId = companyId.value.value;
      route.activeCustomerCreation = activeCustomerCreation.value;

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
      onSubmit,
      companiesFormatted,
      companyId,
      activeCustomerCreation,
      defaultValue
    };
  },
};
</script>
