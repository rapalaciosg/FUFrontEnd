<template>
  <div class="space-y-5">
    <Card title="Lista de clientes">
      <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect
          :options="options"
          v-model="truckId"
          placeholder="Ruta o Camión"
        />
        <div class="grid grid-cols-3 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <CreateClientModal title="Crear cliente" btnClass="btn-success" />
          <Button class="h-[40px]" text="Exportar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersClientsTable" :data="clients" :actions="actions" @open-modal="toggleModal" />
    <EditClientModal title="Editar cliente" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" :data="client" />
  </div>
</template>

<script> 
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import CreateClientModal from "@/components/WebFrontendComponents/Modals/Clients/CreateClientModal.vue";
import EditClientModal from "@/components/WebFrontendComponents/Modals/Clients/EditClientModal.vue";
import { headersClientsTable } from "@/constant/clients/constantClient.js";
import { useClientsStore } from "@/store/clients/clientsStore.js";

import { GET_ALL_CLIENTS_QUERY, GET_CLIENT_QUERY } from "@/services/clients/clientsGraphql.js";
import { useQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "../../main.js";

export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    EditClientModal,
    CreateClientModal,
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
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
      ],
    };
  },
  setup() {
    const variablesClients = reactive({ truckId: "" });
    const variablesClient = reactive({ customerId: "" });
    const clientStore = useClientsStore();

    let isModalOpen = ref(false);
    const truckId = ref("");

    const queryGetClients = provideApolloClient(apolloClient)(() => useQuery(GET_ALL_CLIENTS_QUERY, variablesClients));
    const queryGetClient = provideApolloClient(apolloClient)(() => useQuery(GET_CLIENT_QUERY, variablesClient));

    const clients = computed(() => queryGetClients.result.value?.srvLoadClientsAll ?? []);
    const client = computed(() => queryGetClient.result.value?.srvUserInfo ?? []);

    watch(() => truckId, newValue => {
      variablesClients.truckId = newValue.value.value
    }, { deep: true })

    const toggleModal = (value) => {
      if(value.action === 'edit')
        isModalOpen.value = true

      variablesClient.customerId = value.row.clienteID
    }

    return { 
      clients,
      variablesClients,
      client,
      isModalOpen,
      toggleModal,
      truckId,
    };
  },
};
</script>
<style></style>
