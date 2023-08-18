<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateWarehouse">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{ action }} esta bodega: {{ warehouse.name }}?</h5>
        </div>
        <div
          class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            class="btn btn-secondary block text-center"
            @click="closeModal()"
          >
            Cerrar
          </button>
          <button type="submit" class="btn btn-success block text-center">
            {{ action }}
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

import { UPDATE_WAREHOUSE } from "@/services/inventory/warehouses/warehousesGraphql.js";
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
    warehouse: {
      type: Object,
      default: {},
    },
  },
  emits: ["warehouse-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const warehouse = reactive({
      warehouseId: 0,
      name: "",
      code: "",
      isPrimary: false,
      vehicleId: 0,
      active: false,
    });

    // Function to get and set data from props

    const setData = (props) => {
      warehouse.warehouseId = props.warehouseId;
      warehouse.active = props.active;
      warehouse.name = props.name;
      warehouse.code = props.code;
      warehouse.isPrimary = props.isPrimary;
      warehouse.vehicleId = props.vehicle.vehicleId;
    };

    // Mounted function

    onMounted(() => {
      activeModal.value = true;
      setData(props.warehouse);
    });

    // Watchers

    watch(
      () => props.warehouse,
      (newValue) => {
        warehouse.warehouseId = newValue.warehouseId;
        warehouse.active = newValue.active;
        warehouse.name = newValue.name;
        warehouse.code = newValue.code;
        warehouse.isPrimary = newValue.isPrimary;
        warehouse.vehicleId = newValue.vehicle.vehicleId;
      },
      { deep: true }
    );

    // Apollo mutations

    const { mutate: updateWarehouseMut } = useMutation(
      UPDATE_WAREHOUSE,
      () => ({ variables: { inputModel: warehouse } })
    );

    // Trigger function form

    const updateWarehouse = async () => {
      warehouse.active = !warehouse.active;

      await updateWarehouseMut()
        .then((response) => {
          if (response.data.updateWarehouse.statusCode === "OK")
            toast.success("Bodega actualizada exitosamente", { timeout: 2000 });
          else
            toast.error(response.data.updateWarehouse.message, {
              timeout: 2000,
            });

          emit("warehouse-updated");
        })
        .catch((error) =>
          toast.error("Ha ocurrido un error", { timeout: 2000 })
        );

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return { closeModal, updateWarehouse, activeModal };
  },
};
</script>
