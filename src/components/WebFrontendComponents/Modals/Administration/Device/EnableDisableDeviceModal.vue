<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updatePos">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{ action }} esta dispositivo: {{ device.deviceId }}?</h5>
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
import moment from "moment";

import { UPDATE_POS } from "@/services/administration/devices/deviceGraphql.js";
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
    device: {
      type: Object,
      default: {},
    },
  },
  emits: ["pos-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const pos = reactive({
      posId: 0,
      branchOfficeId: 0,
      deviceId: "",
      dPtoFacDF: "",
      invoicePrefix: "",
      invoiceSequential: 0,
      invoiceOnline: false,
      invoiceNumberCopies: 0,
      invoiceNumberClosings: 0,
      eInvoiceSequential: 0,
      freight: false,
      creditPrefix: "",
      creditSequential: 0,
      printer: "",
      createdBy: "",
      createdDate: "",
      updateBy: "",
      active: true,
      updateDate: ""
    });

    // Function to get and set data from props

    const setData = (props) => {
      pos.posId = props.posId;
      pos.active = props.active;
      pos.createdBy = props.createdBy;
      pos.createdDate = props.createdDate;
      pos.invoiceSequential = props.invoiceSequential;
      pos.invoiceNumberCopies = props.invoiceNumberCopies;
      pos.invoiceNumberClosings = props.invoiceNumberClosings;
      pos.eInvoiceSequential = props.eInvoiceSequential;
      pos.creditSequential = props.creditSequential;
      pos.deviceId = props.deviceId;
      pos.dPtoFacDF = props.dPtoFacDF;
      pos.invoicePrefix = props.invoicePrefix;
      pos.creditPrefix = props.creditPrefix;
      pos.printer = props.printer;
      pos.invoiceOnline = props.invoiceOnline;
      pos.freight = props.freight;
      pos.branchOfficeId = props.branchOffice.branchOfficeId;
      pos.updateBy = props.updateBy;
    }

    // Mounted function

    onMounted(() => {
      activeModal.value = true;
      setData(props.device);
    });

    // Watchers

    watch(
      () => props.device,
      (newValue) => {
        pos.posId = newValue.posId;
        pos.active = newValue.active;
        pos.createdBy = newValue.createdBy;
        pos.createdDate = newValue.createdDate;
        pos.invoiceSequential = newValue.invoiceSequential;
        pos.invoiceNumberCopies = newValue.invoiceNumberCopies;
        pos.invoiceNumberClosings = newValue.invoiceNumberClosings;
        pos.eInvoiceSequential = newValue.eInvoiceSequential;
        pos.creditSequential = newValue.creditSequential;
        pos.deviceId = newValue.deviceId;
        pos.dPtoFacDF = newValue.dPtoFacDF;
        pos.invoicePrefix = newValue.invoicePrefix;
        pos.creditPrefix = newValue.creditPrefix;
        pos.printer = newValue.printer;
        pos.invoiceOnline = newValue.invoiceOnline;
        pos.freight = newValue.freight;
        pos.branchOfficeId = newValue.branchOffice.branchOfficeId;
        pos.updateBy = newValue.updateBy;
      },
      { deep: true }
    );

    // Apollo mutations

    const { mutate: updatePosMut } = useMutation(UPDATE_POS, () => ({ variables: { inputModel: pos }}));

    // Trigger function form

    const updatePos = async () => {
      pos.active = !pos.active;
      pos.updateBy = keycloak.tokenParsed.preferred_username;
      pos.updateDate = moment();

      await updatePosMut()
        .then((response) => {
          if (response.data.updatePos.statusCode === "OK") toast.success("Dispositivo actualizado exitosamente", { timeout: 2000 });
          else toast.error(response.data.updatePos.message, { timeout: 2000 });

          emit("pos-updated");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }));

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return { closeModal, updatePos, activeModal };
  },
};
</script>
