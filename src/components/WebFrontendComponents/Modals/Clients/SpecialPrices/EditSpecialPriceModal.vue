<template>
  <modal-base @save="editSpecialPrice()" :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput name="pn" type="text" label="Customer id" placeholder="Customer id" v-model="specialPrice.clienteID" :error="errorFields.clienteID" />
        <FromGroup name="d1" label="Fecha inicial" :error="errorFields.fechaInicial">
          <flat-pickr
            v-model="specialPrice.fechaInicial"
            class="form-control"
            id="d1"
            placeholder="Fecha inicial"
          />
        </FromGroup>
        <Textinput name="pn" type="text" label="Sucursal id" placeholder="Sucursal id" v-model="specialPrice.sucursal" :error="errorFields.sucursal" />
        <FromGroup name="d1" label="Fecha final" :error="errorFields.fechaFinal">
          <flat-pickr
            v-model="specialPrice.fechaFinal"
            class="form-control"
            id="d1"
            placeholder="Fecha final"
          />
        </FromGroup>
        <VueSelect :options="options" label="Ruta" placeholder="Ruta" v-model="route" :error="errorFields.ruta" />
        <VueSelect :options="statusList" label="Estado" placeholder="Estado" v-model="status" :error="errorFields.estatus" />
        <VueSelect :options="articlesFormatted" label="Artículo" placeholder="Artículo" v-model="article" :error="errorFields.articuloID" />
        <VueSelect :options="companiesFormatted" label="Empresa" placeholder="Empresa" v-model="company" :error="errorFields.empresa" />
        <Textinput name="pn" type="number" label="Ajuste precio" placeholder="Ajuste precio" v-model="specialPrice.ajustePrecio" :error="errorFields.ajustePrecio" />
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
import { articleList } from "../../../../../constant/clients/specialPrices/constantSpecialPrices.js";
import { useToast } from "vue-toastification";

import { GET_COMPANIES_QUERY, GET_ALL_ARTICLES, UPDATE_SPECIAL_PRICE } from "@/services/clients/specialPrices/specialPricesGraphql.js";
import { provideApolloClient, useLazyQuery, useMutation } from "@vue/apollo-composable";
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
  emits: ['price-edited'],
  data() {
    return {
      articleList,
      statusList: [
        { value: "ALTA", label: "ALTA" },
        { value: "BAJA", label: "BAJA" }
      ],
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
        { value: "ML04", label: "ML04" },
        { value: "ML05", label: "ML05" },
        { value: "ML", label: "ML" },
      ],
    }
  },
  setup(props, {emit}) {
    const variablesCompanies = reactive({ route: "" });
    const variablesArticles = reactive({ truckId: "" });

    let companiesFormatted = ref([]);
    let articlesFormatted = ref([]);

    let closeModal = ref(false);
    
    let article = ref("");
    let status = ref("");
    let company = ref("");
    let route = ref("");

    const toast = useToast();

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

    const errorFields = reactive({
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

    // Initializing the component
    const initialize = () => {
      Object.keys(specialPrice).forEach(item => specialPrice[item] = "");
    }

    onMounted(() => initialize())

    // Setting default values into edit modal
    watch(() => props.data, (value) => {
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

    const { mutate: editSpecialPriceMut } = useMutation(UPDATE_SPECIAL_PRICE, () => ({ variables: { clientAjustePrecio: specialPrice } }));

    const editSpecialPrice = () => {
      if (specialPrice.clienteID === "") {
        errorFields.clienteID = "Este campo es requerido."
        setTimeout(() => {
          errorFields.clienteID = ""
        }, 3000);
      }
      if (specialPrice.sucursal == "") {
        errorFields.sucursal = "Este campo es requerido."
        setTimeout(() => {
          errorFields.sucursal = ""
        }, 3000);
      }
      if (route.value == "") {
        errorFields.ruta = "Este campo es requerido."
        setTimeout(() => {
          errorFields.ruta = ""
        }, 3000);
      }
      if (article.value == "") {
        errorFields.articuloID = "Este campo es requerido."
        setTimeout(() => {
          errorFields.articuloID = ""
        }, 3000);
      }
      if (specialPrice.ajustePrecio == "") {
        errorFields.ajustePrecio = "Este campo es requerido."
        setTimeout(() => {
          errorFields.ajustePrecio = ""
        }, 3000);
      }
      if (status.value == "") {
        errorFields.estatus = "Este campo es requerido."
        setTimeout(() => {
          errorFields.estatus = ""
        }, 3000);
      }
      if (specialPrice.fechaInicial == "") {
        errorFields.fechaInicial = "Este campo es requerido."
        setTimeout(() => {
          errorFields.fechaInicial = ""
        }, 3000);
      }
      if (specialPrice.fechaFinal == "") {
        errorFields.fechaFinal = "Este campo es requerido."
        setTimeout(() => {
          errorFields.fechaFinal = ""
        }, 3000);
      }
      if (company.value == "") {
        errorFields.empresa = "Este campo es requerido."
        setTimeout(() => {
          errorFields.empresa = ""
        }, 3000);
      } else {
        specialPrice.empresa = specialPrice.empresa.value || specialPrice.empresa
        specialPrice.estatus = specialPrice.estatus.value || specialPrice.estatus
        specialPrice.ruta = route.value.value || route.value
        editSpecialPriceMut()
        .then((response) => {
            if (response.data.createAjustePrecio.message == "AJUSTE EDITADO") {
              toast.success("Precio especial editado exitosamente", {
                timeout: 2000,
              });
            } else {
              toast.error("Ha ocurrido un error", {
                timeout: 2000,
              });
            }
          })
        emit('price-edited', { truckId: specialPrice.ruta, company: specialPrice.empresa })
        closeModal.value = true
      }
    }

    return { specialPrice, companiesFormatted, articlesFormatted, editSpecialPrice, route, closeModal, article, status, company }
  }
};
</script>
