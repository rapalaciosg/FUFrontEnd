<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteRoute">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar esta ruta: {{ route.name }}?</h5>
        </div>
        <div
          class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            class="btn btn-secondary block text-center"
            @click="closeModal = !closeModal"
          >
            Cerrar
          </button>
          <button type="submit" class="btn btn-success block text-center">
            Eliminar
          </button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted, reactive } from "vue";
import ModalBase from "../../ModalBase.vue";
import { useToast } from "vue-toastification";
import keycloak from "@/security/KeycloakService.js";

import { DELETE_ROUTE } from "@/services/routes/routes/routesGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    route: {
      type: Object,
      default: {},
    },
  },
  emits: ["route-deleted"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const routeId = ref("");

    watch(
      () => props.route,
      (newValue) => {
        routeId.value = newValue.routeId;
      },
      { deep: true }
    );

    const { mutate: deleteRouteMut } = useMutation(DELETE_ROUTE, () => ({
      variables: { id: routeId.value },
    }));

    const deleteRoute= () => {
      deleteRouteMut()
        .then((response) => {
          emit("route-deleted");
          toast.success("Ruta eliminada exitosamente", {
            timeout: 2000,
          });
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });
      closeModal.value = !closeModal.value;
    };

    return { closeModal, deleteRoute };
  },
};
</script>
