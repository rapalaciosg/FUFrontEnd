<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Id del dispositivo" placeholder="Id del dispositivo" v-model="deviceId" :error="deviceIdError" :maxlength="50"/>
          <Textinput type="text" label="dPtoFacDF" placeholder="dPtoFacDF" v-model="dPtoFacDF" :error="dPtoFacDFError" :maxlength="3"/>
          <Textinput type="text" label="Prefijo de factura" placeholder="Prefijo de factura" v-model="invoicePrefix" :error="invoicePrefixError" :maxlength="200"/>
          <Textinput type="text" label="Prefijo de crédito" placeholder="Prefijo de crédito" v-model="creditPrefix" :error="creditPrefixError" :maxlength="10"/>
          <Textinput type="text" label="Impresor" placeholder="Impresor" v-model="printer" :error="printerError" :maxlength="10"/>
          <VueSelect label="Sucursal" :options="branchOfficesFormatted" placeholder="Seleccione una sucursal" v-model="branchOfficeId" :clearable="false"/>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Factura en línea</label>
            <div class="pt-2">
              <Checkbox label="Factura en línea" v-model="invoiceOnline" />
            </div>
          </div>
          <div>
            <label class="ltr:inline-block rtl:block input-label">Transporte</label>
            <div class="pt-2">
              <Checkbox label="Transporte" v-model="freight" />
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

import keycloak from "@/security/KeycloakService.js";
import moment from 'moment';

import { CREATE_POS } from "@/services/administration/devices/deviceGraphql.js";
import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";

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
  props: {},
  emits: ["pos-created", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const invoiceOnline = ref(false);
    const freight = ref(false);

    const branchOfficeId = ref({});
    let branchOfficesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_BRANCH_OFFICES));

    // Apollo fetching data from queries

    const branchOffices = computed(() => queryGetBranchOffices.result.value?.srvBranchOffice ?? []);

    // Apollo lazy functions

    const loadBranchOffices = () => queryGetBranchOffices.load() || queryGetBranchOffices.refetch();

    // Initialization function

    const initilize = () => {
      loadBranchOffices();
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatbranchOfficeSelect = (data) => data.map((item) => ({ value: item.branchOfficeId, label: item.branchOfficeName}));

    // Watchers

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(newValue);
        branchOfficeId.value = branchOfficesFormatted.value[0];
      },
      { deep: true }
    );

    // Initial values

    const formValues = reactive({
      deviceId: "",
      dPtoFacDF: "",
      invoicePrefix: "",
      creditPrefix: "",
      printer: "",
    });

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
      active: true,
      createdDate: ""
    });

    // Yup validations rules

    const schema = yup.object({
      deviceId: yup.string().required("Id del dispositivo requerido").max(50),
      dPtoFacDF: yup.string().required("dPtoFacDF requerido").max(3),
      invoicePrefix: yup.string().required("Prefijo de la factura requerido").max(10),
      creditPrefix: yup.string().required("Prefijo de crédito requerido").max(10),
      printer: yup.string().required("Impresor requerido").max(10),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema, initialValues: formValues });

    // vee validate use field

    const { value: deviceId, errorMessage: deviceIdError, meta: deviceIdMeta } = useField("deviceId");
    const { value: dPtoFacDF, errorMessage: dPtoFacDFError, meta: dPtoFacDFMeta } = useField("dPtoFacDF");
    const { value: invoicePrefix, errorMessage: invoicePrefixError, meta: invoicePrefixMeta } = useField("invoicePrefix");
    const { value: creditPrefix, errorMessage: creditPrefixError, meta: creditPrefixMeta } = useField("creditPrefix");
    const { value: printer, errorMessage: printerError, meta: printerMeta } = useField("printer");

    // Apollo mutations

    const { mutate: createPos } = useMutation(CREATE_POS, () => ({ variables: { inputModel: pos }}));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      pos.deviceId = values.deviceId;
      pos.dPtoFacDF = values.dPtoFacDF;
      pos.invoicePrefix = values.invoicePrefix.toUpperCase();
      pos.creditPrefix = values.creditPrefix.toUpperCase();
      pos.printer = values.printer;
      pos.branchOfficeId = branchOfficeId.value.value;
      pos.invoiceOnline = invoiceOnline.value;
      pos.freight = freight.value;
      pos.createdBy = keycloak.tokenParsed.preferred_username;
      pos.createdDate = moment();

      await createPos()
        .then((response) => {
          if (response.data.createPos.statusCode === "OK") toast.success("Dispositivo creado exitosamente", { timeout: 2000 });
          else toast.error(response.data.createPos.message, { timeout: 2000 });

          emit("pos-created");
        })
        .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }));

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
      deviceId,
      deviceIdError,
      dPtoFacDF,
      dPtoFacDFError,
      invoicePrefix,
      invoicePrefixError,
      creditPrefix,
      creditPrefixError,
      printer,
      printerError,
      invoiceOnline,
      freight,
      branchOfficesFormatted,
      branchOfficeId,
    };
  },
};
</script>
