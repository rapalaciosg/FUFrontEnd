<template>
  <h1>Create inventory</h1>
</template>

<script></script>
<!-- <template>
  <modal-base @save="createTransfer()" :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <VueSelect :options="routes" label="Ruta origen" placeholder="Ruta origen" v-model="route" :error="errorFields.Emisor" />
        <FromGroup name="d1" label="Fecha" :error="errorFields.Fecha">
          <flat-pickr
          v-model="inventoryTransfer.Fecha"
            class="form-control"
            id="d1"
            placeholder="Fecha"
            :config="config"
          />
        </FromGroup>
        <VueSelect :options="routesReceptor" label="Ruta destino" placeholder="Ruta destino" v-model="inventoryTransfer.Receptor" :error="errorFields.Receptor" />
        <VueSelect :options="articlesFormatted" label="Artículo" placeholder="Artículo" v-model="inventoryTransfer.Articulo" :error="errorFields.Articulo" />
        <Textinput name="pn" type="number" label="Cantidad" placeholder="Cantidad" v-model="inventoryTransfer.Cantidad" :error="errorFields.Cantidad" />
        <Textinput name="pn" type="text" label="Observación" placeholder="Observación" v-model="inventoryTransfer.Descripcion" :error="errorFields.Descripcion" />
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted, defineEmits } from "vue";
import ModalBase from "../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { useToast } from "vue-toastification";

import { GET_COMPANIES_QUERY, GET_ALL_ARTICLES, CREATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
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
    FromGroup,
    VueSelect,
  },
  props: [],
  emits: ["transfer-created"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const variablesArticles = reactive({ truckId: "" });

    const toast = useToast();

    let closeModal = ref(false);

    let articlesFormatted = ref([]);
    let route = ref("");

    const routes = reactive([
      { value: "ML01", label: "ML01" },
      { value: "ML02", label: "ML02" },
      { value: "ML03", label: "ML03" },
      { value: "ML04", label: "ML04" },
      { value: "ML05", label: "ML05" },
      { value: "ML", label: "ML" },
    ])

    const routesReceptor = ref([])

    const inventoryTransfer = reactive({
      Emisor: "",
      Receptor: "",
      Articulo: "",
      Cantidad: 0,
      Fecha: "",
      Descripcion: "",
      MovID: ""
    })

    const errorFields = reactive({
      Emisor: "",
      Receptor: "",
      Articulo: "",
      Cantidad: "",
      Fecha: "",
      Descripcion: "",
      MovID: ""
    })

    const queryGetArticles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_ARTICLES, variablesArticles));

    const articles = computed(() => queryGetArticles.result.value?.srvArticulosRuta ?? []);

    watch(() => articles, (newValue) => {
      articlesFormatted.value = formatValuesArticlesSelect(articles)
    }, { deep: true })

    const formatValuesArticlesSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.nombreCorto, label: item.nombreCorto }));
      return valueFormated;
    }

    watch(() => route, newValue => {
      variablesArticles.truckId = newValue.value?.value;
      routesReceptor.value = routes.filter(item => item.value != newValue.value.value)
      queryGetArticles.load();
    }, { deep: true })

    const config = ref({
      dateFormat: 'm-d-Y'
    });

    const createTransfer = () => {
      if (errorFields.Receptor === "") {
        errorFields.Receptor = "Este campo es requerido."
        setTimeout(() => {
          errorFields.Receptor = ""
        }, 3000);
      }
      if (errorFields.Fecha === "") {
        errorFields.Fecha = "Este campo es requerido."
        setTimeout(() => {
          errorFields.Fecha = ""
        }, 3000);
      }
      if (errorFields.Articulo === "") {
        errorFields.Articulo = "Este campo es requerido."
        setTimeout(() => {
          errorFields.Articulo = ""
        }, 3000);
      }
      if (errorFields.Cantidad === "") {
        errorFields.Cantidad = "Este campo es requerido."
        setTimeout(() => {
          errorFields.Cantidad = ""
        }, 3000);
      }
      if (errorFields.Descripcion === "") {
        errorFields.Descripcion = "Este campo es requerido."
        setTimeout(() => {
          errorFields.Descripcion = ""
        }, 3000);
      }
      if (route.value === "") {
        errorFields.Emisor = "Este campo es requerido."
        setTimeout(() => {
          errorFields.Emisor = ""
        }, 3000);
      } else {
        console.log('Registro creado');
        // specialPrice.empresa = company.value.value
        // specialPrice.estatus = status.value.value
        // specialPrice.ruta = route.value.value
        // specialPrice.articuloID = article.value.value
        // specialPrice.sucursal = +specialPrice.sucursal
        // specialPrice.ajustePrecio = parseFloat(specialPrice.ajustePrecio)
        // createSpecialPriceMut()
        //   .then((response) => {
        //     if (response.data.createAjustePrecio.message === '"AJUSTE CREADO"') {
        //       toast.success("Precio especial creado exitosamente", {
        //         timeout: 2000,
        //       });
        //     } else {
        //       toast.error("Ha ocurrido un error", {
        //         timeout: 2000,
        //       });
        //     }
        //   })
        closeModal.value = true
      }
    }

    return { articlesFormatted, route, routes, inventoryTransfer, routesReceptor, config, errorFields, createTransfer };
  },
};
</script> -->
