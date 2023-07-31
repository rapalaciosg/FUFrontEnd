<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-5 py-6">
          <Textinput
            type="text"
            label="Nombre"
            placeholder="Nombre"
            v-model="branchOfficeName"
            :error="branchOfficeNameError"
          />
          <Textinput
            type="text"
            label="Ruc"
            placeholder="Ruc"
            v-model="ruc"
            :error="rucError"
          />
          <Textinput
            type="text"
            label="Dv"
            placeholder="Dv"
            v-model="dv"
            :error="dvError"
          />
          <Textinput
            type="text"
            label="Dirección"
            placeholder="Dirección"
            v-model="address"
            :error="addressError"
          />
          <Textinput
            type="text"
            label="Teléfono"
            placeholder="Teléfono"
            v-model="phone"
            :error="phoneError"
          />
          <Textinput
            type="email"
            label="Correo"
            placeholder="Correo"
            v-model="email"
            :error="emailError"
          />
          <VueSelect
            label="Provincia"
            :options="provincesFormatted"
            placeholder="Seleccione una provincia"
            v-model="provinceId"
            :clearable="false"
          />
          <VueSelect
            label="Compañias"
            :options="companiesFormatted"
            placeholder="Seleccione un tipo de compañia"
            v-model="companyId"
            :clearable="false"
          />
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
            Guardar
          </button>
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
import { GET_ALL_PROVINCES } from "@/services/catalogs/catalogsGraphql.js";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";
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
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ["branch-office-updated"],
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    let provincesFormatted = ref([]);
    let companiesFormatted = ref([]);

    const provinceId = ref({});
    const companyId = ref({});

    const queryGetCompanies = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_COMPANIES)
    );
    const queryGetProvinces = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_PROVINCES)
    );

    const companies = computed(
      () => queryGetCompanies.result.value?.srvCompanies ?? []
    );
    const provinces = computed(
      () => queryGetProvinces.result.value?.srvProvince ?? []
    );

    const initilize = () => {
      queryGetCompanies.load();
      queryGetProvinces.load();
    };

    onMounted(() => initilize());

    const formatProvinceSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.provinceId,
        label: item.name,
      }));
      return valueFormated;
    };

    const formatCompanySelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.companyId,
        label: item.name,
      }));
      return valueFormated;
    };

    watch(
      () => provinces.value,
      (newValue) => {
        provincesFormatted.value = formatProvinceSelect(provinces);
      },
      { deep: true }
    );

    watch(
      () => companies.value,
      (newValue) => {
        companiesFormatted.value = formatCompanySelect(companies);
      },
      { deep: true }
    );

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
        provinceId.value = findSelectValues(
          provincesFormatted,
          newValue.province.provinceId
        );
        companyId.value = findSelectValues(
          companiesFormatted,
          newValue.company.companyId
        );
      },
      { deep: true }
    );

    const findSelectValues = (data, id) => {
      const filteredValue = data.value.find((item) => item.value === id);
      return filteredValue;
    };

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
      updatedBy: ""
    });

    const schema = yup.object({
      branchOfficeName: yup.string().required("Nombre requerido"),
      ruc: yup.string().required("Ruc requerido"),
      dv: yup.string().required("Dv requerido"),
      address: yup.string().required("Dirección requerido"),
      phone: yup.string().required("Teléfono requerido"),
      email: yup.string().required("Correo requerido").email(),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema
    });

    watch(
      () => closeModal.value,
      (newValue) => {
        resetForm();
      },
      { deep: true }
    );

    const {
      value: branchOfficeName,
      errorMessage: branchOfficeNameError,
      meta: branchOfficeNameMeta,
    } = useField("branchOfficeName");
    const {
      value: ruc,
      errorMessage: rucError,
      meta: rucMeta,
    } = useField("ruc");
    const { value: dv, errorMessage: dvError, meta: dvMeta } = useField("dv");
    const {
      value: phone,
      errorMessage: phoneError,
      meta: phoneMeta,
    } = useField("phone");
    const {
      value: email,
      errorMessage: emailError,
      meta: emailMeta,
    } = useField("email");
    const {
      value: address,
      errorMessage: addressError,
      meta: addressMeta,
    } = useField("address");

    const { mutate: updateBranchOffice } = useMutation(
      UPDATE_BRANCH_OFFICE,
      () => ({
        variables: { inputModel: branchOffice },
      })
    );

    const onSubmit = handleSubmit((values, actions) => {
      branchOffice.address = values.address;
      branchOffice.branchOfficeName = values.branchOfficeName;
      branchOffice.dv = values.dv;
      branchOffice.email = values.email;
      branchOffice.phone = values.phone;
      branchOffice.ruc = values.ruc;
      branchOffice.companyId = companyId.value.value;
      branchOffice.provinceId = provinceId.value.value;
      branchOffice.updatedBy = keycloak.tokenParsed.preferred_username;

      updateBranchOffice()
        .then((response) => {
          emit("branch-office-updated");
          toast.success("Sucursal actualizada exitosamente", {
            timeout: 2000,
          });
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });

      closeModal.value = !closeModal.value;
      actions.resetForm();
    });

    return {
      closeModal,
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
      companyId,
      onSubmit,
      companiesFormatted,
      provincesFormatted,
    };
  },
};
</script>
