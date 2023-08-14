<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateBranchOffice">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{ action }} esta sucursal: {{ branchOffice.branchOfficeName }}?</h5>
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

import { UPDATE_BRANCH_OFFICE } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
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
    branchOffice: {
      type: Object,
      default: {},
    },
  },
  emits: ["branch-office-updated"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const branchOffice = reactive({
      branchOfficeId: 0,
      branchOfficeName: "",
      ruc: "",
      dv: "",
      address: "",
      phone: "",
      email: "",
      provinceId: "",
      companyId: 0,
      active: false,
      updateBy: "",
    });

    // Function to get and set data from props

    const setData = (props) => {
      branchOffice.branchOfficeId = props.branchOfficeId
      branchOffice.address = props.address
      branchOffice.branchOfficeName = props.branchOfficeName
      branchOffice.dv = props.dv
      branchOffice.email = props.email
      branchOffice.phone = props.phone
      branchOffice.ruc = props.ruc
      branchOffice.companyId = props.company.companyId
      branchOffice.active = props.active
      branchOffice.provinceId = props.province.provinceId
      branchOffice.updateBy = keycloak.tokenParsed.preferred_username
    }

    // Mounted function

    onMounted(() => {
      activeModal.value = true;
      setData(props.branchOffice);
    })

    // Watchers

    watch(
      () => props.branchOffice,
      (newValue) => {
        branchOffice.branchOfficeId = newValue.branchOfficeId
        branchOffice.address = newValue.address
        branchOffice.branchOfficeName = newValue.branchOfficeName
        branchOffice.dv = newValue.dv
        branchOffice.email = newValue.email
        branchOffice.phone = newValue.phone
        branchOffice.ruc = newValue.ruc
        branchOffice.companyId = newValue.company.companyId
        branchOffice.active = newValue.active
        branchOffice.provinceId = newValue.province.provinceId
        branchOffice.updateBy = keycloak.tokenParsed.preferred_username
      },
      { deep: true }
    );

    // Apollo mutations

    const { mutate: updateBranchOfficeMut } = useMutation(UPDATE_BRANCH_OFFICE, () => ({ variables: { inputModel: branchOffice } }));

    // Trigger function form

    const updateBranchOffice = async () => {
      branchOffice.active = !branchOffice.active;

      await updateBranchOfficeMut()
        .then((response) => {
          if (response.data.updateBranchOffice.statusCode === 'OK') toast.success("Sucursal actualiza exitosamente", { timeout: 2000 });
          else toast.success(response.data.updateBranchOffice.message, { timeout: 2000 });

          emit("branch-office-updated");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
    }

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, updateBranchOffice, activeModal };
  },
};
</script>
