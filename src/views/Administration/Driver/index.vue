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
            :data="driversList"
            :fields="headersDriversListExport"
            name="filename.xls"
          >
          Exportar
          </download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable
      title="Listado de conductores"
      :headers="headersDriversTable"
      :data="driversList"
      :actions="actions"
      :showSelectOptions="false"
      @open-modal="toggleModal"
      :filter="filterSelect"
    >
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect
            :options="status"
            placeholder="Todos"
            v-model="filterSelect"
          />
          <CreateDriverModal
            title="Crear conductor"
            btnClass="btn-success"
            @driver-created="loadDrivers()"
          />
        </div>
      </template>
    </AdvancedTable>
    <DriverDetailsModal
      title="Detalles del conductor"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="driverDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditDriverModal
      title="Editar conductor"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="driverDetails"
      @close-modal="isModalOpen = false"
      @driver-updated="loadDrivers()"
    />
    <EnableDisableDriverModal
      :title="driverDetails.active ? 'Deshabilitar' : 'Habilitar'"
      :activeModal="isModalEnableDisableOpen"
      :showButton="false"
      :action="driverDetails.active ? 'Deshabilitar' : 'Habilitar'"
      :driver="driverDetails"
      @close-modal="isModalEnableDisableOpen = false"
      @driver-updated="loadDrivers()"
    />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { headersDriversTable } from "@/constant/administration/driver/constantDriver.js";
import EnableDisableDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/EnableDisableDriverModal.vue";
import CreateDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/CreateDriverModal.vue";
import EditDriverModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/EditDriverModal.vue";
import DriverDetailsModal from "@/components/WebFrontendComponents/Modals/Administration/Driver/DriverDetailsModal.vue";
import Card from "@/components/DashCodeComponents/Card";

import { GET_ALL_DRIVERS, GET_DRIVERS_BY_BRANCH_OFFICE, GET_DRIVERS_BY_CODE } from "@/services/administration/driver/driverGraphql.js";
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
    VueSelect,
    Card,
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
  mounted() {},
  methods: {},
  setup() {
    let driverDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    const variablesDriversByBranchOffice = reactive({ id: 0 });
    const variablesDriversByCode = reactive({ code: "" });

    let headersDriversListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filterSelect = ref("");

    let filtersOptions = ref([]);

    let branchOfficesSelect = ref([]);
    let codeSelect = ref([]);

    let listDriversByBranchOffice = ref([]);
    let driverByCode = ref([]);

    let driversList = ref([]);

    const queryGetDrivers = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_DRIVERS)
    );

    const queryGetDriversByBranchOffice = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_DRIVERS_BY_BRANCH_OFFICE, variablesDriversByBranchOffice)
    );

    const queryGetDriversByCode = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_DRIVERS_BY_CODE, variablesDriversByCode)
    );

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const drivers = computed(
      () => queryGetDrivers.result.value?.srvDriver ?? []
    );

    const driversByBranchOffice = computed(
      () => queryGetDriversByBranchOffice.result.value?.srvDriverByOffice ?? []
    );

    const driversByCode = computed(
      () => queryGetDriversByCode.result.value?.srvDriverByCode ?? []
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const loadDrivers = () => {
      queryGetDrivers.load() || queryGetDrivers.refetch();
    };

    const loadDriversByBranchOffice = () => {
      queryGetDriversByBranchOffice.load() || queryGetDriversByBranchOffice.refetch();
    };

    const loadDriversByCode = () => {
      queryGetDriversByCode.load() || queryGetDriversByCode.refetch();
    };

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    onMounted(() => {
      loadDrivers();
      loadBranchOffices();
      headersDriversListExport.value = formatHeadersRoutesListExport(headersDriversTable);
    });

    watch(() => drivers.value, (newValue) => {
      codeSelect.value = formatCodeSelect(drivers);
      driversList.value = newValue;
    }, { deep: true })

    watch(() => branchOffices.value, (newValue) => {
      branchOfficesSelect.value = formatbranchOfficeSelect(branchOffices);
    }, { deep: true })

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;
      if (newValue && newValue.value === 'branchOffice') filtersOptions.value = branchOfficesSelect.value;
      else filtersOptions.value = codeSelect.value;
    }, { deep: true })

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'branchOffice') {
        variablesDriversByBranchOffice.id = 0;
        variablesDriversByBranchOffice.id = newValue.value;
        loadDriversByBranchOffice();
        driversList.value = driversByBranchOffice.value;
      } else if (newValue && filterBy.value?.value === 'code') {
        variablesDriversByCode.code = "";
        variablesDriversByCode.code = newValue.value;
        loadDriversByCode();
      } else if (!newValue) {
        driversList.value = drivers.value;
      }
    }, { deep: true })

    watch(() => driversByBranchOffice.value, (newValue) => {
      listDriversByBranchOffice.value = newValue;
      driversList.value = listDriversByBranchOffice.value;
    }, { deep: true })

    watch(() => driversByCode.value, (newValue) => {
      driverByCode.value = [];
      driverByCode.value.push(newValue);
      driversList.value = driverByCode.value;
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

    const formatCodeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.code,
        label: item.code,
      }));
      return valueFormated;
    };

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "enable/disable")
        isModalEnableDisableOpen.value = true;

      driverDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      driverDetails,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      drivers,
      loadDrivers,
      filterSelect,
      driversList,
      filterBy,
      filterValue,
      filtersOptions,
      headersDriversListExport,
    };
  },
};
</script>
<style></style>
