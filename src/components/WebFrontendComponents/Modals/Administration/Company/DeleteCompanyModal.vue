<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteCompany">
        <div class="grid grid-cols-1 gap-5">
          <h5>¿Desea eliminar esta compañía: {{ company.name }}?</h5>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Eliminar</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, reactive, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";
import { useToast } from "vue-toastification";
import { DELETE_COMPANY } from "@/services/administration/company/companyGraphql.js";
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

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    let companyId = reactive(0);

    // Function to get and set data from props

    const setData = (props) => companyId = props.companyId;

    // Mounted function

    onMounted(() => {
      setData(props.company);
      activeModal.value = true;
    })

    // Watchers

    watch(() => props.company, (newValue) => { companyId = newValue.companyId }, { deep: true });

    // Apollo mutations

    const { mutate: deleteCompanyMut } = useMutation(DELETE_COMPANY, () => ({ variables: { id: companyId }}));

    // Trigger function form

    const deleteCompany = async () => {
      await deleteCompanyMut()
        .then((response) => {
          if (response.data.deleteCompany.statusCode === 'OK') toast.success("Compañía eliminada exitosamente", { timeout: 2000 });
          else toast.success(response.data.deleteCompany.message, { timeout: 2000 });
          
          emit("company-deleted");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return { closeModal, deleteCompany, activeModal };
  },
};
</script>
