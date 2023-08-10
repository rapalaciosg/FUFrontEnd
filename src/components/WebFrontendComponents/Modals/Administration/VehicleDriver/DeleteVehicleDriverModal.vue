<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-1 gap-5 px-4 py-3">
        <h5>¿Desea eliminar la asociación del {{ data.data.commingFrom }} con el {{ (data.data.commingFrom === 'vehículo') ? 'conductor' : data.data.commingFrom }} <strong>{{ data.data.label }}</strong>?</h5>
      </div>
      <div
        class="px-4 pt-3 pb-1 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
      >
        <button
          class="btn btn-secondary block text-center"
          @click="closeModal = !closeModal"
        >
          Cancelar
        </button>
        <button
          class="btn btn-success block text-center"
          @click="deleteAsociation"
        >
          Eliminar
        </button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useToast } from "vue-toastification";
import ModalBase from "../../ModalBase.vue";
import { DELETE_VEHICLE_DRIVER } from "@/services/administration/vehicle-driver/vehicleDriverGraphql.js";
import keycloak from "@/security/KeycloakService.js";

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
  emits: ["asociation-deleted"],
  data() {
    return {
      rolDetails: {},
      rolesList: [],
    };
  },
  watch: {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();
    
    let closeModal = ref(false);

    let vehicleDriver = reactive({})

    watch(() => props.data, (newValue) => {
      console.log(newValue.inputModel);
      vehicleDriver = newValue.inputModel;
    }, { deep: true })

    const { mutate: deleteVehicleDriver } = useMutation(DELETE_VEHICLE_DRIVER, () => ({
      variables: { inputModel: vehicleDriver },
    }));

    const deleteAsociation = () => {
      deleteVehicleDriver()
        .then((response) => {
          toast.success("Asociación eliminada exitosamente", {
            timeout: 2000,
          });
          emit("asociation-deleted");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        })

      closeModal.value = !closeModal.value;
    };

    return { closeModal, deleteAsociation };
  },
};
</script>
