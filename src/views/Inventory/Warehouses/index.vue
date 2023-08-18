<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="vehicleSelect" :placeholder="'Filtrar por vehículo'" v-model="filterValue"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="warehousesList" :fields="headersWarehousesListExport" name="filename.xls">Exportar</download-excel
          >
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de bodegas" :headers="headersWarehousesTable" :data="warehousesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <Button class="h-[40px]" text="Crear bodega" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <DetailsWarehouseModal v-if="isModalDetailsOpen" title="Detalles de la bodega" :data="warehouseDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateWarehouseModal v-if="isModalCreateOpen" title="Crear bodega" @warehouse-created="loadWarehouses()" @close-modal="isModalCreateOpen = false"/>
    <EditWarehouseModal v-if="isModalEditOpen" title="Editar bodega" :data="warehouseDetails" @close-modal="isModalEditOpen = false" @warehouse-updated="loadWarehouses()"/>
    <!-- <DeleteCompanyModal v-if="isModalDeleteOpen" title="Eliminar bodega" :company="warehouseDetails" @close-modal="isModalDeleteOpen = false" @warehouse-deleted="loadWarehouses()"/> -->
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { headersWarehousesTable } from "@/constant/inventory/warehouses/constantWarehouses.js";

import CreateWarehouseModal from "@/components/WebFrontendComponents/Modals/Inventory/Warehouses/CreateWarehouseModal.vue";
import DetailsWarehouseModal from "@/components/WebFrontendComponents/Modals/Inventory/Warehouses/DetailsWarehouseModal.vue";
import EditWarehouseModal from "@/components/WebFrontendComponents/Modals/Inventory/Warehouses/EditWarehouseModal.vue";
import DeleteCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DeleteCompanyModal.vue";

import { GET_ALL_WAREHOUSES, GET_ALL_WAREHOUSES_BY_VEHICLE } from "@/services/inventory/warehouses/warehousesGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateWarehouseModal,
    DetailsWarehouseModal,
    DeleteCompanyModal,
    EditWarehouseModal,
  },
  data() {
    return {
      headersWarehousesTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
      status: [
        { label: 'Habilitado', value: 'enabled' },
        { label: 'Deshabilitado', value: 'disabled' },
      ],
    };
  },
  setup() {
    // Variables declaration

    let warehouseDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    let vehicleSelect = ref([]);

    let headersWarehousesListExport = ref({});

    let filterSelect = ref("");
    let filterValue = ref(null);

    let listWarehousesByVehicle = ref([]);

    let warehousesList = ref([]);

    // Apollo variables

    const variablesWarehouseByVehicle = reactive({ vehicleId: 0 });

    // Apollo queries initialization

    const queryGetWarehouses = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_WAREHOUSES));

    const queryGetWarehousesByVehicle = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_WAREHOUSES_BY_VEHICLE, variablesWarehouseByVehicle));

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    // Apollo fetching data

    const warehouses = computed(() => queryGetWarehouses.result.value?.srvWarehouse ?? []);

    const warehousesByVehicle = computed(() => queryGetWarehousesByVehicle.result.value?.srvWarehouseByVehicleId ?? []);

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    // Apollo lazy functions

    const loadWarehouses = () => queryGetWarehouses.load() || queryGetWarehouses.refetch();

    const loadWarehousesByVehicle = () => queryGetWarehousesByVehicle.load() || queryGetWarehousesByVehicle.refetch();

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    // Mounted function

    onMounted(() => {
      loadVehicles();
      loadWarehouses();
      headersWarehousesListExport.value = formatHeadersListExport(headersWarehousesTable);
    });

    // Watchers

    watch(() => vehicles.value,(newValue) => { vehicleSelect.value = formatVehicleSelect(newValue) }, { deep: true });

    watch(() => warehouses.value, (newValue) => { warehousesList.value = newValue }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
        if (!newValue) {
          warehousesList.value = warehouses.value;
        } else {
          variablesWarehouseByVehicle.vehicleId = newValue.value;
          loadWarehousesByVehicle();
        }
      }, { deep: true });

    watch(() => warehousesByVehicle.value, (newValue) => {
      listWarehousesByVehicle.value = [];
      listWarehousesByVehicle.value.push(newValue);
      warehousesList.value = listWarehousesByVehicle.value;
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

    const formatVehicleSelect = (data) => data.map((item) => ({ value: item.vehicleId, label: item.code }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        warehouseDetails.value = value.row;

        warehouseDetails.value["vehicleSelect"] = { value: value.row.vehicle.vehicleId, label: value.row.vehicle.name };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "delete") isModalDeleteOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      loadWarehouses,
      warehouseDetails,
      isModalEditOpen,
      isModalCreateOpen,
      isModalDetailsOpen,
      isModalDeleteOpen,
      filterSelect,
      filterValue,
      warehousesList,
      headersWarehousesListExport,
      vehicleSelect,
    };
  },
};
</script>
<style></style>
