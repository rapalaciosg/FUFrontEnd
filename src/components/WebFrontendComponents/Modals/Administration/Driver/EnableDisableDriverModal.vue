<template>
    <modal-base :closeModal="closeModal">
      <template v-slot:modal-body>
        <form @submit.prevent="updateDriver">
          <div class="grid grid-cols-1 gap-5">
            <h5>
              ¿{{ action }} esta conductor: {{ driver.name }}?
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
  
  import { ENABLE_DISABLE_DRIVER } from "@/services/administration/driver/driverGraphql.js";
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
      driver: {
        type: Object,
        default: {},
      },
    },
    emits: ["driver-updated"],
    data() {
      return {};
    },
    setup(props, { emit }) {
      const toast = useToast();
  
      let closeModal = ref(false);
  
      const driver = reactive({
        driverId: 0,
        branchOfficeId: 0,
        name: "",
        lastName: "",
        code: "",
        boxCode: "",
        active: false,
        keycloakUserId: "",
        keycloakUser: ""
      });
  
      watch(
        () => props.driver,
        (newValue) => {
          driver.driverId = newValue.driverId;
          driver.branchOfficeId = newValue.branchOffice.branchOfficeId;
          driver.name = newValue.name;
          driver.lastName = newValue.lastName;
          driver.code = newValue.code;
          driver.boxCode = newValue.boxCode;
          driver.active = newValue.active
          driver.keycloakUserId = newValue.keycloakUserId;
          driver.keycloakUser = newValue.keycloakUser;
        },
        { deep: true }
      );
  
      const { mutate: updateDriverMut } = useMutation(
        ENABLE_DISABLE_DRIVER,
        () => ({
          variables: { inputModel: driver },
        })
      );
  
      const updateDriver = () => {
        driver.active = !driver.active;
        updateDriverMut()
          .then((response) => {
            emit("driver-updated");
            toast.success("Conductor actualizo exitosamente", {
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
  
      return { closeModal, updateDriver };
    },
  };
  </script>