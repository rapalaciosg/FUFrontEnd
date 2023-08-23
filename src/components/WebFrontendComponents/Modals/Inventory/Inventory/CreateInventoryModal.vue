<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect label="Bodega" :options="warehouseFormatted" placeholder="Seleccione una bodega" v-model="warehouseId" :clearable="false"/>
          <VueSelect label="Producto" :options="productsFormatted" placeholder="Seleccione un producto" v-model="productId" :clearable="false"/>
          <Textinput type="number" label="Stock" placeholder="Stock" v-model="stock" :error="stockError"/>
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

import { CREATE_INVENTORY } from "@/services/inventory/inventory/inventoryGraphql.js";
import { GET_ALL_PRODUCTS } from "@/services/inventory/products/productsGraphql.js";
import { GET_ALL_WAREHOUSES } from "@/services/inventory/warehouses/warehousesGraphql.js";

import keycloak from "@/security/KeycloakService";

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
  props: {},
  emits: ["inventory-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    let productsFormatted = ref([]);
    let warehouseFormatted = ref([]);

    const productId = ref({});
    const warehouseId = ref({});

    // Apollo queries initialization

    const queryGetWarehouses = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_WAREHOUSES)
    );

    const queryGetProducts = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_PRODUCTS)
    );

    // Apollo fetching data from queries

    const warehouses = computed(
      () => queryGetWarehouses.result.value?.srvWarehouse ?? []
    );

    const products = computed(
      () => queryGetProducts.result.value?.srvProducts ?? []
    );

    // Apollo lazy functions

    const loadWarehouses = () =>
      queryGetWarehouses.load() || queryGetWarehouses.refetch();

    const loadProducts = () =>
      queryGetProducts.load() || queryGetProducts.refetch();

    // Before mounted function

    onBeforeMount(() => {
      loadWarehouses();
      loadProducts();
    });

    // Initialization function

    const initilize = () => {
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatWarehousesSelect = (data) =>
      data.map((item) => ({ value: item.warehouseId, label: item.name }));

    const formatProductsSelect = (data) =>
      data.map((item) => ({ value: item.productId, label: item.name }));

    // Watchers

    watch(
      () => warehouses.value,
      (newValue) => {
        warehouseFormatted.value = formatWarehousesSelect(newValue);
        warehouseId.value = warehouseFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => products.value,
      (newValue) => {
        productsFormatted.value = formatProductsSelect(newValue);
        productId.value = productsFormatted.value[0];
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      stock: 0,
    });

    // Input model

    const inventory = reactive({
      wharehouseId: 0,
      productId: 0,
      stock: 0,
    });

    let inventoryInputModel = ref([]);

    // Yup validations rules

    const schema = yup.object({
      stock: yup.number().required("Stock requerido"),
    });

    // Vee validate useForm

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: formValues,
    });

    // Vee validate useField

    const { value: stock, errorMessage: stockError, meta: stockMeta } = useField("stock");

    // Apollo mutations

    const { mutate: createInventory } = useMutation(CREATE_INVENTORY, () => ({ variables: { inputModel: inventoryInputModel.value }}));

    const onSubmit = handleSubmit(async (values, actions) => {
      inventoryInputModel.value = [];

      inventory.stock = +values.stock;
      inventory.productId = productId.value.value;
      inventory.wharehouseId = warehouseId.value.value;

      inventoryInputModel.value.push(inventory);

      await createInventory()
        .then((response) => {
          if (response.data.createOrUpdateInventory.statusCode === "OK") toast.success("Transferencia tramitada exitosamente", { timeout: 2000 });
          else toast.error(response.data.createOrUpdateInventory.message, { timeout: 2000 });

          emit("inventory-created");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }));

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return {
      closeModal,
      onSubmit,
      activeModal,
      stock,
      stockError,
      productsFormatted,
      productId,
      warehouseFormatted,
      warehouseId,
    };
  },
};
</script>
