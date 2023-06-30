import { defineStore } from "pinia";
import { GET_ALL_CLIENTS_QUERY, GET_CLIENT_QUERY } from "@/services/clients/clientsGraphql.js";
import { useQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "../../main.js";

export const useClientsStore = defineStore("clientsStore", {
  state: () => {
    return {
      clients: [],
      client: {},
      loading: null,
    };
    },
    getters: {
      getClients() {
        return this.clients
      }
    },
  actions: {
    getAllClients(variables) {
      //const { result, loading } = useQuery(GET_ALL_CLIENTS_QUERY, variables);
      const { result, loading } = provideApolloClient(apolloClient)(() => useQuery(GET_ALL_CLIENTS_QUERY, variables));

    console.log('result => ', result.value.srvLoadClientsAll)
    console.log('this.clients before set => ', this.clients)
      this.clients.value = result;
      console.log('this.clients after set => ', this.clients)
      console.log('this.getClients => ', this.getClients)
      
      this.loading = loading;
    },
    getClientDetails(variables) {
      const { result, loading } = useQuery(GET_CLIENT_QUERY, variables);

      this.client = result;
      this.loading = loading;
    },
  },
});
