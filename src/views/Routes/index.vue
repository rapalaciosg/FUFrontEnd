<template>
  <div class="space-y-5">
    <Card title="Dashboard Rutas">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Proyecto" />
        <VueSelect :options="options" placeholder="Producto" />
        <div class="grid grid-cols-2 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <Button class="h-[40px]" text="Limpiar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-5">
      <div class="lg:col-span-5">
        <AdvancedTable :headers="headers" :data="routesData" title="Listado de rutas" />
      </div>
      <div class="lg:col-span-2">
        <Card title="routes calculation">
          <div class="legend-ring3">
            <apexchart
              type="pie"
              height="335"
              :options="
                this.$store.themeSettingsStore.isDark
                  ? pieChartDark.chartOptions
                  : pieChart.chartOptions
              "
              :series="pieChart.series"
            />
          </div>
        </Card>
      </div>
    </div>
    <AdvancedTable :headers="headersSecondTable" :data="routesDateTwo" title="Listado de rutas" />
  </div>
</template>
<script>
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { routesData, routesDateTwo } from "../../constant/basic-tablle-data.js";
import {
  pieChart,
  pieChartDark,
  stacked,
  stackedDark,
} from "../../constant/analytics-components-data.js";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
  },
  data() {
    return {
      routesDateTwo,
      routesData,
      pieChart,
      pieChartDark,
      stacked,
      stackedDark,
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
      headers: [
        { label: "Camión o ruta", field: "id", },
        { label: "Distribuidor", field: "distributor", },
        { label: "Producto", field: "product", },
        { label: "Atendido", field: "attended", },
        { label: "Incidencia", field: "notAttended", },
        { label: "En curso", field: "inProgress", },
        { label: "Total", field: "total", },
        { label: "Cilindros Sol.", field: "cilindersOne", },  
        { label: "Cilindros Fac.", field: "cilindersTwo", },
        { label: "% Cumplimiento", field: "percent", },
      ],
      headersSecondTable: [
        { label: "Camión o ruta", field: "id", },
        { label: "Distribuidor", field: "distributor", },
        { label: "Orden de atención", field: "OrderAttention", },
        { label: "N° de factura", field: "billNumber", },
        { label: "Id interno", field: "idIntern", },
        { label: "Id sucursal", field: "idBranchOffice", },
        { label: "Cliente", field: "customer", },
        { label: "Dirección", field: "address", },  
        { label: "Estado", field: "status", },
        { label: "Importe total", field: "total", },
        { label: "Precio", field: "price", },
        { label: "Cilindros Sol.", field: "cilindersOne", },
        { label: "Cilindros Fac.", field: "cilindersTwo", },
        { label: "Inventario actual", field: "currentInventory", },
        { label: "Fif nuesto", field: "ourFif", },
        { label: "Fif otros", field: "otherFif", },
        { label: "N° público de pedidos", field: "publicOrderNumber", },
        { label: "N° de pedidos", field: "orderNumber", },
        { label: "Forma de pago", field: "paymentType", },
      ],
    }
  }
};
</script>
<style lang="scss">
  .modal-groups {
    @apply flex items-center flex-wrap justify-start;
    > button {
      @apply mr-3 mb-3;
    }
  }
</style>