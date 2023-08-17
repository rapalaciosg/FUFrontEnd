<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect label="Cliente" :options="customersFormatted" placeholder="Seleccione un cliente" v-model="customerId" :clearable="false"/>
          <VueSelect label="Sucursal" :options="branchOfficesFormatted" placeholder="Seleccione una sucursal" v-model="branchOfficeId" :clearable="false"/>
          <VueSelect label="Producto" :options="productsFormatted" placeholder="Seleccione un producto" v-model="productId" :clearable="false"/>
          <Textinput type="number" label="Ajuste precio" placeholder="Ajuste precio" v-model="adjustment" :error="adjustmentError"/>
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
import { ref, watch, reactive, computed, onMounted, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { GET_ALL_SPECIAL_PRICES, CREATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { GET_ALL_PRODUCTS } from "@/services/inventory/products/productsGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_CUSTOMERS } from "@/services/clients/customers/customersGraphql.js";
import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  props: {},
  emits: ["special-price-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    let productsFormatted = ref([]);
    let branchOfficesFormatted = ref([]);
    let customersFormatted = ref([]);

    const productId = ref({});
    const customerId = ref({});
    const branchOfficeId = ref({});

    // Apollo queries initialization

    const queryGetSpecialPrices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_SPECIAL_PRICES));

    const queryGetProducts = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PRODUCTS));

    const queryGetCustomers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CUSTOMERS));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    // Apollo fetching data from queries

    const specialPrices = computed(() => queryGetSpecialPrices.result.value?.srvSpecialPrice ?? []);

    const products = computed(() => queryGetProducts.result.value?.srvProducts ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const customers = computed(() => queryGetCustomers.result.value?.srvCustomer ?? []);

    // Apollo lazy functions

    const loadSpecialPrices = () => queryGetSpecialPrices.load() || queryGetSpecialPrices.refetch();

    const loadProducts = () => {
      queryGetProducts.load() || queryGetProducts.refetch();
    };

    const loadBrancOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadCustomers = () => queryGetCustomers.load() || queryGetCustomers.refetch();

    // Before mounted function

    onBeforeMount(() => {
      loadSpecialPrices();
      loadCustomers();
    });

    // Initialization function

    const initilize = () => {
      loadBrancOffices();
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatBranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

    const formatProductsSelect = (data) => data.map((item) => ({ value: item.productId, label: item.name }));

    const formatCustomersSelect = (data) => data.map((item) => ({ value: item.customerId, label: `${item.name} ${item.lastName}` }));

    // Watchers

    watch(
      () => customers.value,
      (newValue) => {
        customersFormatted.value = formatCustomersSelect(newValue);
        customerId.value = customersFormatted.value[0];
      },
      { deep: true }
    );

    let customerSpecialPrices = ref(null);

    watch(
      () => customerId.value,
      (newValue) => {
        customerSpecialPrices.value = specialPrices.value.filter(item => item.customer.customerId === newValue.value);
        loadProducts();
      },
      { deep: true }
    );

    watch(
      () => products.value, 
      (newValue) => {
        // const differentValues = newValue.filter(object1 => {
        //   return !customerSpecialPrices.value.some(object2 => {
        //     return object1.productId === object2.product.productId;
        //   });
        // });
        // console.log('differentValues => ', differentValues);
        productsFormatted.value = formatProductsSelect(newValue);
        productId.value = productsFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatBranchOfficeSelect(newValue);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      adjustment: 0,
    });

    // Input model

    const specialPrice = reactive({
      specialPriceId: 0,
      productId: 0,
      branchOfficeId: 0,
      customerId: 0,
      adjustment: 0,
      active: true
    });

    // Yup validations rules

    const schema = yup.object({
      adjustment: yup.number().required("Ajuste precio requerido"),
    });

    // Vee validate useForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate useField

    const { value: adjustment, errorMessage: adjustmentError, meta: adjustmentMeta } = useField("adjustment");

    // Apollo mutations

    const { mutate: createSpecialPrice } = useMutation(CREATE_SPECIAL_PRICE, () => ({ variables: { inputModel: specialPrice } }));

    const onSubmit = handleSubmit(async (values, actions) => {
      specialPrice.adjustment = +values.adjustment;
      specialPrice.productId = productId.value.value;
      specialPrice.branchOfficeId = branchOfficeId.value.value;
      specialPrice.customerId = customerId.value.value;

      await createSpecialPrice()
        .then((response) => {
          if (response.data.createSpecialPrice.statusCode === "OK") toast.success("Precio especial creado exitosamente", { timeout: 2000 });
          else toast.error(response.data.createSpecialPrice.message, { timeout: 2000 });

          emit("special-price-created");
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
      adjustment,
      adjustmentError,
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
