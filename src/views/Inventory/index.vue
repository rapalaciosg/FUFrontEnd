<template>
  <div class="space-y-5">
    <Card title="Transferir inventario">
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-5">
        <VueSelect :options="options" placeholder="Seleccione una opción" />
        <Textinput name="pn" type="text" placeholder="Input" />
        <FromGroup name="d1">
          <flat-pickr
            v-model="dateDefault"
            class="form-control"
            id="d1"
            placeholder="yyyy-dd-mm"
          />
        </FromGroup>
        <div class="col-span-3 lg:col-span-1 grid grid-cols-3 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <BasicModal title="Registrar" btnClass="btn-success" />
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
      headersSecondTable: [
        { label: "Camión o ruta", field: "id" },
        { label: "Distribuidor", field: "distributor" },
        { label: "Orden de atención", field: "OrderAttention" },
        { label: "N° de factura", field: "billNumber" },
        { label: "Id interno", field: "idIntern" },
        { label: "Id sucursal", field: "idBranchOffice" },
        { label: "Cliente", field: "customer" },
        { label: "Dirección", field: "address" },
        { label: "Estado", field: "status" },
        { label: "Importe total", field: "total" },
        { label: "Precio", field: "price" },
        { label: "Cilindros Sol.", field: "cilindersOne" },
        { label: "Cilindros Fac.", field: "cilindersTwo" },
        { label: "Inventario actual", field: "currentInventory" },
        { label: "Fif nuesto", field: "ourFif" },
        { label: "Fif otros", field: "otherFif" },
        { label: "N° público de pedidos", field: "publicOrderNumber" },
        { label: "N° de pedidos", field: "orderNumber" },
        { label: "Forma de pago", field: "paymentType" },
      ],
    };
  },
};
</script>
<style></style>
