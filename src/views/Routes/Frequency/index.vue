<template>
  <div class="space-y-5">
    <Card title="Frequencia">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Ruta o Camión" v-model="route" />
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="frecuencies" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <!-- <AdvancedTable :headers="headersFrecuencyTable" :data="frecuencies" :actions="actions" @open-modal="toggleModal" />
    <EditFrecuencyModal title="Crear registro de frecuencia" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" :data="frecuency" @frecuency-edited="refreshFrecuenciesList" /> -->
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import EditFrecuencyModal from "@/components/WebFrontendComponents/Modals/Routes/Frecuency/EditFrecuencyModal.vue";
import { headersFrecuencyTable } from "@/constant/routes/frecuency/constantFrecuency.js";

import { GET_FRECUENCIAS } from "@/services/routes/frecuency/frecuencyGraphql.js";
import { useQuery, provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    Card,
    VueSelect,
    Button,
    AdvancedTable,
    EditFrecuencyModal
  },
  data() {
    return {
      headersFrecuencyTable,
      options: [
      { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML04", label: "ML04" },
        { value: "ML05", label: "ML05" },
        { value: "ML", label: "ML" },
      ],
      actions: [
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
      ],
    };
  },
  setup() {
    const variablesFrecuency = reactive({ route: "" });

    let frecuency = ref({});

    let isModalOpen = ref(false);
    const route = ref("");

    const queryGetFrecuencies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_FRECUENCIAS, variablesFrecuency));

    const frecuencies = computed(() => queryGetFrecuencies.result.value?.srvFrecuenciaRuta ?? []);

    watch(() => route, newValue => {
      variablesFrecuency.route = newValue.value.value || newValue
      loadFrecuencies();
    }, { deep: true })

    const loadFrecuencies = () => {
      queryGetFrecuencies.load() || queryGetFrecuencies.refetch()
    }

    const refreshFrecuenciesList = (value) => {
      route.value = value.route
      isModalOpen.value = false
    }

    const toggleModal = (value) => {
      if(value.action === 'edit')
        isModalOpen.value = true

      frecuency.value = value.row;
    }

    return { 
      frecuencies,
      frecuency,
      toggleModal,
      route,
      isModalOpen,
      refreshFrecuenciesList
    };
  }
};
</script>
<style></style>