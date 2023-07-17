<template>
  <div class="space-y-5">
    <Card title="Crear articulo">
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Ruta" v-model="truckId"/>
        <div class="grid grid-cols-3 gap-x-5">
          <CreateArticleModal title="Nuevo registro" btnClass="btn-success" :warehouse="truckId" />
          <download-excel class="btn-info rounded pt-2 text-center" :data="articles" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable :headers="headersInventoryTable" :data="articles" :actions="actions" @open-modal="toggleModal" />
    <EditArticleModal title="Editar registro" btnClass="btn-success" :activeModal="isModalOpen" :showButton="false" @close-modal="isModalOpen = false" :data="article" @article-edited="refresArticleList"/>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Textinput from "@/components/DashCodeComponents/Textinput";
import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import CreateArticleModal from "@/components/WebFrontendComponents/Modals/Inventory/CreateArticle/CreateArticleModal.vue";
import EditArticleModal from "@/components/WebFrontendComponents/Modals/Inventory/CreateArticle/EditArticleModal.vue";
import { headersInventoryTable } from "@/constant/inventory/createArticle/constantCreateInventory.js";

import { GET_ALL_ARTICLES_QUERY } from "@/services/inventory/createArticle/createArticleGraphql.js";
import { provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
import { apolloClient } from "../../../main.js";

export default {
  components: {
    Card,
    VueSelect,
    AdvancedTable,
    Textinput,
    CreateArticleModal,
    EditArticleModal,
  },
  data() {
    return {
      headersInventoryTable,
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML04", label: "ML04" },
        { value: "ML04", label: "ML05" },
        { value: "ML", label: "ML" },
      ],
      actions: [
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
      ],
    };
  },
  setup(props) {
    const variablesCreateArticle = reactive({ truckId: "" });

    const article = ref({});

    onMounted(() => {
      truckId.value = "ML01";
    })

    let isModalOpen = ref(false);
    const truckId = ref("");

    const queryGetArticles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_ARTICLES_QUERY, variablesCreateArticle));

    const loadGetArticles = () => {
      queryGetArticles.load() || queryGetArticles.refetch()
    }

    const refresArticleList = (value) => {
      variablesCreateArticle.truckId = value.truckId
      isModalOpen.value = false
    }

    const articles = computed(() => queryGetArticles.result.value?.srvArticulosRuta ?? []);

    watch(() => truckId, newValue => {
      variablesCreateArticle.truckId = newValue.value.value || newValue.value;
      loadGetArticles();
    }, { deep: true })

    const toggleModal = (value) => {
      if(value.action === 'edit');
        isModalOpen.value = true

      article.value = value.row;
      console.log('article => ', article.value);
    }

    return { toggleModal, isModalOpen, articles, truckId, article, refresArticleList }
  }
};
</script>
<style></style>
