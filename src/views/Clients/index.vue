<template>
  <div class="space-y-5">
    <Card title="Lista de clientes">
      <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect
          :options="options"
          v-model="truckId"
          placeholder="Ruta o Camión"
        />
        <div class="grid grid-cols-2 gap-x-5">
          <CreateClientModal title="Crear cliente" btnClass="btn-success" @client-created="isModalOpen = false" />
          <download-excel class="btn-info rounded pt-2 text-center" :data="clients" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersClientsTable" :data="clients" :actions="actions" @open-modal="toggleModal" />
    <EditClientModal title="Editar cliente" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" :data="client" @client-updated="refreshClientsList" />
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
import { headersClientsTable } from "@/constant/clients/customers/constantCustomers.js";
import { useClientsStore } from "@/store/clients/clientsStore.js";

import { GET_ALL_CLIENTS_QUERY, GET_CLIENT_QUERY } from "@/services/clients/clientsGraphql.js";
import { provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
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
        { value: "ML03", label: "ML04" },
        { value: "ML03", label: "ML05" },
        { value: "ML03", label: "ML" },
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

    const queryGetClients = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CLIENTS_QUERY, variablesClients));

    const queryGetClient = provideApolloClient(apolloClient)(() => useLazyQuery(GET_CLIENT_QUERY, variablesClient));

    const clients = computed(() => queryGetClients.result.value?.srvLoadClientsAll ?? []);
    const client = computed(() => queryGetClient.result.value?.srvUserInfo ?? []);

    watch(() => truckId, newValue => {
      variablesClients.truckId = newValue.value.value || newValue.value;
      loadClients()
    }, { deep: true })

    const toggleModal = (value) => {
      if(value.action === 'edit');
        isModalOpen.value = true

      variablesClient.customerId = value.row.clienteID;
      queryGetClient.load();
    }

    const loadClients = () => {
      queryGetClients.load() || queryGetClients.refetch()
    }

    const refreshClientsList = (value) => {
      truckId.value = value
      isModalOpen.value = false
    }

    return { 
      clients,
      variablesClients,
      client,
      isModalOpen,
      toggleModal,
      truckId,
      refreshClientsList,
      queryGetClients
    };
  },
};
</script>
<style></style>
