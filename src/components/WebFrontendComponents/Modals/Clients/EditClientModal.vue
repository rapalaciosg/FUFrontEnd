<template>
  <modal-base @save="editClient()">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-x-5 gap-y-1">
        <VueSelect :options="routes" label="Ruta" placeholder="Ruta" v-model="client.ruta" />
        <VueSelect :options="provincesFormatted" label="Provincia" placeholder="Provincia" v-model="zone" />
        <Textinput name="pn" type="text" label="Identificador" placeholder="Identificador" :isReadonly="true" v-model="client.clientID" />
        <VueSelect :options="districtsFormatted" label="Distrito" placeholder="Distrito" v-model="district" />
        <VueSelect :options="localTypeFormatted" label="MS, ABT, KIOSKO, ETV" placeholder="MS, ABT, KIOSKO, ETV" v-model="client.nombre" />
        <VueSelect :options="correctionsFormatted" label="Corregimiento" placeholder="Corregimiento" v-model="correction" />
        <Textinput name="pn" type="text" label="Nombre del local" placeholder="Nombre del local" v-model="client.apellido" />
        <VueSelect :options="twonPlacesFormatted" label="Lugar poblado" placeholder="Lugar poblado" v-model="twonPlace" />
        <Textinput name="pn" type="text" label="RUC + DV o Cédula" placeholder="RUC + DV o Cédula" v-model="client.cedula" />
        <Textinput name="pn" type="text" label="Latitud" placeholder="Latitud" v-model="latitud" />
        <Textinput name="pn" type="text" label="Digito verificador" placeholder="Digito verificador" v-model="client.dv" />
        <Textinput name="pn" type="text" label="Longitud" placeholder="Longitud" v-model="longitud" />
        <FromGroup name="d1" label="Fecha de nacimiento">
          <flat-pickr v-model="client.birth" class="form-control" id="d1" placeholder="Fecha de nacimiento" />
        </FromGroup>
        <Textinput name="pn" type="number" label="Nuestros tanques" placeholder="Nuestros tanques" v-model="client.tanquesNuestros" />
        <Textinput name="pn" type="text" label="Dirección" placeholder="Dirección" v-model="client.ubicacion" />
        <Textinput name="pn" type="text" label="Precio" placeholder="Precio" v-model="client.precio" :isReadonly="true" />
        <VueSelect :options="customerType" label="Tipo cliente" placeholder="Tipo cliente" v-model="client.clientType" value="value"/>
        <Textinput name="pn" type="number" label="Otros tanques" placeholder="Otros tanques" v-model="client.otrosTanques" />
        <Textinput name="pn" type="number" label="Número de casa" placeholder="Número de casa" v-model="client.casa" />
        <Textinput name="pn" type="text" label="Contacto" placeholder="Contacto" v-model="client.contacto" />
        <Textinput name="pn" type="number" label="Teléfono o cedular" placeholder="Teléfono o celular" v-model="client.telefono" />
        <Textinput name="pn" type="text" label="Observaciones" placeholder="Observaciones" v-model="client.observacion" />
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import ModalBase from "../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import { useToast } from "vue-toastification";

