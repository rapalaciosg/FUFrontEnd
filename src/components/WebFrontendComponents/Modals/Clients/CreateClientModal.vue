<template>
  <modal-base @save="createClient()">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <VueSelect :options="routes" label="Ruta" placeholder="Ruta" v-model="ruta" :error="error" />
        <VueSelect :options="provincesFormatted" label="Provincia" placeholder="Provincia" v-model="client.provincia" />
        <Textinput name="pn" type="text" label="Identificador" placeholder="Identificador" v-model="client.clientID" :isReadonly="true" />
        <VueSelect :options="districtsFormatted" label="Distrito" placeholder="Distrito" v-model="client.distrito" />
        <VueSelect :options="localTypeFormatted" label="MS, ABT, KIOSKO, ETV" placeholder="MS, ABT, KIOSKO, ETV" v-model="client.nombre" />
        <VueSelect :options="correctionsFormatted" label="Corregimiento" placeholder="Corregimiento" v-model="client.corregimiento" />
        <Textinput name="pn" type="text" label="Nombre del local" placeholder="Nombre del local" v-model="client.apellido" :error="error" />
        <VueSelect :options="routes" label="Lugar poblado" placeholder="Lugar poblado" v-model="client.lugarPoblado" />
        <Textinput name="pn" type="text" label="RUC + DV o Cédula" placeholder="RUC + DV o Cédula" v-model="client.cedula" />
        <Textinput name="pn" type="text" label="Latitud" placeholder="Latitud" v-model="latitud" />
        <Textinput name="pn" type="text" label="Digito verificador" placeholder="Digito verificador" v-model="client.dv" />
        <Textinput name="pn" type="text" label="Longitud" placeholder="Longitud" v-model="longitud" />
        <FromGroup name="d1" label="Fecha de nacimiento">
          <flat-pickr
            v-model="client.birth"
            class="form-control"
            id="d1"
            placeholder="Fecha de nacimiento"
          />
        </FromGroup>
        <Textinput name="pn" type="number" label="Nuestros tanques" placeholder="Nuestros tanques" v-model="client.tanquesNuestros" />
        <Textinput name="pn" type="text" label="Dirección" placeholder="Dirección" v-model="client.ubicacion" />
        <Textinput name="pn" type="text" label="Precio" placeholder="Precio" :isReadonly="true" v-model="client.precio" />
        <VueSelect :options="customerType" label="Tipo cliente" placeholder="Tipo cliente" v-model="client.clientType" />
        <Textinput name="pn" type="number" label="Otros tanques" placeholder="Otros tanques" v-model="client.otrosTanques" />
        <Textinput name="pn" type="number" label="Número de casa" placeholder="Número de casa" v-model="client.casa" />
        <Textinput name="pn" type="text" label="Contacto" placeholder="Contacto" v-model="client.contacto" />
        <Textinput name="pn" type="number" label="Teléfono o cedular" placeholder="Teléfono o celula" v-model="client.telefono" />
        <Textinput name="pn" type="text" label="Observaciones" placeholder="Observaciones" v-model="client.observaciones" />
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

import { GET_LOCAL_TYPE, GET_PROVINCES, GET_DISTRICTS, GET_CORRECTIONS, CREATE_CLIENT } from "@/services/clients/clientsGraphql.js";
import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  props: [],
  emits: ['client-created'],
  data() {
    return {
      dateDefault: "",
      routes: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ],
      customerType: [
        { value: "0", label: "PLV. Tiendas Nuevas" },
        { value: "1", label: "Clientes comercial" },
        { value: "2", label: "Cliente residencial" },
        { value: "3", label: "Cliente existente con Tanques PLV" },
      ],
    }
  },
  setup(props, { emit }) {
    // Declaring variables and apollo clients
    const variablesDistrics = reactive({ provinceId: ""});
    const variablesCorrections = reactive({ districtId: ""});

    // const variablesCreateClient = reactive({ entityClient: {}});

    const queryGetTipoLocal = provideApolloClient(apolloClient)(() => useLazyQuery(GET_LOCAL_TYPE));
    const queryGetProvincias = provideApolloClient(apolloClient)(() => useLazyQuery(GET_PROVINCES));
    const queryGetDistritos = provideApolloClient(apolloClient)(() => useLazyQuery(GET_DISTRICTS, variablesDistrics));
    const queryGetCorrections = provideApolloClient(apolloClient)(() => useLazyQuery(GET_CORRECTIONS, variablesCorrections));

    let localTypeFormatted = ref([]);
    let provincesFormatted = ref([]);
    let districtsFormatted = ref([]);
    let correctionsFormatted = ref([]);

    let longitud = ref("");
    let latitud = ref("");

    const client = reactive({
      ruta: "",
      distrito: "",
      clientID: "",
      corregimiento: "",
      lugarPoblado: "",
      cedula: "",
      coordenadas: "",
      dv: "",
      birth: "",
      tanquesNuestros: "",
      ubicacion: "",
      otrosTanques: "",
      casa: "",
      contacto: "",
      telefono: "",
      provincia: "",
      apellido: "",
      nombre: "",
      clientType: "",
      observaciones: "",
      precio: ""
    });

    const error = ref("");

    // Initializing the component
    const initialize = () => {
      queryGetTipoLocal.load();
      queryGetProvincias.load();
    }

    onMounted(() => initialize())

    // Getting lists of data
    const localType = computed(() => queryGetTipoLocal.result.value?.srvTipoLocal ?? []);
    const provinces = computed(() => queryGetProvincias.result.value?.srvProvincia ?? []);
    const districts = computed(() => queryGetDistritos.result.value?.srvDistrictByProvince ?? []);
    const corrections = computed(() => queryGetCorrections.result.value?.srvCorregimiento ?? []);

    const formatValuesSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.id, label: item.nombre }));
      return valueFormated;
    }

    // Watchers to format values and show them in selects

    watch(() => localType, (newValue) => {
      localTypeFormatted.value = formatValuesSelect(localType)
    }, { deep: true })

    watch(() => provinces.value, (newValue) => {
      provincesFormatted.value = formatValuesSelect(provinces)
    }, { deep: true })

    watch(() => districts.value, (newValue) => {
      districtsFormatted.value = formatValuesSelect(districts)
    }, { deep: true })

    watch(() => corrections.value, (newValue) => {
      correctionsFormatted.value = formatValuesSelect(corrections)
    }, { deep: true })

    // Watchers to hierarchical values of selects

    watch(() => client.provincia, (newValue) => {
      variablesDistrics.provinceId = (newValue.value) ? newValue.value.toString() : getProvince(client.lugarPoblado, provinces).id.toString();
      queryGetDistritos.load();
    }, { deep: true })

    watch(() => client.distrito, (newValue) => {
      variablesCorrections.districtId = (newValue.value) ? newValue.value : getDistrictId(client.lugarPoblado);
      queryGetCorrections.load();
    }, { deep: true })

    // Create method
    // const { mutate: createClient } = useMutation(CREATE_CLIENT, () => ({ variables: { entityClient: client } }));

    // const isEmpty = (data) => {
    //   const isEmpty = Object.values(data).every(x => x === null || x === '');
    //   if (isEmpty) {
    //     error.value = "Este campo es requerido.";
    //     setTimeout(() => {
    //       error.value = "";
    //     }, 3000);
    //   }
    //   return isEmpty
    // }

    // const emit = defineEmits(['client-created']);

    const createClient = () => {
      console.log('client => ', client);
      emit('client-created')
    }

    return { client, provincesFormatted, localTypeFormatted, districtsFormatted, correctionsFormatted, createClient, longitud, latitud };
  }
};
</script>