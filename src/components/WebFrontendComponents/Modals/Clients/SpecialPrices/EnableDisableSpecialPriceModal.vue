<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateSpecialPrice">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{ action }} este precio especial: {{ specialPrice.specialPriceId }}?</h5>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">{{ action }}</button>
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

import { UPDATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    action: {
      type: String,
      default: "",
    },
    specialPrice: {
      type: Object,
      default: {},
    },
  },
  emits: ["special-price-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const specialPrice = reactive({
      specialPriceId: 0,
      productId: 0,
      branchOfficeId: 0,
      customerId: 0,
      adjustment: 0,
      active: true
    });

    // Function to get and set data from props

    const setData = (props) => {
      specialPrice.specialPriceId = props.specialPriceId;
      specialPrice.productId = props.product.productId;
      specialPrice.branchOfficeId = props.branchOffice.branchOfficeId;
      specialPrice.customerId = props.customer.customerId;
      specialPrice.adjustment = props.adjustment;
      specialPrice.active = props.active;
    }

    // Mounted function

    onMounted(() => {
      activeModal.value = true;
      setData(props.specialPrice);
    })

    // Watchers

    watch(
      () => props.specialPrice,
      (newValue) => {
        specialPrice.specialPriceId = newValue.specialPriceId;
        specialPrice.productId = newValue.product.productId;
        specialPrice.branchOfficeId = newValue.branchOffice.branchOfficeId;
        specialPrice.customerId = newValue.customer.customerId;
        specialPrice.adjustment = newValue.adjustment;
        specialPrice.active = newValue.active;
      },
      { deep: true }
    );

    // Apollo mutations

    const { mutate: updateSpecialPriceMut } = useMutation(UPDATE_SPECIAL_PRICE, () => ({ variables: { inputModel: specialPrice } }));

    // Trigger function form

    const updateSpecialPrice = async () => {
      specialPrice.active = !specialPrice.active;

      await updateSpecialPriceMut()
        .then((response) => {
          if (response.data.updateSpecialPrice.statusCode === 'OK') toast.success("Precio especial actualizado exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateSpecialPrice.message, { timeout: 2000 });

          emit("special-price-updated");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
    }

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, updateSpecialPrice, activeModal };
  },
};
</script>