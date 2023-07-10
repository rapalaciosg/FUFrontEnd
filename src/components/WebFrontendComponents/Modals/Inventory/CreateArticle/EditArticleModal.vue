<template>
  <modal-base @save="createArticle()">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput
          name="pn"
          type="text"
          label="Artículo"
          placeholder="Artículo"
          v-model="article.articulo"
        />
        <Textinput
          name="pn"
          type="text"
          label="Línea"
          placeholder="Línea"
          v-model="article.linea"
        />
        <Textinput
          name="pn"
          type="text"
          label="Primera descripción"
          placeholder="Primera descripción"
          v-model="article.descripcion1"
        />
        <Textinput
          name="pn"
          type="text"
          label="Fabircante"
          placeholder="Fabircante"
          v-model="article.fabricante"
        />
        <Textinput
          name="pn"
          type="text"
          label="Segunda descripción"
          placeholder="Segunda descripción"
          v-model="article.descripcion2"
        />
        <Textinput
          name="pn"
          type="text"
          label="Impuesto"
          placeholder="Impuesto"
          v-model="article.impuesto1"
        />
        <Textinput
          name="pn"
          type="text"
          label="Nombre"
          placeholder="Nombre"
          v-model="article.nombreCorto"
        />
        <VueSelect
          :options="status"
          label="Estado"
          placeholder="Estado"
          v-model="article.estatus"
        />
        <Textinput
          name="pn"
          type="text"
          label="Grupo"
          placeholder="Grupo"
          v-model="article.grupo"
        />
        <Textinput
          name="pn"
          type="text"
          label="Existencia"
          placeholder="Existencia"
          v-model="article.existencia"
        />
        <Textinput
          name="pn"
          type="text"
          label="Categoría"
          placeholder="Categoría"
          v-model="article.categoria"
        />
        <Textinput
          name="pn"
          type="text"
          label="Almacén"
          placeholder="Almacén"
          v-model="article.almacen"
        />
        <Textinput
          name="pn"
          type="text"
          label="Familia"
          placeholder="Familia"
          v-model="article.familia"
        />
        <Textinput
          name="pn"
          type="text"
          label="Price"
          placeholder="Price"
          v-model="article.price"
        />
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import {
  GET_COMPANIES_QUERY,
  GET_ALL_ARTICLES,
} from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    VueSelect,
  },
  data() {
    return {
      status: [
        { value: "ALTA", label: "ALTA" },
        { value: "BAJA", label: "BAJA" },
      ],
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML03", label: "ML04" },
        { value: "ML03", label: "ML05" },
        { value: "ML03", label: "ML" },
      ],
    };
  },
  setup(props) {
    const article = reactive({
      articulo: "",
      descripcion1: "",
      descripcion2: "",
      nombreCorto: "",
      grupo: "",
      categoria: "",
      familia: "",
      linea: "",
      fabricante: "",
      impuesto1: "",
      estatus: "",
      existencia: "",
      almacen: "",
      price: "",
    });

    const createArticle = () => {
      console.log("Articulo creado => ", article);
    };

    return { article, createArticle };
  },
};
</script>
