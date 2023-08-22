<template>
  <div class="space-y-5">
    <AdvancedTable title="Transferencias" :headers="headersInventoryTransferTable" :data="transfersList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal">
      <template v-slot:button>
        <Button class="h-[40px]" text="Transferir" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <DetailsTransferModal v-if="isModalDetailsOpen" title="Detalles de la transferencia" :data="transferDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateTransferModal v-if="isModalCreateOpen" title="Transferir" @trasnfer-created="loadTransfers()" @close-modal="isModalCreateOpen = false"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import Button from "@/components/DashCodeComponents/Button";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { headersInventoryTransferTable } from "@/constant/inventory/inventoryTransfer/constantInventoryTransfer.js";

import DetailsTransferModal from "@/components/WebFrontendComponents/Modals/Inventory/InventoryTransfer/DetailsTransferModal.vue";
import CreateTransferModal from "@/components/WebFrontendComponents/Modals/Inventory/InventoryTransfer/CreateTransferModal.vue";

import { GET_ALL_TRANSFER } from "@/services/inventory/inventoryTransfer/inventoryTransferGraphql.js";

import moment from 'moment';

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Card,
    VueSelect,
    Button,
    CreateTransferModal,
    DetailsTransferModal,
  },
  data() {
    return {
      headersInventoryTransferTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
      ],
    };
  },
  setup() {

    // Variables declaration

    let transferDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalDetailsOpen = ref(false);

    let headersTransferListExport = ref({});

    let transfersList = ref([]);

    // Apollo queries initialization

    const queryGetTransfers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_TRANSFER));

    // Apollo fetching data

    const transfers = computed(() => queryGetTransfers.result.value?.srvTransfer ?? []);

    // Apollo lazy functions

    const loadTransfers = () => queryGetTransfers.load() || queryGetTransfers.refetch();

    // Mounted function

    onMounted(() => {
      loadTransfers();
      headersTransferListExport.value = formatHeadersListExport(headersInventoryTransferTable);
    });

    // Watchers

    watch(() => transfers.value, (newValue) => { transfersList.value = newValue }, { deep: true });

    // watch(() => transfersList.value, (newValue) => {
    //   transfersList.value = newValue.map(item => ({
    //     transferId: item.transferId,
    //     origenWharehouseId: item.origenWharehouseId,
    //     destinationWharehouseId: item.destinationWharehouseId,
    //     productId: item.productId,
    //     quantity: item.quantity,
    //     createdBy: item.createdBy,
    //     createdDate: moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss'),
    //     warehouseInputOrigin: item.warehouseInputOrigin,
    //     warehouseInputDestination: item.warehouseInputDestination,
    //     product: item.product,
    //   }));
    // }, { deep: true })

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

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        transferDetails.value = value.row;

        transferDetails.value["productSelect"] = { value: value.row.product.productId, label: value.row.product.name };

        transferDetails.value["warehouseOriginSelect"] = { value: value.row.warehouseInputOrigin.warehouseId, label: value.row.warehouseInputOrigin.name };

        transferDetails.value["warehouseDestinationSelect"] = { value: value.row.warehouseInputDestination.warehouseId, label: value.row.warehouseInputDestination.name };

        if (value.action === "details") isModalDetailsOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      loadTransfers,
      transfersList,
      isModalCreateOpen,
      isModalDetailsOpen,
      transferDetails,
      headersTransferListExport,
    };
  },
};
</script>
<style></style>
