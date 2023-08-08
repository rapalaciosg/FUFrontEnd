<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect
          :options="filters"
          placeholder="Seleccione una tipo de filtro"
          v-model="filterBy"
          :clearable="(filterBy) ? true : false"
        />
        <VueSelect
          :options="filtersOptions"
          :placeholder="'Seleccione una opción'"
          v-model="filterValue"
          :clearable="(filterValue) ? true : false"
          :disabled="(filterBy) ? false : true"
        />
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel 
            class="btn-info rounded pt-2 text-center" 
            :data="vehiclesList"
            :fields="headersVehiclesListExport"
            name="filename.xls"
          >
          Exportar
          </download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable
      title="Listado de vehículos"
      :headers="headersVehiclesTable"
      :data="vehiclesList"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
      :filter="filterSelect"
    >
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <CreateVehicleModal
            title="Crear vehículo"
            btnClass="btn-success"
            @vehicle-created="loadVehicles()"
          />
        </div>
      </template>
    </AdvancedTable>
    <VehicleDetailsModal
      title="Detalles del vehículo"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="vehicleDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditVehicleModal
      title="Editar vehículo"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="vehicleDetails"
      @close-modal="isModalOpen = false"
      @vehicle-updated="loadVehicles()"
    />
    <EnableDisableVehicleModal :title="(vehicleDetails.active) ? 'Deshabilitar' : 'Habilitar'" :activeModal="isModalEnableDisableOpen" :showButton="false" :action="(vehicleDetails.active) ? 'Deshabilitar' : 'Habilitar'" :vehicle="vehicleDetails" @close-modal="isModalEnableDisableOpen = false" @vehicle-updated="loadVehicles()" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { headersVehiclesTable } from "@/constant/administration/vehicle/constantVehicle.js";
import CreateVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/CreateVehicleModal.vue";
import EnableDisableVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/EnableDisableVehicleModal.vue";
import VehicleDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/VehicleDetailsModal.vue";
import EditVehicleModal from "@/components/WebFrontendComponents/Modals/Administration/Vehicle/EditVehicleModal.vue";
import Card from "@/components/DashCodeComponents/Card";

import { GET_ALL_VEHICLES, GET_VEHICLES_BY_BRANCH_OFFICE, GET_VEHICLES_BY_LICENSE_PLATE } from "@/services/administration/vehicle/vehicleGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
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
  mounted() {},
  methods: {},
  setup() {
    let vehicleDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    const variablesVehiclesByBranchOffice = reactive({ id: 0 });
    const variablesVehiclesByLicensePlate = reactive({ plate: "" });

    let headersVehiclesListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filterSelect = ref("");

    let filtersOptions = ref([]);

    let branchOfficesSelect = ref([]);
    let lincensePlateSelect = ref([]);

    let listVehiclesByBranchOffice = ref([]);
    let vehicleByLicense = ref([]);

    let vehiclesList = ref([]);

    const queryGetVehicles = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_VEHICLES)
    );

    const queryGetVehiclesByBranchOffice = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_VEHICLES_BY_BRANCH_OFFICE, variablesVehiclesByBranchOffice)
    );

    const queryGetVehiclesByLicensePlate = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_VEHICLES_BY_LICENSE_PLATE, variablesVehiclesByLicensePlate)
    );

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const vehicles = computed(
      () => queryGetVehicles.result.value?.srvVehicle ?? []
    );

    const vehiclesByBranchOffice = computed(
      () => queryGetVehiclesByBranchOffice.result.value?.srvVehicleByBranchOffice ?? []
    );

    const vehiclesByLicensePlate = computed(
      () => queryGetVehiclesByLicensePlate.result.value?.srvVehicleByPlate ?? []
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const loadVehicles = () => {
      queryGetVehicles.load() || queryGetVehicles.refetch();
    };

    const loadVehiclesByBranchOffice = () => {
      queryGetVehiclesByBranchOffice.load() || queryGetVehiclesByBranchOffice.refetch();
    };

    const loadVehiclesByLicensePlate = () => {
      queryGetVehiclesByLicensePlate.load() || queryGetVehiclesByLicensePlate.refetch();
    };

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    onMounted(() => {
      loadVehicles();
      loadBranchOffices();
      headersVehiclesListExport.value = formatHeadersRoutesListExport(headersVehiclesTable);
    });

    watch(() => vehicles.value, (newValue) => {
      lincensePlateSelect.value = formatLicensePlateSelect(vehicles);
      vehiclesList.value = newValue;
    }, { deep: true })

    watch(() => branchOffices.value, (newValue) => {
      branchOfficesSelect.value = formatbranchOfficeSelect(branchOffices);
    }, { deep: true })

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;
      if (newValue && newValue.value === 'branchOffice') filtersOptions.value = branchOfficesSelect.value;
      else filtersOptions.value = lincensePlateSelect.value;
    }, { deep: true })

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'branchOffice') {
        variablesVehiclesByBranchOffice.id = 0;
        variablesVehiclesByBranchOffice.id = newValue.value;
        loadVehiclesByBranchOffice();
        vehiclesList.value = vehiclesByBranchOffice.value;
      } else if (newValue && filterBy.value?.value === 'licensePlate') {
        variablesVehiclesByLicensePlate.plate = "";
        variablesVehiclesByLicensePlate.plate = newValue.value;
        loadVehiclesByLicensePlate();
      } else if (!newValue) {
        vehiclesList.value = vehicles.value;
      }
    }, { deep: true })

    watch(() => vehiclesByBranchOffice.value, (newValue) => {
      listVehiclesByBranchOffice.value = newValue;
      vehiclesList.value = listVehiclesByBranchOffice.value;
    }, { deep: true })

    watch(() => vehiclesByLicensePlate.value, (newValue) => {
      vehicleByLicense.value = [];
      vehicleByLicense.value.push(newValue);
      vehiclesList.value = vehicleByLicense.value;
    }, { deep: true })

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
      return valueFormatted;
    }

    const formatbranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    const formatLicensePlateSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.licensePlate,
        label: item.licensePlate,
      }));
      return valueFormated;
    };

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if(value.action === 'enable/disable') isModalEnableDisableOpen.value = true;

      vehicleDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      vehicleDetails,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      vehicles,
      filterSelect,
      loadVehicles,
      filterBy,
      filterValue,
      filtersOptions,
      vehiclesList,
      headersVehiclesListExport,
    };
  },
};
</script>
<style></style>
