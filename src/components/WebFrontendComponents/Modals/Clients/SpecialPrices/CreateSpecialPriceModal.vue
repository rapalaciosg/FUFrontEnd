<template>
  <modal-base @save="createSpecialPrice()" :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <Textinput name="pn" type="text" label="Customer id" placeholder="Customer id" v-model="specialPrice.clienteID" :error="errorFields.clienteID" />
        <FromGroup name="d1" label="Fecha inicial" :error="errorFields.fechaInicial">
          <flat-pickr
            class="form-control"
            id="d1"
            placeholder="Fecha inicial"
            v-model="specialPrice.fechaInicial"
            :config="config"
          />
        </FromGroup>
        <Textinput name="pn" type="text" label="Sucursal id" placeholder="Sucursal id" v-model="specialPrice.sucursal" :error="errorFields.sucursal" />
        <FromGroup name="d1" label="Fecha final" :error="errorFields.fechaFinal">
          <flat-pickr
            class="form-control"
            id="d1"
            placeholder="Fecha final"
            v-model="specialPrice.fechaFinal"
            :config="config"
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
  setup(props) {
    const variablesCompanies = reactive({ route: "" });
    const variablesArticles = reactive({ truckId: "" });

    const toast = useToast();
    let closeModal = ref(false);

    let companiesFormatted = ref([]);
    let articlesFormatted = ref([]);

    let route = ref("");
    let article = ref("");
    let status = ref("");
    let company = ref("");

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

    const isEmpty = (data) => {
      Object.values(data).every(x => (x === null || x === '') ? errorFields[x] = "Este campo es requerido." : "" );
      setTimeout(() => {
        Object.values(data).every(x => data[x] = "");
      }, 3000);
    }

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

    const config = ref({
      dateFormat: 'm-d-Y'
    });

    const createSpecialPrice = () => {
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
        specialPrice.empresa = company.value.value
        specialPrice.estatus = status.value.value
        specialPrice.ruta = route.value.value
        specialPrice.articuloID = article.value.value
        specialPrice.sucursal = +specialPrice.sucursal
        specialPrice.ajustePrecio = parseFloat(specialPrice.ajustePrecio)
        createSpecialPriceMut()
          .then((response) => {
            if (response.data.createAjustePrecio.message == "AJUSTE CREADO") {
              toast.success("Precio especial creado exitosamente", {
                timeout: 2000,
              });
            } else {
              toast.error("Ha ocurrido un error", {
                timeout: 2000,
              });
            }
          })
        closeModal.value = true
      }
    }

    const { mutate: createSpecialPriceMut } = useMutation(CREATE_SPECIAL_PRICE, () => ({ variables: { clientAjustePrecio: specialPrice } }));

    return { specialPrice, companiesFormatted, articlesFormatted, createSpecialPrice, route, config, errorFields, article, status, company, closeModal }
  }
};
</script>
