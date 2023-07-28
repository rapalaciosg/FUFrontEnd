<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteCompany">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar esta compañia: {{ company.name }}?</h5>
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
import { ref, watch, reactive } from "vue";
import ModalBase from "../../ModalBase.vue";
import { useToast } from "vue-toastification";
import { DELETE_BRANCH_OFFICE } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    company: {
      type: Object,
      default: {},
    },
  },
  emits: ["company-deleted"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);
    let companyId = reactive(0);

    watch(
      () => props.company,
      (newValue) => {
        companyId = newValue.companyId;
      },
      { deep: true }
    );

    const { mutate: deleteCompanyMut } = useMutation(DELETE_COMPANY, () => ({
      variables: { id: companyId },
    }));

    const deleteCompany = () => {
      deleteCompanyMut()
        .then((response) => {
          emit("company-deleted");
          toast.success("Compañia eliminada exitosamente", {
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

    return { closeModal, deleteCompany };
  },
};
</script>
