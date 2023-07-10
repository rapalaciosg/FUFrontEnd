<template>
    <div class="space-y-5">
      <Card title="Reporte de ventas por cliente">
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
    </div>
  </template>
  <script>
  import Card from "@/components/DashCodeComponents/Card";
  import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
  import Textinput from "@/components/DashCodeComponents/Textinput";
  import FromGroup from "@/components/DashCodeComponents/FromGroup";
  import Button from "@/components/DashCodeComponents/Button";
  import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
  import { routesData, routesDateTwo } from "../../../constant/basic-tablle-data.js";
  export default {
    components: {
      Card,
      VueSelect,
      Button,
      AdvancedTable,
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
          { label: "Cliente", field: "quantity" },
          { label: "Proyecto", field: "import" },
          { label: "Almacen", field: "price" },
          { label: "Movimiento", field: "route" },
          { label: "Movimiento id", field: "route" },
          { label: "Fecha de emisión", field: "route" },
          { label: "Cantidad", field: "route" },
          { label: "Articulo", field: "route" },
        ],
      };
    },
  };
  </script>
  <style></style>
  