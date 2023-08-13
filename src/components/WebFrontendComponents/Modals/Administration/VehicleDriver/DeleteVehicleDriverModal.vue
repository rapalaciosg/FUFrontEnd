<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-1 gap-5 px-4 py-3">
        <h5>¿Desea eliminar la asociación del {{ commingFrom }} con el {{ (commingFrom === 'vehículo') ? 'conductor' : commingFrom }} <strong>{{ label }}</strong>?</h5>
      </div>
      <div class="px-4 pt-3 pb-1 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
        <button class="btn btn-secondary block text-center" @click="closeModal()">Cancelar</button>
        <button class="btn btn-success block text-center" @click="deleteAsociation()">Eliminar</button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref, reactive, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";

import { DELETE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
  },
  emits: ["asociation-deleted", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const commingFrom = ref("");
    const label = ref("");

    let vehicleDriver = reactive({});

    // Setting data from props

    const setData = (props) => {
      vehicleDriver = props.inputModel;
      commingFrom.value = props.data.commingFrom;
      label.value = props.data.label;
    }
    
    // Initialization function

    const initialize = () => {
      activeModal.value = true
      setData(props.data);
    }
    
    // Mounted function

    onMounted(() => initialize());

    // Watchers
    
    watch(() => props.data, (newValue) => {
      vehicleDriver = newValue.inputModel;
      commingFrom.value = newValue.data.commingFrom;
      label.value = newValue.data.label;
    }, { deep: true });

    // Apollo mutations

    const { mutate: deleteVehicleDriver } = useMutation(DELETE_VEHICLE_DRIVER, () => ({ variables: { inputModel: vehicleDriver }}));

    // Trigger function form

    const deleteAsociation = async () => {
      await deleteVehicleDriver()
        .then((response) => {
          toast.success("Asociación eliminada exitosamente", { timeout: 2000 });
          emit("asociation-deleted");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return { activeModal, deleteAsociation, closeModal, commingFrom, label };
  },
};
</script>
