<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="filters" placeholder="Seleccione una tipo de filtro" v-model="filterBy" :clearable="(filterBy) ? true : false"/>
        <VueSelect :options="filtersOptions" :placeholder="'Seleccione una opción'" v-model="filterValue" :clearable="(filterValue) ? true : false" :disabled="(filterBy) ? false : true"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="inventoryList" :fields="headersInventoryListExport" name="Inventario.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de inventario" :headers="headersInventoryTable" :data="inventoryList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect"/>
          <Button class="h-[40px]" text="Inventario" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <DetailsInventoryModal v-if="isModalDetailsOpen" title="Detalles de inventario" :data="inventoryDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateInventoryModal v-if="isModalCreateOpen" title="Inventario" @inventory-created="reload()" @close-modal="isModalCreateOpen = false"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { headersInventoryTable } from "@/constant/inventory/inventory/constantInventory.js";

import CreateInventoryModal from "@/components/WebFrontendComponents/Modals/Inventory/Inventory/CreateInventoryModal.vue";
import DetailsInventoryModal from "@/components/WebFrontendComponents/Modals/Inventory/Inventory/DetailsInventoryModal.vue";
import EditWarehouseModal from "@/components/WebFrontendComponents/Modals/Inventory/Warehouses/EditWarehouseModal.vue";
import EnableDisableWarehouseModal from "@/components/WebFrontendComponents/Modals/Inventory/Warehouses/EnableDisableWarehouseModal.vue";

import { GET_ALL_INVENTORY, GET_INVENTORY_BY_PRODUCT, GET_INVENTORY_BY_WAREHOUSE } from "@/services/inventory/inventory/inventoryGraphql.js";
import { GET_ALL_PRODUCTS } from "@/services/inventory/products/productsGraphql.js";
import { GET_ALL_WAREHOUSES } from "@/services/inventory/warehouses/warehousesGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateInventoryModal,
    DetailsInventoryModal,
    EnableDisableWarehouseModal,
    EditWarehouseModal,
  },
  data() {
    return {
      headersInventoryTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
      ],
      filters: [
        { label: 'Productos', value: 'product' },
        { label: 'Bodegas', value: 'warehouse' },
      ],
      status: [
        { label: "Habilitado", value: "enabled" },
        { label: "Deshabilitado", value: "disabled" },
      ],
    };
  },
  setup() {
    // Variables declaration

    let inventoryDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalDetailsOpen = ref(false);

    let productSelect = ref([]);
    let warehouseSelect = ref([]);

    let headersInventoryListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filterSelect = ref("");
    let filtersOptions = ref([]);

    let listInventoryByProduct = ref([]);
    let listInventoryByWarehouse = ref([]);

    let inventoryList = ref([]);

    // Apollo variables

    const variablesInventoryByProduct = reactive({ productId: 0 });
    const variablesInventoryByWarehouse = reactive({ wharehouseId: 0 });

    // Apollo queries initialization

    const queryGetInventory = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_INVENTORY));

    const queryGetInventoryByProduct = provideApolloClient(apolloClient)(() => useLazyQuery(GET_INVENTORY_BY_PRODUCT, variablesInventoryByProduct));

    const queryGetInventoryByWarehouse = provideApolloClient(apolloClient)(() => useLazyQuery(GET_INVENTORY_BY_WAREHOUSE, variablesInventoryByWarehouse));

    const queryGetWarehouses = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_WAREHOUSES));

    const queryGetProducts = provideApolloClient(apolloClient)(() =>useLazyQuery(GET_ALL_PRODUCTS));

    // Apollo fetching data

    const inventory = computed(() => queryGetInventory.result.value?.srvInventory ?? []);

    const inventoryByProduct = computed(() => queryGetInventoryByProduct.result.value?.srvInventoryByProductId ?? []);

    const inventoryByWarehouse = computed(() => queryGetInventoryByWarehouse.result.value?.srvInventoryByWharehouseId ?? []);

    const warehouses = computed(() => queryGetWarehouses.result.value?.srvWarehouse ?? []);

    const products = computed(() => queryGetProducts.result.value?.srvProducts ?? []);

    // Apollo lazy functions

    const loadInventory = () => queryGetInventory.load() || queryGetInventory.refetch();

    const loadInventoryByProduct = () => queryGetInventoryByProduct.load() || queryGetInventoryByProduct.refetch();

    const loadInventoryByWarehouse = () => queryGetInventoryByWarehouse.load() || queryGetInventoryByWarehouse.refetch();

    const loadWarehouses = () => queryGetWarehouses.load() || queryGetWarehouses.refetch();

    const loadProducts = () => queryGetProducts.load() || queryGetProducts.refetch();

    // Mounted function

    onMounted(() => {
      loadProducts();
      loadWarehouses();
      headersInventoryListExport.value = formatHeadersListExport(headersInventoryTable);
    });

    // Watchers

    watch(() => products.value, (newValue) => { productSelect.value = formatProductsSelect(newValue) }, { deep: true });

    watch(() => warehouses.value, (newValue) => { warehouseSelect.value = formatWarehousesSelect(newValue) }, { deep: true });

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;

      if (newValue && newValue.value === 'product') filtersOptions.value = productSelect.value;
      else filtersOptions.value = warehouseSelect.value;
    }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'product') {
        variablesInventoryByProduct.productId = newValue.value;
        loadInventoryByProduct();
        inventoryList.value = inventoryByProduct.value;
      } else if (newValue && filterBy.value?.value === 'warehouse') {
        variablesInventoryByWarehouse.wharehouseId = newValue.value;
        loadInventoryByWarehouse();
        inventoryList.value = inventoryByWarehouse.value;
      } else if (!newValue) {
        inventoryList.value = [];
      };
    }, { deep: true });

    watch(() => inventoryByProduct.value, (newValue) => {
      listInventoryByProduct.value = newValue;
      inventoryList.value = listInventoryByProduct.value;
    }, { deep: true });

    watch(() => inventoryByWarehouse.value, (newValue) => {
      listInventoryByWarehouse.value = newValue;
      inventoryList.value = listInventoryByWarehouse.value;
    }, { deep: true });

    // Format functions

    const formatHeadersListExport = (data) => {
      let array = new Map();
      for (let index = 0; index < data.length; index++) {
        array.set(data[index].label, data[index].field);
      }
      let valueFormatted = Array.from(array).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

      delete valueFormatted.Acciones;

      return valueFormatted;
    };

    const formatWarehousesSelect = (data) => data.map((item) => ({ value: item.warehouseId, label: item.name }));

    const formatProductsSelect = (data) => data.map((item) => ({ value: item.productId, label: item.name }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        inventoryDetails.value = value.row;

        if (value.action === "details") isModalDetailsOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Reload function

    const reload = () => {
      if (filterValue.value === 'product') {
        loadInventoryByProduct();
        inventoryList.value = inventoryByProduct.value;
      } else {
        loadInventoryByWarehouse();
        inventoryList.value = inventoryByWarehouse.value;
      }
    }

    // Returning values

    return {
      toggleModal,
      reload,
      inventoryDetails,
      isModalCreateOpen,
      isModalDetailsOpen,
      filterSelect,
      filterBy,
      filterValue,
      filtersOptions,
      inventoryList,
      headersInventoryListExport,
      productSelect,
      warehouseSelect,
    };
  },
};
</script>
<style></style>
