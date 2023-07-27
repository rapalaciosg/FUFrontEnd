<template>
  <div class="space-y-5">
    <AdvancedTable
      title="Listado de compañias"
      :headers="headersCompanyTable"
      :data="companies"
      :actions="actions"
      @open-modal="toggleModal"
    >
      <template v-slot:button>
        <CreateCompanyModal
          title="Crear compañia"
          btnClass="btn-success"
          @company-created="loadCompanies()"
        />
      </template>
    </AdvancedTable>
    <DetailsCompanyModal
      title="Detalles de la compañia"
      :activeModal="isModalDetailsOpen"
      :showButton="false"
      :data="companyDetails"
      @close-modal="isModalDetailsOpen = false"
    />
    <EditCompanyModal
      title="Editar comapañia"
      :activeModal="isModalOpen"
      :showButton="false"
      :data="companyDetails"
      @close-modal="isModalOpen = false"
      @company-updated="loadCompanies()"
    />
    <DeleteCompanyModal
      title="Eliminar compañia"
      :activeModal="isModalDeleteOpen"
      :showButton="false"
      :company="companyDetails"
      @close-modal="isModalDeleteOpen = false"
      @company-deleted="loadCompanies()"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import { headersCompanyTable } from "@/constant/administration/company/constantCompany.js";
import CreateCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/CreateCompanyModal.vue";
import DetailsCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DetailsCompanyModal.vue";
import DeleteCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/DeleteCompanyModal.vue";
import EditCompanyModal from "@/components/WebFrontendComponents/Modals/Administration/Company/EditCompanyModal.vue";

import { GET_COMPANIES } from "@/services/administration/company/companyGraphql.js";
import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    CreateCompanyModal,
    DetailsCompanyModal,
    DeleteCompanyModal,
    EditCompanyModal,
  },
  data() {
    return {
      headersCompanyTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
    };
  },
  mounted() {},
  methods: {},
  setup() {
    let companyDetails = ref({});
    let isModalOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_COMPANIES));

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const loadCompanies = () => {
      queryGetCompanies.load() || queryGetCompanies.refetch()
    }

    onMounted(() => {
      loadCompanies();
    })

    const toggleModal = (value) => {
      if (value.action === "edit") isModalOpen.value = true;

      if (value.action === "details") isModalDetailsOpen.value = true;

      if (value.action === "delete") isModalDeleteOpen.value = true;

      companyDetails.value = value.row;
    };
    return {
      toggleModal,
      isModalOpen,
      companyDetails,
      isModalDetailsOpen,
      isModalDeleteOpen,
      companies,
      loadCompanies
    };
  },
};
</script>
<style></style>
