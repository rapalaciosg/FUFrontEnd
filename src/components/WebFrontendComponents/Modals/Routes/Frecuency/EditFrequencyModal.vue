<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect label="Clientes" :options="customersFormatted" placeholder="Seleccione un cliente" v-model="customerId" :clearable="false" disabled />
          <div class="grid grid-cols-2">
            <div>
              <label class="ltr:inline-block rtl:block input-label">Lunes</label>
              <div class="pt-2">
                <Checkbox label="Lunes" v-model="monday" :checked="defaultMondayValue" />
              </div>
            </div>
            <div>
              <label class="ltr:inline-block rtl:block input-label">Sábado</label>
              <div class="pt-2">
                <Checkbox label="Sábado" v-model="saturday" :checked="defaultSaturdayValue" />
              </div>
            </div>
          </div>
          <Textinput type="number" label="Frecuencia" placeholder="Frecuencia" v-model="frequency" :error="frequencyError" />
          <div class="grid grid-cols-2">
            <div>
              <label class="ltr:inline-block rtl:block input-label">Martes</label>
              <div class="pt-2">
                <Checkbox label="Martes" v-model="tuesday" :checked="defaultTuesdayValue" />
              </div>
            </div>
            <div>
              <label class="ltr:inline-block rtl:block input-label">Domingo</label>
              <div class="pt-2">
                <Checkbox label="Domingo" v-model="sunday" :checked="defaultSundayValue" />
              </div>
            </div>
          </div>
          <FromGroup label="Última visita">
            <flat-pickr v-model="lasstVisit" class="form-control" placeholder="Última visita" :config="config" />
          </FromGroup>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Miércoles</label>
            <div class="pt-2">
              <Checkbox label="Miércoles" v-model="wednesday" :checked="defaultWednesdayValue" />
            </div>
          </div>
          <FromGroup label="Próxima visita">
            <flat-pickr v-model="nextVisit" class="form-control" placeholder="Próxima visita" :config="config" />
          </FromGroup>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Jueves</label>
            <div class="pt-2">
              <Checkbox label="Jueves" v-model="thursday" :checked="defaultThursdayValue" />
            </div>
          </div>
          <Textinput type="text" label="Observaciones" placeholder="Observaciones" v-model="observations" :error="observationsError" :maxlength="250" />
          <div>
            <label class="ltr:inline-block rtl:block input-label">Viernes</label>
            <div class="pt-2">
              <Checkbox label="Viernes" v-model="friday" :checked="defaultFridayValue" />
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
import FromGroup from "@/components/DashCodeComponents/FromGroup";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import moment from "moment";

