<template>
  <modal-base @save="editSpecialPrice()">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput name="pn" type="text" label="Customer id" placeholder="Customer id" v-model="specialPrice.clienteID" />
        <FromGroup name="d1" label="Fecha inicial">
          <flat-pickr
            v-model="specialPrice.fechaFinal"
            class="form-control"
            id="d1"
            placeholder="Fecha inicial"
          />
        </FromGroup>
        <Textinput name="pn" type="text" label="Sucursal id" placeholder="Sucursal id" v-model="specialPrice.sucursal" />
        <FromGroup name="d1" label="Fecha final">
          <flat-pickr
            v-model="specialPrice.fechaFinal"
            class="form-control"
            id="d1"
            placeholder="Fecha final"
          />
        </FromGroup>
        <VueSelect :options="options" label="Ruta" placeholder="Ruta" v-model="route" />
        <VueSelect :options="status" label="Estado" placeholder="Estado" v-model="specialPrice.estatus" />
        <VueSelect :options="articlesFormatted" label="Artículo" placeholder="Artículo" v-model="specialPrice.articuloID" />
        <VueSelect :options="companiesFormatted" label="Empresa" placeholder="Empresa" v-model="specialPrice.empresa" />
        <Textinput name="pn" type="number" label="Ajuste precio" placeholder="Ajuste precio" v-model="specialPrice.ajustePrecio" />
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

import { GET_COMPANIES_QUERY, GET_ALL_ARTICLES, UPDATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { provideApolloClient, useLazyQuery } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  props: {
    data: {
      type: String,
      defaul: []
    }
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
    let route = ref([]);

    const specialPrice = reactive({
      clienteID: "",
      sucursal: "",
      articuloID: "",
      ajustePrecio: 0,
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

    // Initializing the component
    const initialize = () => {
      Object.keys(specialPrice).forEach(item => specialPrice[item] = "");
    }

    onMounted(() => initialize())

    // Setting default values into edit modal
    watch(() => props.data, (value) => {
      console.log('data => ', value);
      Object.keys(specialPrice).forEach(item => specialPrice[item] = value[item] || "");
      specialPrice.ajustePrecio = value.ajustePrecio
      route.value = value.ruta;
    })

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
      variablesCompanies.route = newValue.value.value || newValue;
      variablesArticles.truckId = newValue.value.value || newValue ;
      queryGetCompanies.load();
      queryGetArticles.load();
    }, { deep: true })

    const editSpecialPrice = () => {
      specialPrice.empresa = specialPrice.empresa.value || specialPrice.empresa
      specialPrice.estatus = specialPrice.estatus.value || specialPrice.estatus
      specialPrice.ruta = route.value.value || route.value
      // specialPrice.articulo = specialPrice.articulo.value
      console.log('Precio especial editado => ', specialPrice);
    }

    // const { mutate: editSpecialPrice } = useMutation(UPDATE_SPECIAL_PRICE, () => ({ variables: { clientAjustePrecio: specialPrice } }));

    return { specialPrice, companiesFormatted, articlesFormatted, editSpecialPrice, route }
  }
};
</script>
