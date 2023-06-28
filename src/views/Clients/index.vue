<template>
  <div class="space-y-5">
    <Card title="Lista de clientes">
      <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Ruta o Camión" />
        <div class="grid grid-cols-3 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <BasicModal title="Crear cliente" btnClass="btn-success" />
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
import { routesData, routesDateTwo } from "../../constant/basic-tablle-data.js";
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
        { label: "Ruta", field: "route" },
        { label: "Distribuidor", field: "distributor" },
        { label: "Id interno", field: "idIntern" },
        { label: "Id sucursal", field: "idBranchOffice" },
        { label: "Cliente", field: "customer" },
        { label: "Provincia", field: "addressOne" },
        { label: "Distrito", field: "addressTwo" },
        { label: "Corregimiento", field: "addressThree" },
        { label: "Dirección", field: "address" },
        { label: "Tipo de negocio", field: "businessType" },
        { label: "Fif nuesto", field: "ourFif" },
        { label: "Fif otros", field: "otherFif" },
        { label: "Editar", field: "edit" },
      ],
      data: [
        {
          route: "TL2",
          distributor: "Test",
          idIntern: "CL2",
          idBranchOffice: "Test",
          customer: "Clientes test",
          addressOne: "Test",
          addressTwo: "Test",
          addressThree: "Test",
          address: "Test",
          businessType: "Test",
          ourFif: "Test",
          otherFif: "Test",
          edit: ""
        },
        {
          route: "TL2",
          distributor: "Test",
          idIntern: "CL2",
          idBranchOffice: "Test",
          customer: "Clientes test",
          addressOne: "Test",
          addressTwo: "Test",
          addressThree: "Test",
          address: "Test",
          businessType: "Test",
          ourFif: "Test",
          otherFif: "Test",
          edit: ""
        }
      ]
    };
  },
};
</script>
<style></style>