import { GET_LOCAL_TYPE, GET_PROVINCES, GET_DISTRICTS, GET_CORRECTIONS, GET_TWON_PLACES, UPDATE_CLIENT } from "@/services/clients/clientsGraphql.js";
import { useLazyQuery, provideApolloClient, useMutation } from "@vue/apollo-composable";
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
      type: Object,
      default: {}
    }
  },
  emits: ['client-updated'],
  data() {
    return {
      routes: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ]
    }
  },
  setup(props, {emit}) {
    // Declaring variables and apollo clients
    const variablesDistrics = reactive({ provinceId: ""});
    const variablesCorrections = reactive({ districtId: ""});
    const variablesTwonPlaces = reactive({ townshipId: ""});

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

    const zone = ref("");
    const district = ref("");
    const correction = ref("");
    const twonPlace = ref("");

    const toast = useToast();

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
      zona: "",
      apellido: "",
      nombre: "",
      clientType: "",
      precio: "",
      observacion: ""
    });

    const customerType = ref([
      { value: "2", label: "PLV. Tiendas Nuevas" },
      { value: "3", label: "Clientes comercial" },
      { value: "4", label: "Cliente residencial" },
      { value: "5", label: "Cliente existente con Tanques PLV" },
    ])

    // Initializing the component
    const initialize = () => {
      Object.keys(client).forEach(item => client[item] = "");
      queryGetTipoLocal.load();
      queryGetProvincias.load();
    }

    onMounted(() => initialize())

    // Setting default values into edit modal
    watch(() => props.data, (value) => {
      Object.keys(client).forEach(item => client[item] = value[item] || "");
      latitud.value = getCoordenates(value.coordenadas).latitud;
      longitud.value = getCoordenates(value.coordenadas).longitud;
      zone.value = value.zona;
      district.value = value.distrito;
      correction.value = value.corregimiento;
      client.clientType = customerType.value.find(item => item.value === value.clientType)
    })

    // Getting lists of data
    const localType = computed(() => queryGetTipoLocal.result.value?.srvTipoLocal ?? []);
    const provinces = computed(() => queryGetProvincias.result.value?.srvProvincia ?? []);
    const districts = computed(() => queryGetDistritos.result.value?.srvDistrictByProvince ?? []);
    const corrections = computed(() => queryGetCorrections.result.value?.srvCorregimiento ?? []);
    const twonPlaces = computed(() => queryGetTwonPlaces.result.value?.srvLugarPoblacionWithPrice ?? []);

    // Functions to format data for selects and getting, coordenates provincies (id, name), districts (id, name) and corrections (id, name)
    const getCoordenates = (coordenadas) => {
      const [ latitud, longitud ] = coordenadas.split(',');
      return { latitud, longitud };
    }

    const getProvince = (dataPlaces, data) => {
      const provinceId = getPlacesId(dataPlaces).provinceId;
      const returnProvinceId = data.value.find(item => item.id == provinceId);
      return returnProvinceId;
    }

    const getDistrictId = (dataPlaces) => {
      const districtId = getPlacesId(dataPlaces).districtId;
      return districtId;
    }

    const getTownPlaces = (dataPlaces, data) => {
      const twonshipId = getPlacesId(dataPlaces).twonshipId;
      return returnTwonshipId;
    }

    const getPlacesId = (dataPlaces) => {
      const [ provinceId, districtId, twonshipId ] = dataPlaces.split('-');
      return { provinceId, districtId: `${provinceId}-${districtId}`, twonshipId: `${provinceId}-${districtId}-${twonshipId}` };
    }

    const formatValuesSelect = (data) => {
      const valueFormated = data.value.map(item => ({ value: item.id, label: item.nombre }));
      return valueFormated;
    }

    const getTwonPlaceName = (data, twonPlaceValue) => {
      const twonPlaceName = data.value.find(item => item.id == twonPlaceValue);
      return twonPlaceName;
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
      if (!twonPlace.value)
        twonPlace.value = getTwonPlaceName(twonPlaces, client.lugarPoblado).nombre
    }, { deep: true })

    // Watchers to hierarchical values of selects

    watch(() => zone.value, (newValue) => {
      variablesDistrics.provinceId = (newValue.value) ? newValue.value.toString() : getProvince(client.lugarPoblado, provinces).id.toString();
      queryGetDistritos.load();
    }, { deep: true })

    watch(() => district.value, (newValue) => {
      variablesCorrections.districtId = (newValue.value) ? newValue.value : getDistrictId(client.lugarPoblado);
      queryGetCorrections.load();
    }, { deep: true })

    watch(() => correction.value, (newValue) => {
      variablesTwonPlaces.townshipId = (newValue.value) ? newValue.value : getPlacesId(client.lugarPoblado).twonshipId;
      queryGetTwonPlaces.load();
    }, { deep: true })

    watch(() => twonPlace.value, (newValue) => {
      const twonPlaceValue = (newValue.label) ? newValue.label : newValue;
      const priceValue = twonPlaces.value.find(item => item.nombre == twonPlaceValue);
      client.precio = priceValue.precio
    }, { deep: true })

    // update client
    const { mutate: editClientMut } = useMutation(UPDATE_CLIENT, () => ({ variables: { entityClient: client } }));

    const editClient = () => {
      client.coordenadas = `${latitud.value},${longitud.value}`
      client.clientType = client.clientType.value || client.clientType
      client.ruta = client.ruta.value || client.ruta
      client.usuario_reg = client.ruta
      client.lugarPoblado = client.lugarPoblado.value || client.lugarPoblado
      client.nombre = client.nombre.label || client.nombre
      client.dv = +client.dv
      client.tanquesNuestros = +client.tanquesNuestros
      client.otrosTanques = +client.otrosTanques
      client.zona = (zone.value.label) ? zone.value.label : zone.value
      client.corregimiento = (correction.value.label) ? correction.value.label : correction.value
      client.distrito = (district.value.label) ? district.value.label : district.value
      client.lugarPoblado = twonPlace.value.value || twonPlace.value
      console.log('client => ', client);
      emit('client-updated', client.ruta)
      toast.success("Cliente editado exitosamente", {
        timeout: 2000,
      });
      editClientMut()
    }


    return { client, provincesFormatted, localTypeFormatted, districtsFormatted, correctionsFormatted, editClient, twonPlacesFormatted, latitud, longitud, zone, district, correction, twonPlace, customerType };
  }
};
</script>
