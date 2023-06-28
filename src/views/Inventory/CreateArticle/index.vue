<template>
  <div class="space-y-5">
    <Card title="Crear articulo">
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Seleccione una opción" />
        <div class="grid grid-cols-3 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <BasicModal title="Nuevo registro" btnClass="btn-success" />
          <Button class="h-[40px]" text="Exportar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersSecondTable" />
  </div>
</template>
<script>
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import BasicModal from "@/components/WebFrontendComponents/Modals/BasicModal.vue";
import { routesData, routesDateTwo } from "../../../constant/basic-tablle-data.js";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    BasicModal,
    Textinput,
  },
  data() {
    return {
      options: [
        {
          value: "option1",
          label: "Option 1",
        },
        {
          value: "option2",
          label: "Option 2",
        },
        {
          value: "option3",
          label: "Option 3",
        },
      ],
      headersSecondTable: [
        { label: "Articulo", field: "id" },
        { label: "Descripción", field: "distributor" },
        { label: "Segunda descripción", field: "OrderAttention" },
        { label: "Nombre", field: "billNumber" },
        { label: "Grupo", field: "idIntern" },
        { label: "Categoría", field: "idBranchOffice" },
        { label: "Familia", field: "customer" },
        { label: "Línea", field: "address" },
        { label: "Impuesto", field: "status" },
        { label: "Estado", field: "total" },
        { label: "Existencia", field: "price" },
        { label: "Almacén", field: "cilindersOne" },
        { label: "Precio.", field: "cilindersTwo" },
        { label: "Editar", field: "currentInventory" },
      ],
    };
  },
};
</script>
<style></style>
