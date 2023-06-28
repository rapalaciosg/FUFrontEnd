<template>
  <div class="space-y-5">
    <Card title="Reporte">
      <div class="grid grid-cols-3 md:grid-cols-4 gap-5">
        <VueSelect :options="options" placeholder="Camión o ruta" />
        <FromGroup name="d1">
          <flat-pickr
            v-model="dateDefault"
            class="form-control"
            id="d1"
            placeholder="Desde"
          />
        </FromGroup>
        <FromGroup name="d1">
            <flat-pickr
              v-model="dateDefault"
              class="form-control"
              id="d1"
              placeholder="Hasta"
            />
          </FromGroup>
        <div class="col-span-3 md:col-span-1 grid grid-cols-2 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <Button class="h-[40px]" text="Exportar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersSecondTable" />
    <AdvancedTable :headers="headersFirstTable" />
  </div>
</template>
<script>
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import BasicModal from "@/components/WebFrontendComponents/Modals/BasicModal.vue";
import { routesData, routesDateTwo } from "../../constant/basic-tablle-data.js";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    BasicModal,
    Textinput,
    FromGroup,
  },
  data() {
    return {
      dateDefault: "",
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
      headersFirstTable: [
        { label: "Orden de atención", field: "id" },
        { label: "En ERP", field: "distributor" },
        { label: "ERP condición", field: "OrderAttention" },
        { label: "N° de factura", field: "billNumber" },
        { label: "ERP status", field: "billNumber" },
        { label: "Id interno", field: "idIntern" },
        { label: "Id sucursal", field: "idBranchOffice" },
        { label: "Cliente", field: "customer" },
        { label: "Dirección", field: "address" },
        { label: "Estado", field: "status" },
        { label: "Fecha de registro", field: "total" },
        { label: "Importe", field: "price" },
        { label: "Precio", field: "cilindersOne" },
        { label: "N° de cilindro", field: "cilindersTwo" },
        { label: "N° público de pedido", field: "currentInventory" },
        { label: "N° de pedido", field: "currentInventory" },
        { label: "Forma de pago", field: "currentInventory" },
        { label: "Hora aprox. de entrega", field: "currentInventory" },
      ],
      headersSecondTable: [
        { label: "Cantidad", field: "quantity" },
        { label: "Importe", field: "import" },
        { label: "Precio", field: "price" },
        { label: "Ruta", field: "route" },
      ],
    };
  },
};
</script>
<style></style>
