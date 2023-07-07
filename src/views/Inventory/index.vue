<template>
  <div class="space-y-5">
    <Card title="Transferir inventario">
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-5">
        <VueSelect :options="options" placeholder="Seleccione una opción" />
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
          <download-excel class="btn-info rounded pt-2 text-center" :data="clients" name="filename.xls">Exportar</download-excel>
          <!-- <Button class="h-[40px]" text="Exportar" btnClass="btn-info" /> -->
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersInvetoryTransferTable" :actions="actions" @open-modal="toggleModal" />
    <EditInventoryTransferModal title="Editar cliente" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" />
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import CreateInvetoryTransferModal from "@/components/WebFrontendComponents/Modals/Inventory/CreateInvetoryTransferModal.vue";
import EditInventoryTransferModal from "@/components/WebFrontendComponents/Modals/Inventory/EditInventoryTransferModal";
import { headersInvetoryTransferTable } from "@/constant/Inventory/constantInventory.js";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    Textinput,
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
        { value: "ML03", label: "ML04" },
        { value: "ML03", label: "ML05" },
        { value: "ML03", label: "ML" },
      ],
    };
  },
  setup(props) {
    let isModalOpen = ref(false);

    const toggleModal = (value) => {
      if(value.action === 'edit');
        isModalOpen.value = true
    }

    const config = ref({
      dateFormat: 'm/d/Y',
    });

    return { isModalOpen, toggleModal, config }
  }
};
</script>
<style></style>
