<template>
  <modal-base @save="createSpecialPrice()">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput name="pn" type="text" label="Customer id" placeholder="Customer id" v-model="specialPrice.clienteID" />
        <FromGroup name="d1" label="Fecha inicial">
          <flat-pickr
            class="form-control"
            id="d1"
            placeholder="Fecha inicial"
            v-model="specialPrice.fechaInicial"
          />
        </FromGroup>
        <Textinput name="pn" type="text" label="Sucursal id" placeholder="Sucursal id" v-model="specialPrice.sucursal" />
        <FromGroup name="d1" label="Fecha final">
          <flat-pickr
            class="form-control"
            id="d1"
            placeholder="Fecha final"
            v-model="specialPrice.fechaFinal"
          />
        </FromGroup>
        <VueSelect :options="options" label="Ruta" placeholder="Ruta" v-model="route" />
        <VueSelect :options="status" label="Estado" placeholder="Estado" v-model="specialPrice.estatus" />
        <VueSelect :options="articlesFormatted" label="Artículo" placeholder="Artículo" v-model="specialPrice.articuloID" />
        <VueSelect :options="companiesFormatted" label="Empresa" placeholder="Empresa" v-model="specialPrice.empresa" />
        <Textinput name="pn" type="text" label="Ajuste precio" placeholder="Ajuste precio" v-model="specialPrice.ajustePrecio" />
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

import { GET_COMPANIES_QUERY, GET_ALL_ARTICLES, CREATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { provideApolloClient, useLazyQuery, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  data() {
    return {
      status: [
        { value: "ALTA", label: "ALTA" },
        { value: "BAJA", label: "BAJA" }
      ],
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML03", label: "ML04" },
        { value: "ML03", label: "ML05" },
        { value: "ML03", label: "ML" },
      ],
    }
  },
  setup(props) {
    const variablesCompanies = reactive({ route: "" });
    const variablesArticles = reactive({ truckId: "" });

    let companiesFormatted = ref([]);
    let articlesFormatted = ref([]);
    let route = ref("");

    const specialPrice = reactive({
      clienteID: "",
      sucursal: "",
      articuloID: "",
      ajustePrecio: "",
      fechaInicial: "",
      fechaFinal: "",
      ruta: "",
      estatus: "",
      empresa: ""
    })

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_COMPANIES_QUERY, variablesCompanies));
    const queryGetArticles = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_ARTICLES, variablesArticles));

    const companies = computed(() => queryGetCompanies.result.value?.srvEmpresa ?? []);
    const articles = computed(() => queryGetArticles.result.value?.srvArticulosRuta ?? []);

    const formatValuesSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.empresaID, label: item.nombre }));
      return valueFormated;
    }

    const formatValuesArticlesSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.nombreCorto, label: item.nombreCorto }));
      return valueFormated;
    }

    watch(() => companies, (newValue) => {
      companiesFormatted.value = formatValuesSelect(companies)
    }, { deep: true })

    watch(() => articles, (newValue) => {
      articlesFormatted.value = formatValuesArticlesSelect(articles)
    }, { deep: true })

    watch(() => route, newValue => {
      variablesCompanies.route = newValue.value.value;
      variablesArticles.truckId = newValue.value.value;
      queryGetCompanies.load();
      queryGetArticles.load();
    }, { deep: true })

    const createSpecialPrice = () => {
      specialPrice.empresa = specialPrice.empresa.value
      specialPrice.estatus = specialPrice.estatus.value
      specialPrice.ruta = route.value.value
      // specialPrice.articulo = specialPrice.articulo.value
      console.log('Precio especial creado => ', specialPrice);
    }

    // const { mutate: createSpecialPrice } = useMutation(CREATE_SPECIAL_PRICE, () => ({ variables: { clientAjustePrecio: specialPrice } }));

    return { specialPrice, companiesFormatted, articlesFormatted, createSpecialPrice, route }
  }
};
</script>
