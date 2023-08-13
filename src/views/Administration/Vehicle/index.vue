<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="filters" placeholder="Seleccione una tipo de filtro" v-model="filterBy" :clearable="(filterBy) ? true : false"/>
        <VueSelect :options="filtersOptions" :placeholder="'Seleccione una opción'" v-model="filterValue" :clearable="(filterValue) ? true : false" :disabled="(filterBy) ? false : true"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="vehiclesList" :fields="headersVehiclesListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de vehículos" :headers="headersVehiclesTable" :data="vehiclesListAssociated" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <Button class="h-[40px]" text="Crear vehículo" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <CreateVehicleModal v-if="isModalCreateOpen"  title="Crear vehículo" @vehicle-created="updateFunction()" @close-modal="isModalCreateOpen = false"/>
    <VehicleDetailsModal v-if="isModalDetailsOpen" title="Detalles del vehículo" :data="vehicleDetails" @close-modal="isModalDetailsOpen = false"/>
    <EditVehicleModal v-if="isModalEditOpen" title="Editar vehículo" :data="vehicleDetails" @close-modal="isModalEditOpen = false" @vehicle-updated="updateFunction()"/>
    <EnableDisableVehicleModal v-if="isModalEnableDisableOpen" :title="(vehicleDetails.active) ? 'Deshabilitar' : 'Habilitar'" :action="(vehicleDetails.active) ? 'Deshabilitar' : 'Habilitar'" :vehicle="vehicleDetails" @close-modal="isModalEnableDisableOpen = false" @vehicle-updated="updateFunction()" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted, onBeforeMount } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import Card from "@/components/DashCodeComponents/Card";

import { headersVehiclesTable } from "@/constant/administration/vehicle/constantVehicle.js";

import CreateVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/CreateVehicleModal.vue";
import EnableDisableVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/EnableDisableVehicleModal.vue";
import VehicleDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/VehicleDetailsModal.vue";
import EditVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/EditVehicleModal.vue";

