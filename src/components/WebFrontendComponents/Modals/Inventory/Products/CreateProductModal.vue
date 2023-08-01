<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput
            type="text"
            label="Código"
            placeholder="Código"
            v-model="code"
            :error="codeError"
          />
          <Textinput
            type="text"
            label="Tag"
            placeholder="Tag"
            v-model="tag"
            :error="tagError"
          />
          <Textinput
            type="number"
            label="Precio base"
            placeholder="Precio base"
            v-model="basePrice"
            :error="basePriceError"
          />
          <Textinput
            type="number"
            label="Stock"
            placeholder="Stock"
            v-model="stock"
            :error="stockError"
          />
          <VueSelect
            label="Compañia"
            :options="companiesFormatted"
            placeholder="Seleccione una compañia"
            v-model="companyId"
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

import { CREATE_PRODUCT } from "@/services/inventory/products/productsGraphql.js";
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
  },
  props: [],
  emits: ["product-created"],
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
      tag: "",
      basePrice: 0,
      stock: 0,
    });

    const product = reactive({
      productId: 0,
      companyId: 0,
      code: "",
      tag: "",
      basePrice: 0,
      stock: 0,
    });

    const schema = yup.object({
      code: yup.string().required("Código requerido").max(10),
      tag: yup.string().required("Tag requerido").max(50),
      basePrice: yup.number().required("Precio base requerido"),
      stock: yup.number().required("Stock requerido"),
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
      value: tag,
      errorMessage: tagError,
      meta: tagMeta,
    } = useField("tag");
    const {
      value: code,
      errorMessage: codeError,
      meta: codeMeta,
    } = useField("code");
    const {
      value: basePrice,
      errorMessage: basePriceError,
      meta: basePriceMeta,
    } = useField("basePrice");
    const {
      value: stock,
      errorMessage: stockError,
      meta: stockMeta,
    } = useField("stock");

    const { mutate: createProduct } = useMutation(CREATE_PRODUCT, () => ({
      variables: { inputModel: product },
    }));

    const onSubmit = handleSubmit((values, actions) => {
      product.tag = values.tag.toUpperCase();
      product.code = values.code.toUpperCase();
      product.basePrice = +values.basePrice;
      product.stock = +values.stock;
      product.companyId = companyId.value.value;

      createProduct()
        .then((response) => {
          emit("product-created");
          toast.success("Producto creado exitosamente", {
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
      tag,
      tagError,
      code,
      codeError,
      basePrice,
      basePriceError,
      stock,
      stockError,
      onSubmit,
      companiesFormatted,
      companyId,
    };
  },
};
</script>
