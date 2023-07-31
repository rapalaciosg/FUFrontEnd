<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateVehicle">
        <div class="grid grid-cols-1 gap-5">
          <h5>
            ¿{{ action }} esta vehículo: {{ vehicle.name }}?
          </h5>
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

import { UPDATE_VEHICLE } from "@/services/administration/vehicle/vehicleGraphql.js";
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
    vehicle: {
      type: Object,
      default: {},
    },
  },
  emits: ["vehicle-updated"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const vehicle = reactive({
      vehicleId: 0,
      name: "",
      code: "",
      description: "",
      licensePlate: "",
      branchOfficeId: 0,
      active: false
    });

    watch(
      () => props.vehicle,
      (newValue) => {
        vehicle.vehicleId = newValue.vehicleId;
        vehicle.name = newValue.name;
        vehicle.code = newValue.code;
        vehicle.description = newValue.description;
        vehicle.licensePlate = newValue.licensePlate;
        vehicle.branchOfficeId = newValue.branchOffice.branchOfficeId;
        vehicle.active = newValue.active;
      },
      { deep: true }
    );

    const { mutate: updateVehicleMut } = useMutation(
      UPDATE_VEHICLE,
      () => ({
        variables: { inputModel: vehicle },
      })
    );

    const updateVehicle = () => {
      vehicle.active = !vehicle.active;
      updateVehicleMut()
        .then((response) => {
          emit("vehicle-updated");
          toast.success("Vehículo actualizo exitosamente", {
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

    return { closeModal, updateVehicle };
  },
};
</script>
