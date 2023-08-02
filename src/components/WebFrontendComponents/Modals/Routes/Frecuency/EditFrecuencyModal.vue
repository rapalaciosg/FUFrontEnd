<!-- <template>
  <modal-base @save="editFrecuency()" :closeModal="closeModal">
    <template v-slot:modal-body>
      <label class="inline-flex text-sm cursor-pointer">
        <input type="checkbox" @change="toggle" hidden />
        <span
          class="px-[18px] py-1 transition duration-100 rounded"
          :class="
            check
              ? 'bg-slate-900 dark:bg-slate-900 text-white'
              : 'dark:text-slate-300'
          "
          >Frecuencia</span
        >
        <span
          class="px-[18px] py-1 transition duration-100 rounded"
          :class="
            !check
              ? 'bg-slate-900 dark:bg-slate-900 text-white'
              : ' dark:text-slate-300'
          "
          >Cliente detalle</span
        >
      </label>
      <div v-if="check === true" class="grid grid-cols-2 gap-x-5 gap-y-1 pt-6">
        <Textinput
          class="col-span-2 mb-6"
          type="text"
          label="Cliente"
          placeholder="Cliente"
          v-model="clientFullName"
          :isReadonly="true"
        />
        <Checkbox
          label="Lunes"
          v-model="weekDays.monday"
          :checked="weekDays.monday"
        />
        <FromGroup name="d1" label="Próxima visita">
          <flat-pickr
            class="form-control"
            id="d1"
            placeholder="Próxima visita"
            v-model="frecuency.proximaVisita"
            :config="config"
          />
        </FromGroup>
        <Checkbox
          label="Martes"
          v-model="weekDays.tuesday"
          :checked="weekDays.tuesday"
        />
        <FromGroup name="d1" label="Visita previa">
          <flat-pickr
            class="form-control"
            id="d1"
            placeholder="Visita previa"
            v-model="frecuency.visitaAnterior"
            :config="config"
          />
        </FromGroup>
        <Checkbox
          label="Miércoles"
          v-model="weekDays.wednesday"
          :checked="weekDays.wednesday"
        />
        <Textinput
          type="number"
          label="Frecuencia"
          placeholder="Frecuencia"
          v-model="frecuency.frecuencia"
        />
        <Checkbox
          label="Jueves"
          v-model="weekDays.thursday"
          :checked="weekDays.thursday"
        />
        <VueSelect
          :options="companiesFormatted"
          label="Empresa"
          placeholder="Empresa"
          v-model="frecuency.empresa"
        />
        <Checkbox
          label="Viernes"
          v-model="weekDays.friday"
          :checked="weekDays.friday"
        />
        <Textinput
          type="number"
          label="Sucursal id"
          placeholder="Sucursal id"
          v-model="frecuency.sucCliente"
        />
        <Checkbox
          label="Sábado"
          v-model="weekDays.saturday"
          :checked="weekDays.saturday"
        />
        <Textinput
          type="text"
          label="Observaciones"
          placeholder="Observaciones"
          v-model="frecuency.observaciones"
        />
        <Checkbox
          label="Domingo"
          v-model="weekDays.sunday"
          :checked="weekDays.sunday"
        />
      </div>
      <div v-else class="grid grid-cols-2 gap-x-5 gap-y-1 pt-6">
        <Textinput
          label="Ruta"
          placeholder="Ruta"
          v-model="client.ruta"
          :isReadonly="true"
        />
        <Textinput
          label="Provincia"
          placeholder="Provincia"
          v-model="client.zona"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Identificador"
          placeholder="Identificador"
          v-model="client.clientID"
          :isReadonly="true"
        />
        <Textinput
          label="Distrito"
          placeholder="Distrito"
          v-model="client.distrito"
          :isReadonly="true"
        />
        <Textinput
          label="MS, ABT, KIOSKO, ETV"
          placeholder="MS, ABT, KIOSKO, ETV"
          v-model="client.nombre"
          :isReadonly="true"
        />
        <Textinput
          label="Corregimiento"
          placeholder="Corregimiento"
          v-model="client.corregimiento"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Nombre del local"
          placeholder="Nombre del local"
          v-model="client.apellido"
          :isReadonly="true"
        />
        <Textinput
          label="Lugar poblado"
          placeholder="Lugar poblado"
          v-model="client.lugarPoblado"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="RUC + DV o Cédula"
          placeholder="RUC + DV o Cédula"
          v-model="client.cedula"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Latitud"
          placeholder="Latitud"
          v-model="latitud"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="number"
          label="Digito verificador"
          placeholder="Digito verificador"
          v-model="client.dv"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Longitud"
          placeholder="Longitud"
          v-model="longitud"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Fecha de nacimiento"
          placeholder="Fecha de nacimiento"
          v-model="client.birth"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="number"
          label="Nuestros tanques"
          placeholder="Nuestros tanques"
          v-model="client.tanquesNuestros"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Dirección"
          placeholder="Dirección"
          v-model="client.ubicacion"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="number"
          label="Precio"
          placeholder="Precio"
          :isReadonly="true"
          v-model="client.precio"
        />
        <Textinput
          label="Tipo cliente"
          placeholder="Tipo cliente"
          v-model="client.clientType"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="number"
          label="Otros tanques"
          placeholder="Otros tanques"
          v-model="client.otrosTanques"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="number"
          label="Número de casa"
          placeholder="Número de casa"
          v-model="client.casa"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Contacto"
          placeholder="Contacto"
          v-model="client.contacto"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="number"
          label="Teléfono o cedular"
          placeholder="Teléfono o celula"
          v-model="client.telefono"
          :isReadonly="true"
        />
        <Textinput
          name="pn"
          type="text"
          label="Observaciones"
          placeholder="Observaciones"
          v-model="client.observaciones"
          :isReadonly="true"
        />
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Card from "@/components/DashCodeComponents/Card";
import ModalBase from "../../ModalBase.vue";
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import { useToast } from "vue-toastification";

