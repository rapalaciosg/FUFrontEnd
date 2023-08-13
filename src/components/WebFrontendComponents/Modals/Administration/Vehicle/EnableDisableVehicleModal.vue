<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateVehicle">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{ action }} esta vehículo: {{ vehicle.name }}?</h5>
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

    // Variables declaration

    const toast = useToast();
  
    const activeModal = ref(false);

    // Input model

    const vehicle = reactive({
      vehicleId: 0,
      name: "",
      code: "",
      description: "",
      licensePlate: "",
      branchOfficeId: 0,
      active: false
    });

    // Function to get and set data from props

    const setData = (props) => {
      vehicle.vehicleId = props.vehicleId;
      vehicle.name = props.name;
      vehicle.code = props.code;
      vehicle.description = props.description;
      vehicle.licensePlate = props.licensePlate;
      vehicle.branchOfficeId = props.branchOffice.branchOfficeId;
      vehicle.active = props.active;
    }

    // Mounted function

    onMounted(() => {
      activeModal.value = true;
      setData(props.vehicle);
    })

    // Watchers

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

    // Apollo mutations

    const { mutate: updateVehicleMut } = useMutation(UPDATE_VEHICLE, () => ({ variables: { inputModel: vehicle } }));

    // Trigger function form

    const updateVehicle = async () => {
      vehicle.active = !vehicle.active;

      await updateVehicleMut()
        .then((response) => {
          if (response.data.updateVehicle.statusCode === 'OK') toast.success("Vehículo actualizo exitosamente", { timeout: 2000 });
          else toast.success(response.data.updateVehicle.message, { timeout: 2000 });

          emit("vehicle-updated");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
        
      closeModal();
    };

    // Close modal function

    const closeModal = () => emit('close-modal');

  // Returning values

    return { activeModal, updateVehicle, closeModal };
  },
};
</script>