import { UPDATE_FREQUENCY } from "@/services/routes/frecuency/frecuencyGraphql.js";
import { GET_ALL_CUSTOMERS } from "@/services/clients/customers/customersGraphql";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
    FromGroup,
    Checkbox,
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ["frequency-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration
    const toast = useToast();

    const activeModal = ref(false);

    const monday = ref(false);
    const tuesday = ref(false);
    const wednesday = ref(false);
    const thursday = ref(false);
    const friday = ref(false);
    const saturday = ref(false);
    const sunday = ref(false);

    let defaultMondayValue = ref(false);
    let defaultTuesdayValue = ref(false);
    let defaultWednesdayValue = ref(false);
    let defaultThursdayValue = ref(false);
    let defaultFridayValue = ref(false);
    let defaultSaturdayValue = ref(false);
    let defaultSundayValue = ref(false);

    const lasstVisit = ref("");
    const nextVisit = ref("");

    const customerId = ref({});
    let customersFormatted = ref([]);

    const config = ref({ dateFormat: 'Y-m-d' });

    // Apollo queries initialization

    const queryGetCustomers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CUSTOMERS));

    // Apollo fetching data from queries

    const customers = computed(() => queryGetCustomers.result.value?.srvCustomer ?? []);

    // Apollo lazy functions

    const loadCustomers = () => queryGetCustomers.load() || queryGetCustomers.refetch();

     // Function to get and set data from props

     const setData = (props) => {
      frequencyObject.customerFrequencyId = props.customerFrequencyId;
      observations.value = props.observations;
      frequency.value = props.frequency;
      lasstVisit.value = props.lasstVisit;
      nextVisit.value = props.nextVisit;
      customerId.value = props.customerSelect;
      monday.value = props.monday;
      tuesday.value = props.tuesday;
      wednesday.value = props.wednesday;
      thursday.value = props.thursday;
      friday.value = props.friday;
      saturday.value = props.saturday;
      sunday.value = props.sunday;

      if (monday.value  === true) defaultMondayValue.value = true;
      else defaultMondayValue.value = false;

      if (tuesday.value  === true) defaultTuesdayValue.value = true;
      else defaultTuesdayValue.value = false;

      if (wednesday.value  === true) defaultWednesdayValue.value = true;
      else defaultWednesdayValue.value = false;

      if (thursday.value  === true) defaultThursdayValue.value = true;
      else defaultThursdayValue.value = false;

      if (friday.value  === true) defaultFridayValue.value = true;
      else defaultFridayValue.value = false;

      if (saturday.value  === true) defaultSaturdayValue.value = true;
      else defaultSaturdayValue.value = false;

      if (sunday.value  === true) defaultSundayValue.value = true;
      else defaultSundayValue.value = false;
    }

    // Initialization function

    const initilize = () => {
      loadCustomers();
      setData(props.data);
      activeModal.value = true;
      lasstVisit.value = moment().format('YYYY-MM-DD');
      nextVisit.value = moment().format('YYYY-MM-DD');
    };

    // Mounted functions

    onMounted(() => initilize());

    // Format functions

    const formatCustomerSelect = (data) => data.map((item) => ({ value: item.customerId, label: `${item.name} ${item.lastName}` }));

    // Watchers

    watch(() => customers.value, (newValue) => { customersFormatted.value = formatCustomerSelect(newValue) }, { deep: true });

    watch(
      () => props.data,
      (newValue) => {
        frequencyObject.customerFrequencyId = newValue.customerFrequencyId;
        observations.value = newValue.observations;
        frequency.value = newValue.frequency;
        lasstVisit.value = newValue.lasstVisit;
        nextVisit.value = newValue.nextVisit;
        customerId.value = newValue.customerSelect;
        monday.value = newValue.monday;
        tuesday.value = newValue.tuesday;
        wednesday.value = newValue.wednesday;
        thursday.value = newValue.thursday;
        friday.value = newValue.friday;
        saturday.value = newValue.saturday;
        sunday.value = newValue.sunday;

        if (monday.value  === true) defaultMondayValue.value = true;
        else defaultMondayValue.value = false;

        if (tuesday.value  === true) defaultTuesdayValue.value = true;
        else defaultTuesdayValue.value = false;

        if (wednesday.value  === true) defaultWednesdayValue.value = true;
        else defaultWednesdayValue.value = false;

        if (thursday.value  === true) defaultThursdayValue.value = true;
        else defaultThursdayValue.value = false;

        if (friday.value  === true) defaultFridayValue.value = true;
        else defaultFridayValue.value = false;

        if (saturday.value  === true) defaultSaturdayValue.value = true;
        else defaultSaturdayValue.value = false;

        if (sunday.value  === true) defaultSundayValue.value = true;
        else defaultSundayValue.value = false;
      },
      { deep: true }
    );

    // Input model

    const frequencyObject = reactive({
      customerFrequencyId: 0,
      customerId: 0,
      frequency: 0,
      nextVisit: "",
      lasstVisit: "",
      observations: "",
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });

    // Yup validations rules

    const schema = yup.object({
      frequency: yup.number().required("Frecuencia requerida"),
      observations: yup.string().required("Observación requerida").max(250),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    // Vee validate userField

    const { value: frequency, errorMessage: frequencyError, meta: frequencyMeta } = useField("frequency");
    const { value: observations, errorMessage: observationsError, meta: observationsMeta } = useField("observations");

    // Apollo mutations

    const { mutate: updateFrequency } = useMutation(UPDATE_FREQUENCY, () => ({ variables: { inputModel: frequencyObject } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      frequencyObject.frequency = +values.frequency;
      frequencyObject.observations = values.observations;
      frequencyObject.customerId = customerId.value.value;
      frequencyObject.lasstVisit = lasstVisit.value;
      frequencyObject.nextVisit = nextVisit.value;
      frequencyObject.monday = monday.value;
      frequencyObject.tuesday = tuesday.value;
      frequencyObject.wednesday = wednesday.value;
      frequencyObject.thursday = thursday.value;
      frequencyObject.friday = friday.value;
      frequencyObject.saturday = saturday.value;
      frequencyObject.sunday = sunday.value;

      await updateFrequency()
        .then((response) => {
          if (response.data.updateCustomerFrequency.statusCode === "OK") toast.success("Frecuencia actualizada exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateCustomerFrequency.message, { timeout: 2000 });

          emit("frequency-updated");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      closeModal,
      onSubmit,
      activeModal,
      config,
      frequency,
      frequencyError,
      observations,
      observationsError,
      customerId,
      customersFormatted,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      defaultMondayValue,
      defaultTuesdayValue,
      defaultWednesdayValue,
      defaultThursdayValue,
      defaultFridayValue,
      defaultSaturdayValue,
      defaultSundayValue,
      lasstVisit,
      nextVisit,
    };
  },
};
</script>
