<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteSpecialPrice">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar este precio especial: {{ specialPrice.specialPriceId }}?</h5>
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

import { DELETE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    specialPrice: {
      type: Object,
      default: {},
    },
  },
  emits: ["special-price-deleted"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const specialPriceId = ref("");

    watch(
      () => props.specialPrice,
      (newValue) => {
        specialPriceId.value = newValue.specialPriceId;
      },
      { deep: true }
    );

    const { mutate: deleteSpecialPricetMut } = useMutation(DELETE_SPECIAL_PRICE, () => ({
      variables: { id: specialPriceId.value },
    }));

    const deleteSpecialPrice = () => {
      deleteSpecialPricetMut()
        .then((response) => {
          emit("special-price-deleted");
          toast.success("Precio especial eliminado exitosamente", {
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

    return { closeModal, deleteSpecialPrice };
  },
};
</script>