import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";
import { GET_CLIENT_QUERY } from "@/services/clients/clientsGraphql.js";
import { UPDATE_FRECUENCY } from "@/services/routes/frecuency/frecuencyGraphql.js";
import { GET_COMPANIES_QUERY } from "@/services/clients/specialPrices/specialPricesGraphql.js";

export default {
  components: {
    ModalBase,
    Card,
    Textinput,
    FromGroup,
    VueSelect,
    Checkbox,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  emits: ["frecuency-edited"],
  mounted() {},
  watch: {},
  data() {
    return {
      check: true,
      options: [
        { value: "ML01", label: "ML01" },
        { value: "ML02", label: "ML02" },
        { value: "ML03", label: "ML03" },
      ],
    };
  },
  methods: {
    toggle() {
      this.check = !this.check;
    },
  },
  setup(props, { emit }) {
    const variablesClient = reactive({ customerId: "" });
    const variablesCompanies = reactive({ route: "" });

    const toast = useToast();

    let closeModal = ref(false);

    let companiesFormatted = ref([]);

    let longitud = ref("");
    let latitud = ref("");
    let clientFullName = ref("");

    const frecuency = reactive({
      idReg: 0,
      cliente: "",
      sucCliente: 0,
      frecuencia: 0,
      proximaVisita: "",
      visitaAnterior: "",
      observaciones: "",
      l: 0,
      m: 0,
      mi: 0,
      j: 0,
      v: 0,
      s: 0,
      d: 0,
      empresa: "",
      ruta: "",
    });

    const weekDays = reactive({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });

    const queryGetClient = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_CLIENT_QUERY, variablesClient)
    );
    const queryGetCompanies = provideApolloClient(apolloClient)(() =>
      useLazyQuery(GET_COMPANIES_QUERY, variablesCompanies)
    );

    const client = computed(
      () => queryGetClient.result.value?.srvUserInfo ?? []
    );
    const companies = computed(
      () => queryGetCompanies.result.value?.srvEmpresa ?? []
    );

    const formatValuesSelect = (data) => {
      const valueFormated = data.value.map((item) => ({
        value: item.empresaID,
        label: item.nombre,
      }));
      return valueFormated;
    };

    watch(
      () => companies,
      (newValue) => {
        companiesFormatted.value = formatValuesSelect(companies);
      },
      { deep: true }
    );

    watch(
      () => props.data,
      (newValue) => {
        Object.keys(frecuency).forEach(
          (item) => (frecuency[item] = newValue[item] || "")
        );
        variablesClient.customerId = newValue.cliente;
        queryGetClient.load();
        weekDays.monday = newValue.l == 1 ? true : false;
        weekDays.tuesday = newValue.m == 1 ? true : false;
        weekDays.wednesday = newValue.mi == 1 ? true : false;
        weekDays.thursday = newValue.j == 1 ? true : false;
        weekDays.friday = newValue.v == 1 ? true : false;
        weekDays.saturday = newValue.s == 1 ? true : false;
        weekDays.sunday = newValue.d == 1 ? true : false;
        frecuency.proximaVisita = formatDate(newValue.proximaVisita);
        frecuency.visitaAnterior = formatDate(newValue.visitaAnterior);
        console.log("frecuency.proximaVisita => ", frecuency.proximaVisita);
        console.log("newValue => ", newValue);
        console.log("newValue.proximaVisita => ", newValue.proximaVisita);
        console.log("newValue.visitaAnterior => ", newValue.visitaAnterior);
      },
      { deep: true }
    );

    const formatDate = (date) => {
      const [ dateSplit, hourFormat ] = date.split(' ');
      const [ day, month, year ] = dateSplit.split('/');
      const dateFormat = `${month}-${day}-${year}`;
      return dateFormat
    }

    watch(
      () => client,
      (newValue) => {
        clientFullName.value = `${newValue.value.nombre} ${newValue.value.apellido}`;
        latitud.value = getCoordenates(newValue.value.coordenadas).latitud;
        longitud.value = getCoordenates(newValue.value.coordenadas).longitud;
        variablesCompanies.route = newValue.value.ruta;
        queryGetCompanies.load();
      },
      { deep: true }
    );

    const getCoordenates = (coordenadas) => {
      const [latitud, longitud] = coordenadas.split(",");
      return { latitud, longitud };
    };

    const { mutate: editFrecuencyMut } = useMutation(
      UPDATE_FRECUENCY,
      () => ({ variables: { frecuenciaCliente: frecuency } })
    );

    const editFrecuency = () => {
      frecuency.l = weekDays.monday ? 1 : 0;
      frecuency.m = weekDays.tuesday ? 1 : 0;
      frecuency.mi = weekDays.wednesday ? 1 : 0;
      frecuency.j = weekDays.thursday ? 1 : 0;
      frecuency.v = weekDays.friday ? 1 : 0;
      frecuency.s = weekDays.saturday ? 1 : 0;
      frecuency.d = weekDays.sunday ? 1 : 0;
      frecuency.frecuencia = +frecuency.frecuencia
      frecuency.sucCliente = +frecuency.sucCliente
      frecuency.idReg = +frecuency.idReg
      editFrecuencyMut().then((response) => {
        if (
          response.data.updateFrecuency.statusCode == 'OK'
        ) {
          toast.success("Frecuencia editada exitosamente", {
            timeout: 2000,
          });
          closeModal.value = true;
        } else {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        }
      });
      emit('frecuency-edited', { route: client.value.ruta })
    };

    const config = ref({
      dateFormat: 'm-d-Y'
    });

    return {
      client,
      longitud,
      latitud,
      clientFullName,
      frecuency,
      weekDays,
      editFrecuency,
      closeModal,
      companiesFormatted,
      config,
    };
  },
};
</script> -->
