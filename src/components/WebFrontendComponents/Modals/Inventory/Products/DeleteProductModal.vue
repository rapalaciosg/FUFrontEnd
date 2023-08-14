<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteProduct">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar este producto: {{ product.name }}?</h5>
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
import keycloak from "@/security/KeycloakService.js";

import { DELETE_PRODUCT } from "@/services/inventory/products/productsGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    product: {
      type: Object,
      default: {},
    },
  },
  emits: ["product-deleted"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const productId = ref(0);

    // Function to get and set data from props

    const setData = (props) => productId.value = props.productId;

    // Mounted function

    onMounted(() => {
      setData(props.product);
      activeModal.value = true;
    })

    // Watchers

    watch(() => props.product, (newValue) => { productId.value = newValue.productId }, { deep: true });

    // Apollo mutations

    const { mutate: deleteProductMut } = useMutation(DELETE_PRODUCT, () => ({ variables: { id: productId.value } }));

    // Trigger function form

    const deleteProduct = async () => {
      await deleteProductMut()
        .then((response) => {
          if (response.data.deleteProduct.statusCode === 'OK') toast.success("Producto eliminado exitosamente", { timeout: 2000 });
          else toast.success(response.data.deleteProduct.message, { timeout: 2000 });

          emit("product-deleted");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }));

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, deleteProduct, activeModal };
  },
};
</script>
