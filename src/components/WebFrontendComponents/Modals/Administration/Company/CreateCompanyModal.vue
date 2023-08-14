<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre de la compañia" placeholder="Nombre de la compañia" v-model="name" :error="nameError" :maxlength="100" />
          <Textinput type="text" label="Prefijo" placeholder="Prefijo" v-model="prefix" :error="prefixError" :maxlength="5" />
          <Textinput type="text" label="Dirección" placeholder="Dirección" v-model="address" :error="addressError" :maxlength="200" />
          <VueSelect label="Provincias" :options="provincesFormatted" placeholder="Seleccione una provincia" v-model="provinceId" :clearable="false" />
          <VueSelect label="Tipos de compañias" :options="companyTypesFormatted" placeholder="Seleccione un tipo de compañia" v-model="companyTypeId" :clearable="false" />
          <div>
            <label class="ltr:inline-block rtl:block input-label">Distribuidor</label>
            <div class="pt-2">
              <Checkbox label="Distribuidor" v-model="isDistributor" />
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

import { CREATE_COMPANY } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_PROVINCES } from "@/services/catalogs/provinces/provincesGraphql.js";
import { GET_ALL_COMPANY_TYPES } from "@/services/catalogs/companyType/companyTypeGraphql.js";

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
  emits: ["company-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const isDistributor = ref(false);

    const provinceId = ref({});
    let provincesFormatted = ref([]);

    const companyTypeId = ref({});
    let companyTypesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetCompanyTypes = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANY_TYPES));

    const queryGetProvinces = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PROVINCES));

    // Apollo fetching data from queries

    const companyTypes = computed(() => queryGetCompanyTypes.result.value?.srvCompanyTypes ?? []);

    const provinces = computed(() => queryGetProvinces.result.value?.srvProvince ?? []);

    // Apollo lazy functions

    const loadCompanyTipes = () => queryGetCompanyTypes.load() || queryGetCompanyTypes.refetch();

    const loadProvinces = () => queryGetProvinces.load() || queryGetProvinces.refetch();

    // Initialization function

    const initilize = () => {
      loadCompanyTipes();
      loadProvinces();
      activeModal.value = true;
    }

    // Mounted function

    onMounted(() => initilize())

    // Format functions

    const formatProvinceSelect = (data) => data.map(item => ({ value: item.provinceId, label: item.name }));

    const formatCompanyTypeSelect = (data) => data.map(item => ({ value: item.companyTypeId, label: item.name }));

    // Watchers

    watch(() => provinces.value, (newValue) => {
      provincesFormatted.value = formatProvinceSelect(newValue);
      provinceId.value = provincesFormatted.value[0];
    }, { deep: true });

    watch(() => companyTypes.value, (newValue) => {
      companyTypesFormatted.value = formatCompanyTypeSelect(newValue);
      companyTypeId.value = companyTypesFormatted.value[0];
    }, { deep: true });

    // Initial values

    const formValues = reactive({
      name: "",
      prefix: "",
      address: ""
    });

    // Input model

    const company = reactive({
      companyId: 0,
      name: "",
      prefix: "",
      address: "",
      provinceId: "",
      companyTypeId: "",
      sequential: 1
    });

    // Yup validations rules

    const schema = yup.object({
      name: yup.string().required("Nombre requerido").max(100),
      prefix: yup.string().required("Prefijo requerido").max(5),
      address: yup.string().required("Dirección requerido").max(200),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // vee validate use field

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: prefix, errorMessage: prefixError, meta: prefixMeta } = useField("prefix");
    const { value: address, errorMessage: addressError, meta: addressMeta } = useField("address");

    // Apollo mutations

    const { mutate: createCompany } = useMutation(CREATE_COMPANY, () => ({ variables: { inputModel: company } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      company.name = values.name
      company.prefix = values.prefix.toUpperCase()
      company.address = values.address
      company.provinceId = provinceId.value.value
      company.companyTypeId = companyTypeId.value.value
      company.isDistributor = isDistributor.value

      await createCompany()
        .then((response) => {
          if (response.data.createCompany.statusCode === "OK") toast.success("Compañía creada exitosamente", { timeout: 2000 });
          else toast.error(response.data.createCompany.message, { timeout: 2000 });

          emit('company-created')
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
      onSubmit,
      activeModal,
      name,
      nameError,
      prefix,
      prefixError,
      address,
      addressError,
      isDistributor,
      provinceId,
      provincesFormatted,
      companyTypeId,
      companyTypesFormatted,
    };
  },
};
</script>
