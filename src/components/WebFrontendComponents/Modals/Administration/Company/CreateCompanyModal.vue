<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre de la compañia" placeholder="Nombre de la compañia" v-model="name" :error="nameError" />
          <Textinput type="text" label="Prefijo" placeholder="Prefijo" v-model="prefix" :error="prefixError" />
          <Textinput type="text" label="Dirección" placeholder="Dirección" v-model="address" :error="addressError" />
          <VueSelect label="Provincias" :options="provincesFormatted" placeholder="Seleccione una provincia" v-model="provinceId" :clearable="false" />
          <VueSelect label="Tipos de compañias" :options="companyTypesFormatted" placeholder="Seleccione un tipo de compañia" v-model="companyTypeId" :clearable="false" />
          <Checkbox label="Distribuidor" :modelValue="isDistributor" />
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
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

import { CREATE_COMPANY } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_PROVINCES } from "@/services/catalogs/catalogsGraphql.js";
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
  props: [],
  emits: ["company-created"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const isDistributor = ref(false);

    let provincesFormatted = ref([]);
    let companyTypesFormatted = ref([]);

    const provinceId = ref({});
    const companyTypeId = ref({});

    const queryGetCompanyTypes = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANY_TYPES));
    const queryGetProvinces = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PROVINCES));

    const companyTypes = computed(() => queryGetCompanyTypes.result.value?.srvCompanyTypes ?? []);
    const provinces = computed(() => queryGetProvinces.result.value?.srvProvince ?? []);

    const initilize = () => {
        queryGetCompanyTypes.load();
        queryGetProvinces.load();
    }

    onMounted(() => initilize())

    const formatProvinceSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.provinceId, label: item.name }));
      return valueFormated;
    }

    const formatCompanyTypeSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.companyTypeId, label: item.name }));
      return valueFormated;
    }

    watch(() => provinces.value, (newValue) => {
      provincesFormatted.value = formatProvinceSelect(provinces);
      provinceId.value = provincesFormatted.value[0];
    }, { deep: true })

    watch(() => companyTypes.value, (newValue) => {
      companyTypesFormatted.value = formatCompanyTypeSelect(companyTypes);
      companyTypeId.value = companyTypesFormatted.value[0];
    }, { deep: true })

    const formValues = reactive({
      name: "",
      prefix: "",
      address: ""
    });

    const company = reactive({
      companyId: 0,
      name: "",
      prefix: "",
      address: "",
      provinceId: "",
      companyTypeId: "",
      sequential: 1
    })

    const schema = yup.object({
      name: yup.string().required("Nombre requerido"),
      prefix: yup.string().required("Prefijo requerido"),
      address: yup.string().required("Dirección requerido")
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

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: prefix, errorMessage: prefixError, meta: prefixMeta } = useField("prefix");
    const { value: address, errorMessage: addressError, meta: addressMeta } = useField("address");

    const { mutate: createCompany } = useMutation(CREATE_COMPANY, () => ({ variables: { inputModel: company } }));

    const onSubmit = handleSubmit((values, actions) => {

      company.name = values.name
      company.prefix = values.prefix.toUpperCase()
      company.address = values.address
      company.provinceId = provinceId.value.value
      company.companyTypeId = companyTypeId.value.value

      console.log('isDistributor => ', isDistributor.value);

      // createCompany().then((response) => {
      //       emit('company-created')
      //       toast.success("Compañia creada exitosamente", {
      //           timeout: 2000,
      //         });
      //     }).catch((error) => {
      //       toast.error("Ha ocurrido un error", {
      //           timeout: 2000,
      //         });
      //     })

      closeModal.value = !closeModal.value;
      actions.resetForm();
    });

    return {
      closeModal,
      name,
      nameError,
      prefix,
      prefixError,
      address,
      addressError,
      provinceId,
      companyTypeId,
      onSubmit,
      companyTypesFormatted,
      provincesFormatted,
      isDistributor
    };
  },
};
</script>
