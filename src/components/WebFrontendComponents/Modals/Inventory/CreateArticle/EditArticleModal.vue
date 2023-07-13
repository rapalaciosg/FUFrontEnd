<template>
  <modal-base @save="editArticle()" :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput
          name="pn"
          type="text"
          label="Artículo"
          placeholder="Artículo"
          v-model="article.articulo"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Línea"
          placeholder="Línea"
          v-model="article.linea"
          :error="errorFields.linea"
        />
        <Textinput
          name="pn"
          type="text"
          label="Primera descripción"
          placeholder="Primera descripción"
          v-model="article.descripcion1"
          :error="errorFields.descripcion1"
        />
        <Textinput
          name="pn"
          type="text"
          label="Fabircante"
          placeholder="Fabircante"
          v-model="article.fabricante"
          :error="errorFields.fabricante"
        />
        <Textinput
          name="pn"
          type="text"
          label="Segunda descripción"
          placeholder="Segunda descripción"
          v-model="article.descripcion2"
          :error="errorFields.descripcion2"
        />
        <Textinput
          name="pn"
          type="number"
          label="Impuesto"
          placeholder="Impuesto"
          v-model="article.impuesto1"
          :error="errorFields.impuesto1"
        />
        <Textinput
          name="pn"
          type="text"
          label="Nombre"
          placeholder="Nombre"
          v-model="article.nombreCorto"
          :error="errorFields.nombreCorto"
        />
        <VueSelect
          :options="statusList"
          label="Estado"
          placeholder="Estado"
          v-model="status"
          :error="errorFields.estatus"
        />
        <Textinput
          name="pn"
          type="text"
          label="Grupo"
          placeholder="Grupo"
          v-model="article.grupo"
          :error="errorFields.grupo"
        />
        <Textinput
          name="pn"
          type="number"
          label="Existencia"
          placeholder="Existencia"
          v-model="article.existencia"
          :error="errorFields.existencia"
        />
        <Textinput
          name="pn"
          type="text"
          label="Categoría"
          placeholder="Categoría"
          v-model="article.categoria"
          :error="errorFields.categoria"
        />
        <Textinput
          name="pn"
          type="text"
          label="Almacén"
          placeholder="Almacén"
          v-model="article.almacen"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Familia"
          placeholder="Familia"
          v-model="article.familia"
          :error="errorFields.familia"
        />
        <Textinput
          name="pn"
          type="number"
          label="Price"
          placeholder="Price"
          v-model="article.price"
          :error="errorFields.price"
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

import { UPDATE_ARTICLE } from "@/services/inventory/createArticle/createArticleGraphql.js";
import { provideApolloClient, useLazyQuery, useMutation } from "@vue/apollo-composable";
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
    },
    warehouseValue: {
      type: String,
      default: ""
    }
  },
  emits: ['article-edited'],
  data() {
    return {
      statusList: [
        { value: "ALTA", label: "ALTA" },
        { value: "BAJA", label: "BAJA" },
      ],
    };
  },
  setup(props, {emit}) {
    let closeModal = ref(false);
    let status = ref("");

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

    const errorFields = reactive({
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
      price: ""
    });

    watch(() => props.data, (value) => {
      console.log('value => ', value);
      Object.keys(article).forEach(item => article[item] = value[item] || "");
      status.value = value.estatus
      article.almacen = props.warehouseValue
    })

    const editArticle = () => {
      if (article.descripcion1 === "") {
        errorFields.descripcion1 = "Este campo es requerido."
        setTimeout(() => {
          errorFields.descripcion1 = ""
        }, 3000);
      }
      if (article.linea === "") {
        errorFields.linea = "Este campo es requerido."
        setTimeout(() => {
          errorFields.linea = ""
        }, 3000);
      }
      if (article.fabricante === "") {
        errorFields.fabricante = "Este campo es requerido."
        setTimeout(() => {
          errorFields.fabricante = ""
        }, 3000);
      }
      if (article.descripcion2 === "") {
        errorFields.descripcion2 = "Este campo es requerido."
        setTimeout(() => {
          errorFields.descripcion2 = ""
        }, 3000);
      }
      if (article.impuesto1 === "") {
        errorFields.impuesto1 = "Este campo es requerido."
        setTimeout(() => {
          errorFields.impuesto1 = ""
        }, 3000);
      }
      if (article.nombreCorto === "") {
        errorFields.nombreCorto = "Este campo es requerido."
        setTimeout(() => {
          errorFields.nombreCorto = ""
        }, 3000);
      }
      if (status.value == "") {
        errorFields.estatus = "Este campo es requerido."
        setTimeout(() => {
          errorFields.estatus = ""
        }, 3000);
      }
      if (article.grupo === "") {
        errorFields.grupo = "Este campo es requerido."
        setTimeout(() => {
          errorFields.grupo = ""
        }, 3000);
      }
      if (article.existencia === "") {
        errorFields.existencia = "Este campo es requerido."
        setTimeout(() => {
          errorFields.existencia = ""
        }, 3000);
      }
      if (article.categoria === "") {
        errorFields.categoria = "Este campo es requerido."
        setTimeout(() => {
          errorFields.categoria = ""
        }, 3000);
      }
      if (article.familia === "") {
        errorFields.familia = "Este campo es requerido."
        setTimeout(() => {
          errorFields.familia = ""
        }, 3000);
      }
      if (article.price === "") {
        errorFields.price = "Este campo es requerido."
        setTimeout(() => {
          errorFields.price = ""
        }, 3000);
      } else {
        article.estatus = status.value.value
        article.impuesto1 = parseFloat(article.impuesto1)
        article.existencia = parseFloat(article.existencia)
        article.price = parseFloat(article.price)
        console.log("Articulo creado => ", article);
        updateArticleMut()
          .then((response) => {
            console.log('response => ', response.data.updaterArticle.message);
            // if (response.data.updaterArticle.message === '0') {
            //   toast.success("Precio especial creado exitosamente", {
            //     timeout: 2000,
            //   });
            // } else {
            //   toast.error("Ha ocurrido un error", {
            //     timeout: 2000,
            //   });
            // }
          })
        emit('article-edited', { truckId: article.almacen })
        closeModal.value = true
      }
    };

    const { mutate: updateArticleMut } = useMutation(UPDATE_ARTICLE, () => ({ variables: { entityArticle: article } }));

    return { article, editArticle, closeModal, status, errorFields };
  },
};
</script>
