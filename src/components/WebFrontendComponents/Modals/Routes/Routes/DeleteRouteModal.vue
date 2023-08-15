<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteRoute">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar esta ruta: {{ route.name }}?</h5>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Eliminar</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted, reactive } from "vue";
import ModalBase from "../../ModalBase.vue";
import { useToast } from "vue-toastification";

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
  emits: ["route-deleted", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const routeId = ref("");

    // Function to get and set data from props

    const setData = (props) => routeId.value = props.routeId;

    // Mounted function

    onMounted(() => {
      setData(props.route);
      activeModal.value = true;
    })

    // Watchers

    watch(() => props.route, (newValue) => { routeId.value = newValue.routeId }, { deep: true });

    // Apollo mutations

    const { mutate: deleteRouteMut } = useMutation(DELETE_ROUTE, () => ({ variables: { id: routeId.value } }));

    // Trigger function form

    const deleteRoute = async () => {
      await deleteRouteMut()
        .then((response) => {
          if (response.data.deleteRoute.statusCode === 'OK') toast.success("Ruta eliminada exitosamente", { timeout: 2000 });
          else toast.success(response.data.deleteRoute.message, { timeout: 2000 });
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      emit("route-deleted");
      closeModal();
    };

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, deleteRoute, activeModal };
  },
};
</script>
