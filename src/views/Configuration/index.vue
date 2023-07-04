<template>
  <div class="space-y-5">
    <Card title="Código">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <Textinput class="col-span-1 lg:col-span-2" label="Código" name="pn" type="text" placeholder="Ingrese código" />
      </div>
    </Card>
    <Card title="Logo">
      <div class="grid grid-cols-1 gap-5">
        <DropZone />
      </div>
    </Card>
    <Card title="Encabezado">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Textinput label="Fondo del encabezado" name="pn" type="text" placeholder="Ingrese fondo del encabezado" />
        <Textinput label="Color de fuente" name="pn" type="text" placeholder="Ingrese color de fuente" />
      </div>
    </Card>
    <Card title="Menú lateral">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Textinput label="Color de fondo encabezado" name="pn" type="text" placeholder="Ingrese color de fondo encabezado" />
        <Textinput label="Color de fuente primario" name="pn" type="text" placeholder="Ingrese color de fuente primario" />
        <Textinput label="Color de fuente secundario" name="pn" type="text" placeholder="Ingrese color de fuente secundario" />
      </div>
    </Card>
    <Card title="Menú lateral cuerpo">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Textinput label="Color de fondo" name="pn" type="text" placeholder="Ingrese color de fondo" />
        <Textinput label="Color de fuente primario" name="pn" type="text" placeholder="Ingrese color de fuente primario" />
        <Textinput label="Color de fondo menú seleccionado" name="pn" type="text" placeholder="Ingrese color de fondo menú seleccionado" />
        <Textinput label="Color de fuente menú seleccionado" name="pn" type="text" placeholder="Ingrese color de fuente menú seleccionado" />
        <Textinput label="Color de fondo menú" name="pn" type="text" placeholder="Ingrese color de fondo menú" />
        <Textinput label="Color de fondo menú cursor flotante" name="pn" type="text" placeholder="Ingrese color de fondo menú cursor flotante" />
        <Textinput label="Color de fuente menú cursor flotante" name="pn" type="text" placeholder="Ingrese color de fuente menú cursor flotante" />
      </div>
    </Card>
    <Card title="Paneles">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Textinput label="Color de fondo de cabecera" name="pn" type="text" placeholder="Ingrese fondo de cabecera" />
        <Textinput label="Color de fondo cuerpo de panel" name="pn" type="text" placeholder="Ingrese color de fondo cuerpo de panel" />
      </div>
    </Card>
    <Card title="Pestañas">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Textinput label="Color de fondo desborde de pestañas" name="pn" type="text" placeholder="Ingrese color de fondo desborde de pestañas" />
        <Textinput label="Color de fondo pestañas de navegación" name="pn" type="text" placeholder="Ingrese color de fondo pestañas de navegación" />
        <Textinput label="Color primario de fuente" name="pn" type="text" placeholder="Ingrese color primario de fuente" />
      </div>
    </Card>
    <div class="grid grid-cols-4 gap-5">
      <div class="grid grid-cols-2 gap-5 col-end-6">
        <Button class="h-[40px]" text="Resetear" btnClass="btn-warning" />
        <Button class="h-[40px]" text="Guardar" btnClass="btn-info" />
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import DropZone from "@/components/WebFrontendComponents/Form/FileInput/DropZone.vue";
import { routesData, routesDateTwo } from "../../constant/basic-tablle-data.js";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    Textinput,
    FromGroup,
    DropZone,
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
