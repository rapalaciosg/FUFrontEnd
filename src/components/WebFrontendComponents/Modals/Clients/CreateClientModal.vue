<template>
  <modal-base @save="createClient()">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <VueSelect :options="routes" label="Ruta" placeholder="Ruta" v-model="client.ruta" :error="error" />
        <VueSelect :options="provincesFormatted" label="Provincia" placeholder="Provincia" v-model="zone" />
        <Textinput name="pn" type="text" label="Identificador" placeholder="Identificador" v-model="client.clientID" :isReadonly="true" />
        <VueSelect :options="districtsFormatted" label="Distrito" placeholder="Distrito" v-model="district" />
        <VueSelect :options="localTypeFormatted" label="MS, ABT, KIOSKO, ETV" placeholder="MS, ABT, KIOSKO, ETV" v-model="client.nombre" />
        <VueSelect :options="correctionsFormatted" label="Corregimiento" placeholder="Corregimiento" v-model="correction" />
        <Textinput name="pn" type="text" label="Nombre del local" placeholder="Nombre del local" v-model="client.apellido" :error="error" />
        <VueSelect :options="twonPlacesFormatted" label="Lugar poblado" placeholder="Lugar poblado" v-model="client.lugarPoblado" />
        <Textinput name="pn" type="text" label="RUC + DV o Cédula" placeholder="RUC + DV o Cédula" v-model="client.cedula" />
        <Textinput name="pn" type="text" label="Latitud" placeholder="Latitud" v-model="latitud" />
        <Textinput name="pn" type="number" label="Digito verificador" placeholder="Digito verificador" v-model="client.dv" />
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
        <Textinput name="pn" type="number" label="Precio" placeholder="Precio" :isReadonly="true" v-model="client.precio" />
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
import { useToast } from "vue-toastification";

import { GET_LOCAL_TYPE, GET_PROVINCES, GET_DISTRICTS, GET_CORRECTIONS, GET_TWON_PLACES, CREATE_CLIENT } from "@/services/clients/clientsGraphql.js";
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
        { value: "2", label: "PLV. Tiendas Nuevas" },
        { value: "3", label: "Clientes comercial" },
        { value: "4", label: "Cliente residencial" },
        { value: "5", label: "Cliente existente con Tanques PLV" },
      ],
    }
  },
  setup(props, { emit }) {
    // Declaring variables and apollo clients
    const variablesDistrics = reactive({ provinceId: ""});
    const variablesCorrections = reactive({ districtId: ""});
    const variablesTwonPlaces = reactive({ townshipId: ""});

    // const variablesCreateClient = reactive({ entityClient: {}});

    const queryGetTipoLocal = provideApolloClient(apolloClient)(() => useLazyQuery(GET_LOCAL_TYPE));
    const queryGetProvincias = provideApolloClient(apolloClient)(() => useLazyQuery(GET_PROVINCES));
    const queryGetDistritos = provideApolloClient(apolloClient)(() => useLazyQuery(GET_DISTRICTS, variablesDistrics));
    const queryGetCorrections = provideApolloClient(apolloClient)(() => useLazyQuery(GET_CORRECTIONS, variablesCorrections));
    const queryGetTwonPlaces = provideApolloClient(apolloClient)(() => useLazyQuery(GET_TWON_PLACES, variablesTwonPlaces));

    let localTypeFormatted = ref([]);
    let provincesFormatted = ref([]);
    let districtsFormatted = ref([]);
    let correctionsFormatted = ref([]);
    let twonPlacesFormatted = ref([]);

    let longitud = ref("");
    let latitud = ref("");

    const toast = useToast();

    const client = reactive({
      ruta: "",
      distrito: "",
      clientID: "",
      corregimiento: "",
      lugarPoblado: "",
      cedula: "",
      coordenadas: "",
      dv: 0,
      birth: "",
      tanquesNuestros: 0,
      ubicacion: "",
      otrosTanques: 0,
      casa: "",
      contacto: "",
      telefono: "",
      zona: "",
      apellido: "",
      nombre: "",
      clientType: "",
      observacion: "",
      precio: "",
      usuario_reg: "",
      fecha_reg: "2023-07-04",
      localName: "",
      createdBy: "",
      updatedAt: "",
      frecuencia: ""
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
    const twonPlaces = computed(() => queryGetTwonPlaces.result.value?.srvLugarPoblacionWithPrice ?? []);

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

    watch(() => twonPlaces.value, (newValue) => {
      twonPlacesFormatted.value = formatValuesSelect(twonPlaces)
    }, { deep: true })

    // Watchers to hierarchical values of selects

    const zone = ref("");
    const district = ref("");
    const correction = ref("");

    watch(() => zone.value, (newValue) => {
      client.zona = newValue.label
      variablesDistrics.provinceId = `${newValue.value}`;
      queryGetDistritos.load();
    }, { deep: true })

    watch(() => district.value, (newValue) => {
      variablesCorrections.districtId = newValue.value;
      client.distrito = newValue.label;
      queryGetCorrections.load();
    }, { deep: true })

    watch(() => correction.value, (newValue) => {
      variablesTwonPlaces.townshipId = newValue.value
      client.corregimiento = newValue.label;
      queryGetTwonPlaces.load();
    })

    watch(() => client.lugarPoblado, (newValue) => {
      const priceValue = twonPlaces.value.find(item => item.id == newValue.value);
      client.precio = +priceValue.precio;
      client.clientID = "ML01-276"
    })

    // Create method
    const { mutate: createClientMutf } = useMutation(CREATE_CLIENT, () => ({ variables: { entityClient: client } }));

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

    const createClient = () => {
      client.coordenadas = `${latitud.value},${longitud.value}`
      client.clientType = client.clientType.value
      client.ruta = client.ruta.value
      client.usuario_reg = client.ruta
      client.lugarPoblado = client.lugarPoblado.value
      client.nombre = client.nombre.label
      client.dv = +client.dv
      client.tanquesNuestros = +client.tanquesNuestros
      client.otrosTanques = +client.otrosTanques
      console.log('client => ', client);
      emit('client-created')
      createClientMutf()
      toast.success("Cliente creado exitosamente", {
        timeout: 2000,
      });
    }

    return { client, provincesFormatted, localTypeFormatted, districtsFormatted, correctionsFormatted, twonPlacesFormatted, createClient, longitud, latitud, zone, district, correction };
  }
};
</script>