import { GET_ALL_VEHICLES, GET_VEHICLES_BY_BRANCH_OFFICE, GET_VEHICLES_BY_LICENSE_PLATE } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    Button,
    VueSelect,
    CreateVehicleModal,
    VehicleDetailsModal,
    EnableDisableVehicleModal,
    EditVehicleModal,
  },
  data() {
    return {
      headersVehiclesTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
      status: [
        { label: 'Habilitado', value: 'enabled' },
        { label: 'Deshabilitado', value: 'disabled' },
      ],
      filters: [
        { label: 'Sucursal', value: 'branchOffice' },
        { label: 'Placa del vehículo', value: 'licensePlate' },
      ]
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let vehicleDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let headersVehiclesListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filterSelect = ref("");
    let filtersOptions = ref([]);

    let branchOfficesSelect = ref([]);
    let lincensePlateSelect = ref([]);

    let listVehiclesByBranchOffice = ref([]);
    let listVehicleByLicense = ref([]);

    let vehiclesList = ref([]);

    let vehiclesListAssociated = ref([]);

    let hasDriverAssociated = ref(false);
    let driverAssociation = ref(null);

    // Apollo variables

    const variablesVehiclesByBranchOffice = reactive({ id: 0 });
    const variablesVehiclesByLicensePlate = reactive({ plate: "" });

    // Apollo queries initialization

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    const queryGetVehiclesByBranchOffice = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLES_BY_BRANCH_OFFICE, variablesVehiclesByBranchOffice));

    const queryGetVehiclesByLicensePlate = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLES_BY_LICENSE_PLATE, variablesVehiclesByLicensePlate));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION));

    // Apollo fetching data

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    const vehiclesByBranchOffice = computed(() => queryGetVehiclesByBranchOffice.result.value?.srvVehicleByBranchOffice ?? []);

    const vehiclesByLicensePlate = computed(() => queryGetVehiclesByLicensePlate.result.value?.srvVehicleByPlate ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const vehiclesDriversAsociation = computed(() => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []);

    // Apollo lazy functions

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    const loadVehiclesByBranchOffice = () => queryGetVehiclesByBranchOffice.load() || queryGetVehiclesByBranchOffice.refetch();

    const loadVehiclesByLicensePlate = () => queryGetVehiclesByLicensePlate.load() || queryGetVehiclesByLicensePlate.refetch();

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadVehiclesDriversAsociation = () => queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();

    // Before mounted function

    onBeforeMount(() => {
      loadVehicles();
      loadVehiclesDriversAsociation();
    });

    // Mounted function

    onMounted(() => {
      loadBranchOffices();
      headersVehiclesListExport.value = formatHeadersRoutesListExport(headersVehiclesTable);
    });

    // Watchers

    watch(() => vehicles.value, (newValue) => {
      lincensePlateSelect.value = formatLicensePlateSelect(newValue);
      vehiclesList.value = newValue;
    }, { deep: true });

    watch(() => branchOffices.value, (newValue) => { branchOfficesSelect.value = formatbranchOfficeSelect(newValue) }, { deep: true });

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;

      if (newValue && newValue.value === 'branchOffice') filtersOptions.value = branchOfficesSelect.value;
      else filtersOptions.value = lincensePlateSelect.value;
    }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'branchOffice') {
        variablesVehiclesByBranchOffice.id = newValue.value;
        loadVehiclesByBranchOffice();
        vehiclesList.value = vehiclesByBranchOffice.value;
      } else if (newValue && filterBy.value?.value === 'licensePlate') {
        variablesVehiclesByLicensePlate.plate = newValue.value;
        loadVehiclesByLicensePlate();
      } else if (!newValue) {
        vehiclesList.value = vehicles.value;
      }
    }, { deep: true });

    watch(() => vehiclesByBranchOffice.value, (newValue) => {
      listVehiclesByBranchOffice.value = newValue;
      vehiclesList.value = listVehiclesByBranchOffice.value;
    }, { deep: true });

    watch(() => vehiclesByLicensePlate.value, (newValue) => {
      listVehicleByLicense.value = [];
      listVehicleByLicense.value.push(newValue);
      vehiclesList.value = listVehicleByLicense.value;
    }, { deep: true });

    watch(() => vehiclesList.value, (newValue) => {
      let array = [];
      for (let i = 0; i < newValue.length; i++) {
        if (vehiclesDriversAsociation.value.find(item => item.vehicle.vehicleId === newValue[i].vehicleId)) {
          array.push({...newValue[i], isAssociated: true });
        } else {
          array.push({...newValue[i], isAssociated: false });
        }
      }
      vehiclesListAssociated.value = array;
    }, { deep: true });

    watch(() => vehiclesDriversAsociation.value, (newValue) => {
      let array = [];
      for (let i = 0; i < vehiclesList.value.length; i++) {
        if (newValue.find(item => item.vehicle.vehicleId === vehiclesList.value[i].vehicleId)) {
          array.push({...vehiclesList.value[i], isAssociated: true });
        } else {
          array.push({...vehiclesList.value[i], isAssociated: false });
        }
      }
      vehiclesListAssociated.value = array;
    }, { deep: true });

    // Format functions

    const formatHeadersRoutesListExport = (data) => {
      let array = new Map();
      for (let index = 0; index < data.length; index++) {
        array.set(data[index].label, data[index].field)
      }
      let valueFormatted = Array.from(array).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

      delete valueFormatted.Acciones;
      delete valueFormatted['Conductor asociado'];

      return valueFormatted;
    }

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

    const formatLicensePlateSelect = (data) => data.map((item) => ({ value: item.licensePlate, label: item.licensePlate }));

    // Relooading functions

    const updateFunction = () => {
      loadVehicles();
      loadVehiclesDriversAsociation();
    }

    const toggleModal = (value) => {
      if (value) {
        vehicleDetails.value = value.row;

        vehicleDetails.value['branchOfficeSelect'] = { 
          value: value.row.branchOffice.branchOfficeId, 
          label: value.row.branchOffice.branchOfficeName 
        };

        driverAssociation.value = vehiclesDriversAsociation.value.find(item => item.vehicle.vehicleId === value.row.vehicleId);

        if (driverAssociation.value) hasDriverAssociated.value = true;
        else hasDriverAssociated.value = false;

        vehicleDetails.value['driverAssociation'] = driverAssociation.value;
        vehicleDetails.value['hasDriverAssociated'] = hasDriverAssociated.value;

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "enable/disable") isModalEnableDisableOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      updateFunction,
      vehicleDetails,
      isModalCreateOpen,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      vehicles,
      filterSelect,
      filterBy,
      filterValue,
      filtersOptions,
      vehiclesList,
      headersVehiclesListExport,
      vehiclesListAssociated
    };
  },
};
</script>
<style></style>
