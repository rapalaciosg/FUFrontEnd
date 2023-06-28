<template>
  <div class="space-y-5">
    <Card title="Precios Especiales">
      <div class="grid grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Ruta o Camión" />
        <VueSelect :options="options" placeholder="Producto" />
        <div class="col-span-2 2xl:col-span-1 grid grid-cols-3 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <BasicModal title="Registrar precio" btnClass="btn-success" />
          <Button class="h-[40px]" text="Exportar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersSecondTable" :data="data" />
  </div>
</template>
<script>
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
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
        { label: "Cliente id", field: "customerId" },
        { label: "Id interno", field: "idIntern" },
        { label: "Id sucursal", field: "idBranchOffice" },
        { label: "Articulo id", field: "articleId" },
        { label: "Ajuste precio", field: "priceAdjusted" },
        { label: "Fecha inicial", field: "startDate" },
        { label: "Fecha final", field: "endDate" },
        { label: "Ruta", field: "route" },
        { label: "Estado", field: "status" },
        { label: "Empresa", field: "company" },
        { label: "Editar", field: "edit" },
      ],
      data: [
        {
          customerId: "CL4",
          idIntern: "SH1",
          idBranchOffice: "OF7",
          articleId: "ART032",
          priceAdjusted: "0.00",
          startDate: "26/06/2023",
          endDate: "26/06/2023",
          route: "TML1",
          status: "Test",
          company: "Test",
          edit: ""
        },
        {
          customerId: "CL4",
          idIntern: "SH1",
          idBranchOffice: "OF7",
          articleId: "ART032",
          priceAdjusted: "0.00",
          startDate: "26/06/2023",
          endDate: "26/06/2023",
          route: "TML1",
          status: "Test",
          company: "Test",
          edit: ""
        }
      ]
    };
  },
};
</script>
<style></style>
