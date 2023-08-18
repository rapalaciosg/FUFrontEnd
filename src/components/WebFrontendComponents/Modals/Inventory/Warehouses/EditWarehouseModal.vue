<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre de la bodega" placeholder="Nombre de la bodega" v-model="name" :error="nameError" :maxlength="50"/>
          <Textinput type="text" label="Código" placeholder="Código" v-model="code" :error="codeError" :maxlength="10"/>
          <VueSelect label="Vehículo" :options="vehiclesFormatted" placeholder="Seleccione un vehículo" v-model="vehicleId" :clearable="false"/>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Primaria</label>
            <div class="pt-2">
              <Checkbox label="Primaria" v-model="isPrimary" :checked="defaultValue" />
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cerrar</button>
          <button type="submit" class="btn btn-success block text-center">Guardar</button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, reactive, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Checkbox from "@/components/DashCodeComponents/Checkbox";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { UPDATE_WAREHOUSE, GET_ALL_WAREHOUSES } from "@/services/inventory/warehouses/warehousesGraphql.js";
import { GET_ALL_VEHICLES } from "@/services/administration/vehicle/vehicleGraphql.js";

import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
    Checkbox,
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ["warehouse-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const isPrimary = ref(false);
    const defaultValue = ref(false);

    const vehicleId = ref({});
    let vehiclesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetWarehouses = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_WAREHOUSES));

    const queryGetVehicles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_VEHICLES));

    // Apollo fetching data from queries

    const warehouses = computed(() => queryGetWarehouses.result.value?.srvWarehouse ?? []);

    const vehicles = computed(() => queryGetVehicles.result.value?.srvVehicle ?? []);

    // Apollo lazy functions

    const loadWarehouses = () => queryGetWarehouses.load() || queryGetWarehouses.refetch();

    const loadVehicles = () => queryGetVehicles.load() || queryGetVehicles.refetch();

    // Function to get and set data from props

    const setData = (props) => {
      warehouse.warehouseId = props.warehouseId;
        name.value = props.name;
        code.value = props.code;
        isPrimary.value = props.isPrimary;
        if (isPrimary.value) defaultValue.value = true
        else defaultValue.value = false
        vehicleId.value = props.vehicleSelect;
    }

    // Initialization function

    const initilize = () => {
      loadWarehouses();
      loadVehicles();
      setData(props.data);
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatVehiclesSelect = (data) => data.map((item) => ({ value: item.vehicleId, label: item.code }));

    // Watchers

    watch(
      () => vehicles.value,
      (newValue) => {
        const differentValues = newValue.filter((object1) => {
          return !warehouses.value.some((object2) => {
            return object1.vehicleId === object2.vehicle.vehicleId;
          });
        });
        vehiclesFormatted.value = formatVehiclesSelect(differentValues);
        vehicleId.value = vehiclesFormatted.value[0];
      },
      { deep: true }
    );

    watch(
      () => props.data,
      (newValue) => {
        warehouse.warehouseId = newValue.warehouseId;
        name.value = newValue.name;
        code.value = newValue.code;
        isPrimary.value = newValue.isPrimary;
        if (isPrimary.value) defaultValue.value = true
        else defaultValue.value = false
        vehicleId.value = newValue.vehicleSelect;
      },
      { deep: true }
    );

    // Input model

    const warehouse = reactive({
      warehouseId: 0,
      name: "",
      code: "",
      isPrimary: false,
      vehicleId: 0,
    });

    // Yup validations rules

    const schema = yup.object({
      name: yup.string().required("Nombre requerido").max(50),
      code: yup.string().required("Código requerido").max(10),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    // vee validate use field

    const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
    const { value: code, errorMessage: codeError, meta: codeMeta } = useField("code");

    // Apollo mutations

    const { mutate: updateWarehouse } = useMutation(UPDATE_WAREHOUSE, () => ({ variables: { inputModel: warehouse } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      warehouse.name = values.name;
      warehouse.code = values.code.toUpperCase();
      warehouse.vehicleId = vehicleId.value.value;
      warehouse.isPrimary = isPrimary.value;

      await updateWarehouse()
        .then((response) => {
          if (response.data.updateWarehouse.statusCode === "OK") toast.success("Bodega actualizada exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateWarehouse.message, { timeout: 2000 });

          emit("warehouse-updated");
        })
        .catch((error) =>
          toast.error("Ha ocurrido un error", { timeout: 2000 })
        );

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return {
      closeModal,
      onSubmit,
      activeModal,
      name,
      nameError,
      code,
      codeError,
      isPrimary,
      defaultValue,
      vehicleId,
      vehiclesFormatted,
    };
  },
};
</script>
