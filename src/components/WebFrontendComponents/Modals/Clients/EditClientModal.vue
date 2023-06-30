<template>
  <modal-base>
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-x-5 gap-y-1">
        <VueSelect :options="options" label="Ruta" placeholder="Ruta" v-model="client.ruta" />
        <VueSelect :options="provinciasFormat" label="Provincia" placeholder="Provincia" />
        <Textinput name="pn" type="text" label="Identificador" placeholder="Identificador" :isReadonly="true" />
        <VueSelect :options="options" label="Distrito" placeholder="Distrito" v-model="client.distrito" />
        <VueSelect :options="tipoLocalFormat" label="MS, ABT, KIOSKO, ETV" placeholder="MS, ABT, KIOSKO, ETV" v-model="client.nombre" />
        <VueSelect :options="options" label="Corregimiento" placeholder="Corregimiento" />
        <Textinput name="pn" type="text" label="Nombre del local" placeholder="Nombre del local" :modelValue="client.clientID" />
        <VueSelect :options="options" label="Lugar poblado" placeholder="Lugar poblado" />
        <Textinput name="pn" type="text" label="RUC + DV o Cédula" placeholder="RUC + DV o Cédula" :modelValue="client.cedula" />
        <Textinput name="pn" type="text" label="Latitud" placeholder="Latitud" :modelValue="client.latitud" />
        <Textinput name="pn" type="text" label="Digito verificador" placeholder="Digito verificador" :modelValue="client.dv" />
        <Textinput name="pn" type="text" label="Longitud" placeholder="Longitud" :modelValue="client.longitud" />
        <FromGroup name="d1" label="Fecha de nacimiento">
          <flat-pickr
            v-model="dateDefault"
            class="form-control"
            id="d1"
            placeholder="Fecha de nacimiento"
          />
        </FromGroup>
        <Textinput name="pn" type="number" label="Nuestros tanques" placeholder="Nuestros tanques" />
        <Textinput name="pn" type="text" label="Dirección" placeholder="Dirección" />
        <Textinput name="pn" type="text" label="Precio" placeholder="Precio" :isReadonly="true" />
        <VueSelect :options="options" label="Tipo cliente" placeholder="Tipo cliente" />
        <Textinput name="pn" type="number" label="Otros tanques" placeholder="Otros tanques" />
        <Textinput name="pn" type="number" label="Número de casa" placeholder="Número de casa" />
        <Textinput name="pn" type="text" label="Contacto" placeholder="Contacto" />
        <Textinput name="pn" type="number" label="Teléfono o cedular" placeholder="Teléfono o celular" />
        <Textinput name="pn" type="text" label="Observaciones" placeholder="Observaciones" />
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

import { GET_TIPO_LOCAL, GET_PROVINCIAS } from "@/services/clients/clientsGraphql.js";
import { useQuery, provideApolloClient } from "@vue/apollo-composable";
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
      type: Array,
      default: []
    }
  },
  mounted() {
    Object.keys(this.client).forEach(item => this.client[item] = "");
  },
  watch: {
    data(value) {
      Object.keys(this.client).forEach(item => this.client[item] = value[item] || "");
      if(value.coordenadas) {
        const [ latitud, longitud ] = value.coordenadas.split(',')
        this.client.latitud = latitud
        this.client.longitud = longitud
      }
    }
  },
  data() {
    return {
      dateDefault: "",
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ],
      client: {
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
      }
    }
  },
  setup() {

    let tipoLocalFormat = ref([])
    let provinciasFormat = ref([])

    const queryGetTipoLocal = provideApolloClient(apolloClient)(() => useQuery(GET_TIPO_LOCAL));
    const queryGetProvincias = provideApolloClient(apolloClient)(() => useQuery(GET_PROVINCIAS));

    const tipoLocal = computed(() => queryGetTipoLocal.result.value?.srvTipoLocal ?? []);
    const provincias = computed(() => queryGetProvincias.result.value?.srvProvincia ?? []);

    watch(() => tipoLocal, (newValue) => {
      tipoLocalFormat.value = tipoLocal.value.map(item => ({ value: item.id, label: item.nombre }))
    }, { deep: true })

    watch(() => provincias.value, (newValue) => {
      provinciasFormat.value = provincias.value.map(item => ({ value: item.id, label: item.nombre }))
    }, { deep: true })


    return { provinciasFormat, tipoLocalFormat };
  }
};
</script>
