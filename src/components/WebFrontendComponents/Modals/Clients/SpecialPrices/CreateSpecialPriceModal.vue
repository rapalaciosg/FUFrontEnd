<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect
            label="Cliente"
            :options="customersFormatted"
            placeholder="Seleccione un cliente"
            v-model="customerId"
            :clearable="false"
          />
          <VueSelect
            label="Sucursal"
            :options="branchOfficesFormatted"
            placeholder="Seleccione una sucursal"
            v-model="branchOfficeId"
            :clearable="false"
          />
          <VueSelect
            label="Producto"
            :options="productsFormatted"
            placeholder="Seleccione un producto"
            v-model="productId"
            :clearable="false"
          />
          <Textinput
            type="number"
            label="Ajuste precio"
            placeholder="Ajuste precio"
            v-model="adjustment"
            :error="adjustmentError"
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

import { CREATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { GET_ALL_PRODUCTS } from "@/services/inventory/products/productsGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_CUSTOMERS } from "@/services/clients/customers/customersGraphql.js";
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
  emits: ["special-price-created"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    let productsFormatted = ref([]);
    let branchOfficesFormatted = ref([]);
    let customersFormatted = ref([]);

    const productId = ref({});
    const customerId = ref({});
    const branchOfficeId = ref({});

    const queryGetProducts = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_PRODUCTS)
    );

    const queryGetCustomers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_CUSTOMERS)
    );

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const products = computed(
      () => queryGetProducts.result.value?.srvProducts ?? []
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const customers = computed(
      () => queryGetCustomers.result.value?.srvCustomer ?? []
    );

    const loadProducts = () => {
      queryGetProducts.load() || queryGetProducts.refetch();
    };

    const loadBrancOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    const loadCustomers = () => {
      queryGetCustomers.load() || queryGetCustomers.refetch();
    };

    const initilize = () => {
      loadProducts();
      loadBrancOffices();
      loadCustomers();
    };

    onMounted(() => initilize());

    const formatBranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    const formatProductsSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.productId,
        label: item.code,
      }));
      return valueFormated;
    };

    const formatCustomersSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.customerId,
        label: `${item.name} ${item.lastName}`,
      }));
      return valueFormated;
    };

    watch(
      () => products.value,
      (newValue) => {
        productsFormatted.value = formatProductsSelect(products);
        productId.value = productsFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => customers.value,
      (newValue) => {
        customersFormatted.value = formatCustomersSelect(customers);
        customerId.value = customersFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatBranchOfficeSelect(branchOffices);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    const formValues = reactive({
      adjustment: 0,
    });

    const specialPrice = reactive({
      specialPriceId: 0,
      productId: 0,
      branchOfficeId: 0,
      customerId: 0,
      adjustment: 0,
    });

    const schema = yup.object({
      adjustment: yup.number().required("Ajuste precio requerido"),
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
      value: adjustment,
      errorMessage: adjustmentError,
      meta: adjustmentMeta,
    } = useField("adjustment");

    const { mutate: createSpecialPrice } = useMutation(CREATE_SPECIAL_PRICE, () => ({
      variables: { inputModel: specialPrice },
    }));

    const onSubmit = handleSubmit((values, actions) => {
      specialPrice.adjustment = +values.adjustment;
      specialPrice.productId = productId.value.value;
      specialPrice.branchOfficeId = branchOfficeId.value.value;
      specialPrice.customerId = customerId.value.value;

      createSpecialPrice()
        .then((response) => {
          emit("special-price-created");
          toast.success("Precio especial creado exitosamente", {
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
      adjustment,
      adjustmentError,
      onSubmit,
      productsFormatted,
      productId,
      branchOfficesFormatted,
      branchOfficeId,
      customersFormatted,
      customerId,
    };
  },
};
</script>
