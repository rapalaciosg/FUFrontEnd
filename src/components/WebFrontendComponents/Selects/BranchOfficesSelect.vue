<template>
  <VueSelect
    label="Sucursal"
    :options="branchOfficesFormatted"
    placeholder="Seleccione una sucursal"
    :modelValue="modelValue"
    :clearable="clearable"
  />
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { GET_ALL_BRANCH_OFFICES } from "@/services/administration/branchOffice/branchOfficeGraphql.js";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";
export default {
  components: {
    VueSelect,
  },
  props: {
    modelValue: {
      type: [String, Object]
    },
    clearable: {
      type: Boolean,
      default: false
    },
    hasDefaultValue: {
      type: String,
      default: ""
    }
  },
  setup(props, {emit}) {
    let branchOfficesFormatted = ref([]);
    let inModelValue = ref(props.modelValue);

    const queryGetBranchOffices = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_ALL_BRANCH_OFFICES)
    );

    const branchOffices = computed(
      () => queryGetBranchOffices.result.value?.srvBranchOffice ?? []
    );

    const loadBranchOffices = () => {
      queryGetBranchOffices.load() || queryGetBranchOffices.refetch();
    };

    onMounted(() => loadBranchOffices());

    const formatbranchOfficeSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.branchOfficeId,
        label: item.branchOfficeName,
      }));
      return valueFormated;
    };

    watch(
      () => branchOffices.value,
      (newValue) => {
        branchOfficesFormatted.value = formatbranchOfficeSelect(branchOffices);
      },
      { deep: true }
    );

    return { branchOfficesFormatted, inModelValue };
  },
};
</script>
