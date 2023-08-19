<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="deviceSelect" :placeholder="'Filtrar por dispositivo'" v-model="filterValue"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="devicesList" :fields="headersDevicesListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de dispositivos" :headers="headersDevicesTable" :data="devicesList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal" :filter="filterSelect">
      <template v-slot:button>
        <div class="grid grid-cols-2 gap-2">
          <VueSelect :options="status" placeholder="Todos" v-model="filterSelect" />
          <Button class="h-[40px]" text="Crear dispositivo" btnClass="btn-success" @click="toggleModal()"/>
        </div>
      </template>
    </AdvancedTable>
    <DetailsDeviceModal v-if="isModalDetailsOpen" title="Detalles del dispositivo" :data="deviceDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateDeviceModal v-if="isModalCreateOpen" title="Crear dispositivo" @pos-created="loadDevices()" @close-modal="isModalCreateOpen = false"/>
    <EnableDisableDeviceModal v-if="isModalEnableDisableOpen" :title="deviceDetails.active ? 'Deshabilitar' : 'Habilitar'" :action="deviceDetails.active ? 'Deshabilitar' : 'Habilitar'" :device="deviceDetails" @close-modal="isModalEnableDisableOpen = false" @pos-updated="loadDevices()"/>
    <EditDeviceModal v-if="isModalEditOpen" title="Editar dispositivo" :data="deviceDetails" @close-modal="isModalEditOpen = false" @pos-updated="loadDevices()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { headersDevicesTable } from "@/constant/administration/device/constantDevice.js";

import CreateDeviceModal from "@/components/WebFrontendComponents/Modals/Administration/Device/CreateDeviceModal.vue";
import EditDeviceModal from "@/components/WebFrontendComponents/Modals/Administration/Device/EditDeviceModal.vue";
import DetailsDeviceModal from "@/components/WebFrontendComponents/Modals/Administration/Device/DetailsDeviceModal.vue";
import EnableDisableDeviceModal from "@/components/WebFrontendComponents/Modals/Administration/Device/EnableDisableDeviceModal.vue";

import { GET_ALL_POS, GET_ALL_POS_BY_DEVICE } from "@/services/administration/devices/deviceGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateDeviceModal,
    DetailsDeviceModal,
    EnableDisableDeviceModal,
    EditDeviceModal,
  },
  data() {
    return {
      headersDevicesTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Habilitar", icon: "ps:checked", value: "enable/disable" },
      ],
      status: [
        { label: "Habilitado", value: "enabled" },
        { label: "Deshabilitado", value: "disabled" },
      ],
    };
  },
  setup() {
    // Variables declaration

    let deviceDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalEnableDisableOpen = ref(false);

    let deviceSelect = ref([]);

    let headersDevicesListExport = ref({});

    let filterValue = ref(null);
    let filterSelect = ref("");

    let listDevicesByDeviceId = ref([]);

    let devicesList = ref([]);

    // Apollo variables

    const variablesDevicesByDeviceId = reactive({ id: "" });

    // Apollo queries initialization

    const queryGetDevices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_POS));

    const queryGetDevicesByDevice = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_POS_BY_DEVICE, variablesDevicesByDeviceId));

    // Apollo fetching data

    const devices = computed(() => queryGetDevices.result.value?.srvPos ?? []);

    const devicesBydeviceId = computed(() => queryGetDevicesByDevice.result.value?.srvPosByDeviceId ?? []);

    // Apollo lazy functions

    const loadDevices = () => queryGetDevices.load() || queryGetDevices.refetch();

    const loadDevicesByDeviceId = () => queryGetDevicesByDevice.load() || queryGetDevicesByDevice.refetch();

    // Mounted function

    onMounted(() => {
      loadDevices();
      headersDevicesListExport.value = formatHeadersListExport(headersDevicesTable);
    });

    // Watchers

    watch(() => devices.value, (newValue) => {
      deviceSelect.value = formatCodeSelect(newValue);
      devicesList.value = newValue;
    }, { deep: true });

    watch(
      () => filterValue.value,
      (newValue) => {
        if (!newValue) {
          devicesList.value = devices.value;
        } else {
          variablesDevicesByDeviceId.id = newValue.value;
          loadDevicesByDeviceId();
        }
      },
      { deep: true }
    );

    watch(
      () => devicesBydeviceId.value,
      (newValue) => {
        listDevicesByDeviceId.value = [];
        listDevicesByDeviceId.value.push(newValue);
        devicesList.value = listDevicesByDeviceId.value;
      },
      { deep: true }
    );

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

    const formatCodeSelect = (data) => data.map((item) => ({ value: item.deviceId, label: item.deviceId }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        deviceDetails.value = value.row;

        //deviceDetails.value["branchOfficeSelect"] = { value: value.row.branchOffice.branchOfficeId, label: value.row.branchOffice.branchOfficeName };

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
      loadDevices,
      deviceDetails,
      isModalEditOpen,
      isModalCreateOpen,
      isModalDetailsOpen,
      isModalEnableDisableOpen,
      filterValue,
      filterSelect,
      devicesList,
      headersDevicesListExport,
      deviceSelect,
    };
  },
};
</script>
<style></style>
