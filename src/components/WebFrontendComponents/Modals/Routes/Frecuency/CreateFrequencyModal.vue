<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <VueSelect label="Clientes" :options="customersFormatted" placeholder="Seleccione un cliente" v-model="customerId" :clearable="false" />
          <div class="grid grid-cols-2">
            <div>
              <label class="ltr:inline-block rtl:block input-label">Lunes</label>
              <div class="pt-2">
                <Checkbox label="Lunes" v-model="monday" />
              </div>
            </div>
            <div>
              <label class="ltr:inline-block rtl:block input-label">Sábado</label>
              <div class="pt-2">
                <Checkbox label="Sábado" v-model="saturday" />
              </div>
            </div>
          </div>
          <Textinput type="number" label="Frecuencia" placeholder="Frecuencia" v-model="frequency" :error="frequencyError" />
          <div class="grid grid-cols-2">
            <div>
              <label class="ltr:inline-block rtl:block input-label">Martes</label>
              <div class="pt-2">
                <Checkbox label="Martes" v-model="tuesday" />
              </div>
            </div>
            <div>
              <label class="ltr:inline-block rtl:block input-label">Domingo</label>
              <div class="pt-2">
                <Checkbox label="Domingo" v-model="sunday" />
              </div>
            </div>
          </div>
          <FromGroup label="Última visita">
            <flat-pickr v-model="lasstVisit" class="form-control" placeholder="Última visita" :config="config" />
          </FromGroup>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Miércoles</label>
            <div class="pt-2">
              <Checkbox label="Miércoles" v-model="wednesday" />
            </div>
          </div>
          <FromGroup label="Próxima visita">
            <flat-pickr v-model="nextVisit" class="form-control" placeholder="Próxima visita" :config="config" />
          </FromGroup>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Jueves</label>
            <div class="pt-2">
              <Checkbox label="Jueves" v-model="thursday" />
            </div>
          </div>
          <Textinput type="text" label="Observaciones" placeholder="Observaciones" v-model="observations" :error="observationsError" :maxlength="250" />
          <div>
            <label class="ltr:inline-block rtl:block input-label">Viernes</label>
            <div class="pt-2">
              <Checkbox label="Viernes" v-model="friday" />
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
import { ref, watch, reactive, computed, onMounted, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";

import ModalBase from "../../ModalBase.vue";
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import FromGroup from "@/components/DashCodeComponents/FromGroup";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import moment from 'moment';

import { CREATE_FRECUENCY } from "@/services/routes/frecuency/frecuencyGraphql.js";
import { GET_ALL_CUSTOMERS } from "@/services/clients/customers/customersGraphql";
import { GET_ALL_FREQUENCIES } from "@/services/routes/frecuency/frecuencyGraphql.js";

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
  props: {},
  emits: ["frequency-created", "close-modal"],
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

    const lasstVisit = ref("");
    const nextVisit = ref("");

    const customerId = ref({});
    let customersFormatted = ref([]);

    const config = ref({ dateFormat: 'Y-m-d' });

    // Apollo queries initialization

    const queryGetCustomers = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_CUSTOMERS));

    const queryGetFrecuencies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_FREQUENCIES));

    // Apollo fetching data from queries

    const customers = computed(() => queryGetCustomers.result.value?.srvCustomer ?? []);

    const frequencies = computed(() => queryGetFrecuencies.result.value?.srvCustomerFrequency ?? []);

    // Apollo lazy functions

    const loadCustomers = () => queryGetCustomers.load() || queryGetCustomers.refetch();

    const loadFrequencies = () => queryGetFrecuencies.load() || queryGetFrecuencies.refetch();

    // Before mounted function

    onBeforeMount(() => loadFrequencies());

    // Initialization function

    const initilize = () => {
      activeModal.value = true;
      lasstVisit.value = moment().format('YYYY-MM-DD');
      nextVisit.value = moment().format('YYYY-MM-DD');
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatCustomerSelect = (data) => data.map((item) => ({ value: item.customerId, label: `${item.name} ${item.lastName}` }));

    // Watchers

    watch(() => frequencies.value, (newValue) => { loadCustomers() }, { deep: true });

    watch(
      () => customers.value,
      (newValue) => {
        const availables = newValue.filter(object1 => {
          return !frequencies.value.some(object2 => {
            return object1.customerId === object2.customer.customerId;
          });
        });
        customersFormatted.value = formatCustomerSelect(availables);
        customerId.value = customersFormatted.value[0];
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      observations: "",
      frecuency: 0,
    });

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
      sunday: false
    });

    // Yup validations rules

    const schema = yup.object({
      frecuency: yup.number().required("Frecuencia requerida"),
      observations: yup.string().required("Observación requerida").max(250),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // Vee validate userField

    const { value: frequency, errorMessage: frequencyError, meta: frequencyMeta } = useField("frequency");
    const { value: observations, errorMessage: observationsError, meta: observationsMeta } = useField("observations");

    // Apollo mutations

    const { mutate: createFrecuency } = useMutation(CREATE_FRECUENCY, () => ({ variables: { inputModel: frequencyObject } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      console.log('entro');
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

      await createFrecuency()
        .then((response) => {
          if (response.data.createCustomerFrequency.statusCode === "OK") toast.success("Frecuencia creada exitosamente", { timeout: 2000 });
          else toast.error(response.data.createCustomerFrequency.message, { timeout: 2000 });

          emit("frequency-created");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))

      closeModal();
      actions.resetForm();
    });

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      onSubmit,
      closeModal,
      activeModal,
      config,
      frequency,
      frequencyError,
      observations,
      observationsError,
      lasstVisit,
      nextVisit,
      customerId,
      customersFormatted,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    };
  },
};
</script>
