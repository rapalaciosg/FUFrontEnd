<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="filters" placeholder="Seleccione una tipo de filtro" v-model="filterBy" :clearable="(filterBy) ? true : false"/>
        <VueSelect :options="filtersOptions" :placeholder="'Seleccione una opción'" v-model="filterValue" :clearable="(filterValue) ? true : false" :disabled="(filterBy) ? false : true"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="driversList" :fields="headersDriversListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de conductores" :headers="headersDriversTable" :data="driverListAssociated" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect"/>
          <Button class="h-[40px]" text="Crear conductor" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <CreateDriverModal v-if="isModalCreateOpen" title="Crear conductor" @driver-created="updateFunction()" @close-modal="isModalCreateOpen = false"/>
    <DriverDetailsModal v-if="isModalDetailsOpen" title="Detalles del conductor" :data="driverDetails" @close-modal="isModalDetailsOpen = false"/>
    <EditDriverModal v-if="isModalEditOpen" title="Editar conductor" :data="driverDetails" @close-modal="isModalEditOpen = false" @driver-updated="updateFunction()"/>
    <EnableDisableDriverModal v-if="isModalEnableDisableOpen" :title="driverDetails.active ? 'Deshabilitar' : 'Habilitar'" :action="driverDetails.active ? 'Deshabilitar' : 'Habilitar'" :driver="driverDetails" @close-modal="isModalEnableDisableOpen = false" @driver-updated="updateFunction()"/>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted, onBeforeMount } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";

import { headersDriversTable } from "@/constant/administration/driver/constantDriver.js";

import EnableDisableDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/EnableDisableDriverModal.vue";
import CreateDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/CreateDriverModal.vue";
import EditDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/EditDriverModal.vue";
import DriverDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/DriverDetailsModal.vue";

