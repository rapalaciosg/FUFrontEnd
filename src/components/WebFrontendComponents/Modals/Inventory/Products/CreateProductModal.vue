<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre" placeholder="Nombre" v-model="name" :error="nameError" :maxlength="150"/>
          <Textinput type="text" label="Código" placeholder="Código" v-model="code" :error="codeError" :maxlength="10"/>
          <Textinput type="text" label="Tag" placeholder="Tag" v-model="tag" :error="tagError" :maxlength="50"/>
          <Textinput type="number" label="Precio base" placeholder="Precio base" v-model="basePrice" :error="basePriceError"/>
          <VueSelect label="Categoría" :options="categoriesFormatted" placeholder="Seleccione una categoría" v-model="productCategoryId" :clearable="false"/>
          <VueSelect label="Compañia" :options="companiesFormatted" placeholder="Seleccione una compañia" v-model="companyId" :clearable="false"/>
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

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { CREATE_PRODUCT } from "@/services/inventory/products/productsGraphql.js";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import { GET_ALL_PRODUCT_CATEGORIES } from "@/services/inventory/productCategories/productCategoriesGraphql.js";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  props: {},
  emits: ["product-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const companyId = ref({});
    let companiesFormatted = ref([]);

    const productCategoryId = ref({});
    let categoriesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetProductCategories = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PRODUCT_CATEGORIES));

    // Apollo fetching data from queries

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const productCategories = computed(() => queryGetProductCategories.result.value?.srvProductCategories ?? []);

    // Apollo lazy functions

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    const loadProductCategories = () => queryGetProductCategories.load() || queryGetProductCategories.refetch();

    // Initialization function

    const initilize = () => {
      loadCompanies();
      loadProductCategories();
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatCompanySelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    const formatCategorySelect = (data) => data.map((item) => ({ value: item.productCategoryId, label: item.name }));

    // Watchers

    watch(
      () => companies.value,
      (newValue) => {
        companiesFormatted.value = formatCompanySelect(newValue);
        companyId.value = companiesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => productCategories.value,
      (newValue) => {
        categoriesFormatted.value = formatCategorySelect(newValue);
        productCategoryId.value = categoriesFormatted.value[0];
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      name: "",
      code: "",
      tag: "",
      basePrice: 0,
    });

    // Input model

    const product = reactive({
      productId: 0,
      companyId: 0,
      name: "",
      code: "",
      tag: "",
      basePrice: 0,
      productCategoryId: 0,
    });

    // Yup validations rules

    const schema = yup.object({
      name: yup.string().required("Nombre requerido").max(150),
      code: yup.string().required("Código requerido").max(10),
      tag: yup.string().required("Tag requerido").max(50),
      basePrice: yup.number().required("Precio base requerido"),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // vee validate use field

    const { value: tag, errorMessage: tagError, meta: tagMeta } = useField("tag");
    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");
    const { value: basePrice, errorMessage: basePriceError, meta: basePriceMeta } = useField("basePrice");

    // Apollo mutations

    const { mutate: createProduct } = useMutation(CREATE_PRODUCT, () => ({ variables: { inputModel: product } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      product.name = values.name;
      product.tag = values.tag.toUpperCase();
      product.code = values.code.toUpperCase();
      product.basePrice = +values.basePrice;
      product.productCategoryId = productCategoryId.value.value;
      product.companyId = companyId.value.value;

      await createProduct()
        .then((response) => {
          if (response.data.createProduct.statusCode === "OK") toast.success("Producto creado exitosamente", { timeout: 2000 });
          else toast.error(response.data.createProduct.message, { timeout: 2000 });
          
          emit("product-created");
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
      tag,
      tagError,
      name,
      nameError,
      code,
      codeError,
      basePrice,
      basePriceError,
      companiesFormatted,
      companyId,
      productCategoryId,
      categoriesFormatted,
    };
  },
};
</script>
