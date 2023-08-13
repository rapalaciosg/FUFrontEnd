<template>
    <modal-base :activeModal="activeModal">
      <template v-slot:modal-body>
        <form @submit.prevent="updateDriver">
          <div class="grid grid-cols-1 gap-5">
            <h5>¿{{ action }} este conductor: {{ driver.name }}?</h5>
          </div>
          <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
            <button class="btn btn-secondary block text-center" @click="closeModalFunction">Cerrar</button>
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
    emits: ["driver-updated", "close-modal"],
    data() {
      return {};
    },
    setup(props, { emit }) {

      // Variables declaration

      const toast = useToast();
  
      const activeModal = ref(false);

      // Input model

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

      // Function to get and set data from props

      const setData = (props) => {
        driver.driverId = props.driverId;
        driver.branchOfficeId = props.branchOffice.branchOfficeId;
        driver.name = props.name;
        driver.lastName = props.lastName;
        driver.code = props.code;
        driver.boxCode = props.boxCode;
        driver.active = props.active
        driver.keycloakUserId = props.keycloakUserId;
        driver.keycloakUser = props.keycloakUser;
      }

      // Mounted function

      onMounted(() => {
        activeModal.value = true;
        setData(props.driver);
      })

      // Watchers
  
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

      // Apollo mutations
  
      const { mutate: updateDriverMut } = useMutation( ENABLE_DISABLE_DRIVER, () => ({ variables: { inputModel: driver } }));

      // Trigger function form
  
      const updateDriver = async () => {
        driver.active = !driver.active;

        await updateDriverMut()
          .then((response) => {
            if (response.data.updateDrive.statusCode === 'OK') toast.success("Conductor actualizo exitosamente", { timeout: 2000 });
            else toast.success(response.data.updateDrive.message, { timeout: 2000 });

            emit("driver-updated");
          })
          .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
          
        closeModal();
      };

      // Close modal function

      const closeModal = () => emit('close-modal');

      // Returning values
  
      return { activeModal, updateDriver, closeModal };
    },
  };
  </script>