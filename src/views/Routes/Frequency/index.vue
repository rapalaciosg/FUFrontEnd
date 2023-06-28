<template>
  <div class="space-y-5">
    <Card title="Frequencia">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Ruta o Camión" />
        <div class="grid grid-cols-2 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <Button class="h-[40px]" text="Exportar" btnClass="btn-success" />
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
import { routesData, routesDateTwo } from "@/constant/basic-tablle-data.js";
export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
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
        { label: "Ruta", field: "route", },
        { label: "Empresa", field: "company", },
        { label: "Id registro", field: "idRegister", },
        { label: "Cliente", field: "client", },
        { label: "Sucursal", field: "branchOffice", },
        { label: "Frecuencia", field: "frequency", },
        { label: "Próxima visita", field: "nextVisit", },
        { label: "Visita anterior", field: "lastVisit", },  
        { label: "Observaciones", field: "observations", },
        { label: "L", field: "monday", },
        { label: "M", field: "tuesday", },
        { label: "Mi", field: "wednesday", },
        { label: "J", field: "thursday", },
        { label: "V", field: "friday", },
        { label: "S", field: "saturday", },
        { label: "D", field: "sunday", },
        { label: "Editar", field: "edit", },
      ],
      data: [
        {
          route: "ML1",
          company: "Test",
          idRegister: "Id test",
          client: "Cliente test",
          branchOffice: "Test",
          frequency: "Test",
          nextVisit: "Test",
          lastVisit: "Test",
          observations: "Test",
          monday: "0",
          tuesday: "0",
          wednesday: "0",
          thursday: "0",
          friday: "0",
          saturday: "0",
          sunday: "0",
          edit: ""
        },
        {
          route: "ML1",
          company: "Test",
          idRegister: "Id test",
          client: "Cliente test",
          branchOffice: "Test",
          frequency: "Test",
          nextVisit: "Test",
          lastVisit: "Test",
          observations: "Test",
          monday: "0",
          tuesday: "0",
          wednesday: "0",
          thursday: "0",
          friday: "0",
          saturday: "0",
          sunday: "0",
          edit: ""
        }
      ]
    };
  },
};
</script>
<style></style>