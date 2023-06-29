<template>
  <div class="space-y-5">
    <Card title="Lista de clientes">
      <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect
          :options="options"
          :modelValue="variables.truckId"
          placeholder="Ruta o Camión"
          @selected-value="setValueSelected"
        />
        <div class="grid grid-cols-3 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <BasicModal title="Crear cliente" btnClass="btn-success" />
          <Button class="h-[40px]" text="Exportar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersClientsTable" :data="clients" :actions="actions" />
  </div>
</template>

<script>
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import BasicModal from "@/components/WebFrontendComponents/Modals/BasicModal.vue";
import { headersClientsTable } from "../../constant/clients/constantClient.js";
import { computed, reactive } from "vue";
import { useClientsStore } from "@/store/clientsStore.js";

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
      headersClientsTable,
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ],
      actions: [
        { name: "view", icon: "heroicons-outline:eye" },
      ],
    };
  },
  setup() {
    const variables = reactive({ truckId: "" });
    const clientStore = useClientsStore();
    clientStore.getAllClients(variables);

    const clients = computed(
      () => clientStore.clients?.srvLoadClientsAll ?? []
    );

    const setValueSelected = (newValue) =>
      newValue
        ? (variables.truckId = newValue.value)
        : (variables.truckId = "");

    return { clients, setValueSelected, variables };
  },
};
</script>
<style></style>
