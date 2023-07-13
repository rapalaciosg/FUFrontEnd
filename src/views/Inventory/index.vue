<template>
  <div class="space-y-5">
    <Card title="Transferir inventario">
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-5">
        <VueSelect :options="options" placeholder="Seleccione una opción" v-model="route" />
        <!-- <Textinput name="pn" type="text" placeholder="Input" /> -->
        <FromGroup name="d1">
          <flat-pickr
            v-model="dateDefault"
            class="form-control"
            id="d1"
            placeholder="Fecha inicio"
            :config="config"
          />
        </FromGroup>
        <FromGroup name="d1">
          <flat-pickr
            v-model="dateDefault2"
            class="form-control"
            id="d1"
            placeholder="Fecha fin"
            :config="config"
          />
        </FromGroup>
        <div class="col-span-3 lg:col-span-1 grid grid-cols-3 gap-x-5">
          <!-- <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" /> -->
          <CreateInvetoryTransferModal title="Registrar" btnClass="btn-success" />
          <download-excel class="btn-info rounded pt-2 text-center" :data="frecuenciesByTruckId" name="filename.xls">Exportar</download-excel>
          <!-- <Button class="h-[40px]" text="Exportar" btnClass="btn-info" /> -->
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersInvetoryTransferTable" :actions="actions" @open-modal="toggleModal" :data="frecuenciesByTruckId" />
    <EditInventoryTransferModal title="Editar cliente" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import CreateInvetoryTransferModal from "@/components/WebFrontendComponents/Modals/Inventory/CreateInvetoryTransferModal.vue";
import EditInventoryTransferModal from "@/components/WebFrontendComponents/Modals/Inventory/EditInventoryTransferModal";
import { headersInvetoryTransferTable } from "@/constant/Inventory/constantInventory.js";

import { GET_INVENTORY_BY_TRUCKID, GET_INVENTORY_BY_DATE } from "@/services/Inventory/inventoryGraphql.js";
import { provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
import { apolloClient } from "../../main.js";

export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    FromGroup,
    CreateInvetoryTransferModal,
    EditInventoryTransferModal,
  },
  data() {
    return {
      headersInvetoryTransferTable,
      dateDefault: "",
      dateDefault2: "",
      actions: [
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
      ],
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML04", label: "ML04" },
        { value: "ML05", label: "ML05" },
        { value: "ML", label: "ML" },
      ],
    };
  },
  setup(props, {emit}) {
    const variablesFrecuenciesByTruckId = reactive({ truckId: "" });
    const variablesFrecuenciesByDate = reactive({ truckId: "", startDate: "", endDate: "" });

    const route = ref("");

    let isModalOpen = ref(false);

    const queryGetFrecuenciesByTruckId = provideApolloClient(apolloClient)(() => useLazyQuery(GET_INVENTORY_BY_TRUCKID, variablesFrecuenciesByTruckId));

    const queryGetFrecuenciesByDate = provideApolloClient(apolloClient)(() => useLazyQuery(GET_INVENTORY_BY_DATE, variablesFrecuenciesByDate));

    const frecuenciesByTruckId = computed(() => queryGetFrecuenciesByTruckId.result.value?.srvDataListaTransferencia ?? []);

    watch(() => frecuenciesByTruckId, newValue => {
      console.log('newValue => ', newValue);
      console.log('newValue.length => ', newValue.value.length);
      for (let index = 0; index < newValue.value.length; index++) {
        const [ dateSplit, hourSplit ] = newValue.value[index].fecha.split('T')
        console.log(dateSplit);
        // newValue.value[index].fecha = dateSplit
      }
    }, { deep: true })

    const dateFormat = (date) => {
      const [ dateSplit, hourSplit ] = date.split('T')
      // const [ year, month, day ] = dateSplit.split('-')
      // const dateFormatted = `${month}-${day}-${year}`
      return dateSplit
    }

    watch(() => route, newValue => {
      variablesFrecuenciesByTruckId.truckId = newValue.value.value || newValue.value;
      loadFrecuenciesByTruckId()
    }, { deep: true })

    const loadFrecuenciesByTruckId = () => {
      queryGetFrecuenciesByTruckId.load() || queryGetFrecuenciesByTruckId.refetch()
    }

    // const refreshClientsList = (value) => {
    //   truckId.value = value
    //   isModalOpen.value = false
    // }

    const toggleModal = (value) => {
      if(value.action === 'edit');
        isModalOpen.value = true
    }

    const config = ref({
      dateFormat: 'm-d-Y',
    });

    return { isModalOpen, toggleModal, config, route, frecuenciesByTruckId }
  }
};
</script>
<style></style>
