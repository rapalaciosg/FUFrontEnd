<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="updateBranchOffice">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿{{ action }} esta sucursal: {{ branchOffice.branchOfficeName }}?</h5>
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
    const toast = useToast();

    let closeModal = ref(false);

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
      updatedBy: "",
    });

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
        branchOffice.companyId = newValue.companyId
        branchOffice.active = newValue.active
        branchOffice.provinceId = newValue.provinceId
        branchOffice.updatedBy = keycloak.tokenParsed.preferred_username
      },
      { deep: true }
    );

    const { mutate: updateBranchOfficeMut } = useMutation(UPDATE_BRANCH_OFFICE, () => ({
      variables: { inputModel: branchOffice },
    }));

    const updateBranchOffice = () => {
      branchOffice.active = !branchOffice.active
      updateBranchOfficeMut()
        .then((response) => {
          emit("branch-office-updated");
          toast.success("Sucursal actualiza exitosamente", {
            timeout: 2000,
          });
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });
      closeModal.value = !closeModal.value;
    }

    return { closeModal, updateBranchOffice };
  },
};
</script>