import { GET_ALL_DRIVERS, GET_DRIVERS_BY_BRANCH_OFFICE, GET_DRIVERS_BY_CODE } from "@/services/administration/driver/driverGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_VEHICLE_DRIVER_ASOCIATION } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    VueSelect,
    Card,
    Button,
    CreateDriverModal,
    DriverDetailsModal,
    EnableDisableDriverModal,
    EditDriverModal,
  },
  data() {
    return {
      headersDriversTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
      status: [
        { label: "Habilitado", value: "enabled" },
        { label: "Deshabilitado", value: "disabled" },
      ],
      filters: [
        { label: 'Sucursal', value: 'branchOffice' },
        { label: 'Código de conductor', value: 'code' },
      ]
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let driverDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let headersDriversListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filterSelect = ref("");
    let filtersOptions = ref([]);

    let branchOfficesSelect = ref([]);
    let codeSelect = ref([]);

    let listDriversByBranchOffice = ref([]);
    let listDriverByCode = ref([]);

    let driversList = ref([]);

    let driverListAssociated = ref([]);

    let hasVehicleAssociated = ref(false);
    let vehicleAssociation = ref(null);

    // Apollo variables

    const variablesDriversByBranchOffice = reactive({ id: 0 });
    const variablesDriversByCode = reactive({ code: "" });

    // Apollo queries initialization

    const queryGetDrivers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_DRIVERS));

    const queryGetDriversByBranchOffice = provideApolloClient(apolloClient)(() => useLazyQuery(GET_DRIVERS_BY_BRANCH_OFFICE, variablesDriversByBranchOffice));

    const queryGetDriversByCode = provideApolloClient(apolloClient)(() => useLazyQuery(GET_DRIVERS_BY_CODE, variablesDriversByCode));

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    const queryGetVehiclesDriverAsociation = provideApolloClient(apolloClient)(() => useLazyQuery(GET_VEHICLE_DRIVER_ASOCIATION));

    // Apollo fetching data

    const drivers = computed(() => queryGetDrivers.result.value?.srvDriver ?? []);

    const driversByBranchOffice = computed(() => queryGetDriversByBranchOffice.result.value?.srvDriverByOffice ?? []);

    const driversByCode = computed(() => queryGetDriversByCode.result.value?.srvDriverByCode ?? []);

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    const vehiclesDriversAsociation = computed(() => queryGetVehiclesDriverAsociation.result.value?.srvVehicleDriver ?? []);

    // Apollo lazy functions

    const loadDrivers = () => queryGetDrivers.load() || queryGetDrivers.refetch();

    const loadDriversByBranchOffice = () => queryGetDriversByBranchOffice.load() || queryGetDriversByBranchOffice.refetch();

    const loadDriversByCode = () => queryGetDriversByCode.load() || queryGetDriversByCode.refetch();

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    const loadVehiclesDriversAsociation = () => queryGetVehiclesDriverAsociation.load() || queryGetVehiclesDriverAsociation.refetch();

    // Before mounted function

    onBeforeMount(() => {
      loadDrivers();
      loadVehiclesDriversAsociation();
    });

    // Mounted function

    onMounted(() => {
      loadBranchOffices();
      headersDriversListExport.value = formatHeadersListExport(headersDriversTable);
    });

    // Watchers

    watch(() => drivers.value, (newValue) => {
      codeSelect.value = formatCodeSelect(newValue);
      driversList.value = newValue;
    }, { deep: true });

    watch(() => branchOffices.value, (newValue) => { branchOfficesSelect.value = formatbranchOfficeSelect(newValue) }, { deep: true });

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;

      if (newValue && newValue.value === 'branchOffice') filtersOptions.value = branchOfficesSelect.value;
      else filtersOptions.value = codeSelect.value;
    }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'branchOffice') {
        variablesDriversByBranchOffice.id = newValue.value;
        loadDriversByBranchOffice();
        driversList.value = driversByBranchOffice.value;
      } else if (newValue && filterBy.value?.value === 'code') {
        variablesDriversByCode.code = newValue.value;
        loadDriversByCode();
      } else if (!newValue) {
        driversList.value = drivers.value;
      };
    }, { deep: true });

    watch(() => driversByBranchOffice.value, (newValue) => {
      listDriversByBranchOffice.value = newValue;
      driversList.value = listDriversByBranchOffice.value;
    }, { deep: true });

    watch(() => driversByCode.value, (newValue) => {
      listDriverByCode.value = [];
      listDriverByCode.value.push(newValue);
      driversList.value = listDriverByCode.value;
    }, { deep: true });

    watch(() => driversList.value, (newValue) => {
      let array = [];
      for (let i = 0; i < newValue.length; i++) {
        if (vehiclesDriversAsociation.value.find(item => item.driver.driverId === newValue[i].driverId)) {
          array.push({...newValue[i], isAssociated: true });
        } else {
          array.push({...newValue[i], isAssociated: false });
        }
      }
      driverListAssociated.value = array;
    }, { deep: true });

    watch(() => vehiclesDriversAsociation.value, (newValue) => {
      let array = [];
      for (let i = 0; i < driversList.value.length; i++) {
        if (newValue.find(item => item.driver.driverId === driversList.value[i].driverId)) {
          array.push({...driversList.value[i], isAssociated: true });
        } else {
          array.push({...driversList.value[i], isAssociated: false });
        }
      }
      driverListAssociated.value = array;
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
      delete valueFormatted['Vehículo asociado'];

      return valueFormatted;
    }

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName }));

    const formatCodeSelect = (data) => data.map((item) => ({ value: item.code, label: item.code }));

    // Relooading functions

    const updateFunction = () => {
      loadDrivers();
      loadVehiclesDriversAsociation();
    }

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        driverDetails.value = value.row;

        driverDetails.value['branchOfficeSelect'] = { 
          value: value.row.branchOffice.branchOfficeId, 
          label: value.row.branchOffice.branchOfficeName 
        };

        driverDetails.value['userSelect'] = { 
          value: value.row.keycloakUserId, 
          label: value.row.keycloakUser
        };

        vehicleAssociation.value = vehiclesDriversAsociation.value.find(item => item.driver.driverId === value.row.driverId);

        if (vehicleAssociation.value) hasVehicleAssociated.value = true;
        else hasVehicleAssociated.value = false;

        driverDetails.value['vehicleAssociation'] = vehicleAssociation.value;
        driverDetails.value['hasVehicleAssociated'] = hasVehicleAssociated.value;

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
      driverDetails,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      isModalCreateOpen,
      filterSelect,
      filterBy,
      filterValue,
      filtersOptions,
      driversList,
      headersDriversListExport,
      driverListAssociated,
    };
  },
};
</script>
<style></style>
