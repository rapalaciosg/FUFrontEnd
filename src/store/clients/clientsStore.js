import { defineStore } from "pinia";
import { GET_ALL_CLIENTS_QUERY, GET_CLIENT_QUERY } from "@/services/clients/clientsGraphql.js";
import { useQuery, useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "../../main.js";

export const useClientsStore = defineStore("clientsStore", {
  state: () => {
    return {
      clients: {},
      client: {},
      loading: null,
    };
    },
    getters: {
      getClients(state) {
        return state.clients
      }
    },
  actions: {
    getAllClients(variables) {
      //const { result, loading } = useQuery(GET_ALL_CLIENTS_QUERY, variables);
      const clientsAll = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CLIENTS_QUERY, variables));

      this.clients = clientsAll;
    },
    getClientDetails(variables) {
      const { result, loading } = useQuery(GET_CLIENT_QUERY, variables);

      this.client = result;
      this.loading = loading;
    },
  },
});
