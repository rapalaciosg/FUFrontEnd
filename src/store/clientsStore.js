import { defineStore } from "pinia";
import { ALL_CLIENTS_QUERY } from "@/services/clientsGraphql.js";
import { useQuery, useMutation } from "@vue/apollo-composable";

export const useClientsStore = defineStore('clientsStore', {
    state: () => {
        return {
            clients: {},
            loading: null,
        }
    },
    actions: {
        getAllClients(variables) {
            const { result, loading } = useQuery(ALL_CLIENTS_QUERY, variables)

            this.clients = result
            this.loading = loading
        },
    }
})
