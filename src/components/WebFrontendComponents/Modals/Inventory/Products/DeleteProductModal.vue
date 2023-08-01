<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteProduct">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar esta producto: {{ product.code }}?</h5>
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
    const toast = useToast();

    let closeModal = ref(false);

    const productId = ref("");

    watch(
      () => props.product,
      (newValue) => {
        productId.value = newValue.productId;
      },
      { deep: true }
    );

    const { mutate: deleteProductMut } = useMutation(DELETE_PRODUCT, () => ({
      variables: { id: productId.value },
    }));

    const deleteProduct = () => {
      deleteProductMut()
        .then((response) => {
          emit("product-deleted");
          toast.success("Producto eliminado exitosamente", {
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

    return { closeModal, deleteProduct };
  },
};
</script>
