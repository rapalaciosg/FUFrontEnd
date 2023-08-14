<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput type="text" label="Nombre" placeholder="Nombre" v-model="branchOfficeName" :error="branchOfficeNameError" :maxlength="100" />
          <Textinput type="text" label="Ruc" placeholder="Ruc" v-model="ruc" :error="rucError" :maxlength="20" />
          <Textinput type="text" label="Dv" placeholder="Dv" v-model="dv" :error="dvError" :maxlength="20" />
          <Textinput type="text" label="Dirección" placeholder="Dirección" v-model="address" :error="addressError" :maxlength="200" />
          <Textinput type="text" label="Teléfono" placeholder="Teléfono" v-model="phone" :error="phoneError" :maxlength="30" />
          <Textinput type="email" label="Correo" placeholder="Correo" v-model="email" :error="emailError" :maxlength="50" />
          <VueSelect label="Provincia" :options="provincesFormatted" placeholder="Seleccione una provincia" v-model="provinceId" :clearable="false" />
          <VueSelect label="Compañias" :options="companiesFormatted" placeholder="Seleccione un tipo de compañia" v-model="companyId" :clearable="false" />
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

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import keycloak from "@/security/KeycloakService";
import moment from "moment";

import { UPDATE_BRANCH_OFFICE } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import { GET_ALL_PROVINCES } from "@/services/catalogs/provinces/provincesGraphql.js";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";

import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ["branch-office-updated", "close-modal"],
  data() {
    return {};
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const provinceId = ref({});
    let provincesFormatted = ref([]);

    const companyId = ref({});
    let companiesFormatted = ref([]);

    // Apollo queries initialization

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetProvinces = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PROVINCES));

    // Apollo fetching data from queries

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const provinces = computed(() => queryGetProvinces.result.value?.srvProvince ?? []);

    // Apollo lazy functions

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    const loadProvinces = () => queryGetProvinces.load() || queryGetProvinces.refetch();

    // Function to get and set data from props

    const setData = (props) => {
      branchOffice.branchOfficeId = props.branchOfficeId;
      branchOffice.active = props.active;
      address.value = props.address;
      branchOfficeName.value = props.branchOfficeName;
      dv.value = props.dv;
      email.value = props.email;
      phone.value = props.phone;
      ruc.value = props.ruc;
      branchOffice.createdBy = keycloak.tokenParsed.preferred_username;
      provinceId.value = props.provinceSelect;
      companyId.value = props.companySelect;
    }

    // Initialization function

    const initilize = () => {
      loadCompanies();
      loadProvinces();
      setData(props.data);
      activeModal.value = true;
    };

    // Mounted function

    onMounted(() => initilize());

    // Format functions

    const formatProvinceSelect = (data) => data.map((item) => ({ value: item.provinceId, label: item.name }));

    const formatCompanySelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    // Watchers

    watch(() => provinces.value, (newValue) => { provincesFormatted.value = formatProvinceSelect(newValue) }, { deep: true });

    watch(() => companies.value, (newValue) => { companiesFormatted.value = formatCompanySelect(newValue) }, { deep: true });

    watch(
      () => props.data,
      (newValue) => {
        branchOffice.branchOfficeId = newValue.branchOfficeId;
        branchOffice.active = newValue.active;
        address.value = newValue.address;
        branchOfficeName.value = newValue.branchOfficeName;
        dv.value = newValue.dv;
        email.value = newValue.email;
        phone.value = newValue.phone;
        ruc.value = newValue.ruc;
        branchOffice.createdBy = keycloak.tokenParsed.preferred_username;
        provinceId.value = newValue.provinceSelect;
        companyId.value = newValue.companySelect;
      },
      { deep: true }
    );

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
      active: true,
      updateBy: ""
    });

    // Yup validations rules

    const schema = yup.object({
      branchOfficeName: yup.string().required("Nombre requerido").max(100),
      ruc: yup.string().required("Ruc requerido").max(20),
      dv: yup.string().required("Dv requerido").max(20),
      address: yup.string().required("Dirección requerido").max(200),
      phone: yup.string().required("Teléfono requerido").max(30),
      email: yup.string().required("Correo requerido").email().max(50),
    });

    // Vee validate userForm

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });

    // vee validate use field

    const { value: branchOfficeName, errorMessage: branchOfficeNameError, meta: branchOfficeNameMeta } = useField("branchOfficeName");
    const { value: ruc, errorMessage: rucError, meta: rucMeta } = useField("ruc");
    const { value: dv, errorMessage: dvError, meta: dvMeta } = useField("dv");
    const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField("phone");
    const { value: email, errorMessage: emailError, meta: emailMeta } = useField("email");
    const { value: address, errorMessage: addressError, meta: addressMeta } = useField("address");

    // Apollo mutations

    const { mutate: updateBranchOffice } = useMutation(UPDATE_BRANCH_OFFICE, () => ({ variables: { inputModel: branchOffice } }));

    // Trigger function form

    const onSubmit = handleSubmit(async (values, actions) => {
      branchOffice.address = values.address;
      branchOffice.branchOfficeName = values.branchOfficeName;
      branchOffice.dv = values.dv;
      branchOffice.email = values.email;
      branchOffice.phone = values.phone;
      branchOffice.ruc = values.ruc;
      branchOffice.companyId = companyId.value.value;
      branchOffice.provinceId = provinceId.value.value;
      branchOffice.updateBy = keycloak.tokenParsed.preferred_username;

      await updateBranchOffice()
        .then((response) => {
          if (response.data.updateBranchOffice.statusCode === "OK") toast.success("Sucursal actualizada exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateBranchOffice.message, { timeout: 2000 });
          
          emit("branch-office-updated");
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
      branchOfficeName,
      branchOfficeNameError,
      ruc,
      rucError,
      dv,
      dvError,
      phone,
      phoneError,
      email,
      emailError,
      address,
      addressError,
      provinceId,
      provincesFormatted,
      companyId,
      companiesFormatted,
    };
  },
};
</script>
