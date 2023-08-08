<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="configureRoutes">
        <div class="grid grid-cols-1 gap-5 px-4 py-3">
          <Card title="Rutas configuradas por:">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(item, i) in routesByOptions" :key="i">
                <Radio
                  :label="item.label"
                  class="mb-5"
                  v-model="routeBy"
                  :value="item.value"
                />
              </div>
            </div>
          </Card>
          <Card title="Nombre rutas por:">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(item, i) in routeNameOptions" :key="i">
                <Radio
                  :label="item.label"
                  class="mb-5"
                  v-model="routeName"
                  :value="item.value"
                />
              </div>
            </div>
          </Card>
        </div>
        <div
          class="px-4 pt-3 pb-1 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            class="btn btn-secondary block text-center"
            @click="closeModal = !closeModal"
          >
            Cancelar
          </button>
          <button type="submit" class="btn btn-success block text-center">
            Guardar
          </button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import ModalBase from "../../ModalBase.vue";
import Card from "@/components/DashCodeComponents/Card";
import Radio from "@/components/DashCodeComponents/Radio";

import {
  CREATE_ROUTES_SETTINGS,
  UPDATE_ROUTES_SETTINGS,
} from "@/services/settings/routeSettings/routeSettingsGraphql";
import {
  useLazyQuery,
  provideApolloClient,
  useMutation,
} from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    ModalBase,
    Radio,
    Card,
  },
  props: {
    isConfigured: {
      type: Boolean,
      default: false,
    },
    routesSettings: {
      type: Object,
      default: {},
    },
  },
  emits: ["routes-updated"],
  data() {
    return {
      routesByOptions: [
        { value: "V", label: "Vehículo" },
        { value: "D", label: "Conductor" },
      ],
    };
  },
  watch: {},
  methods: {},
  setup(props, { emit }) {
    const toast = useToast();

    let closeModal = ref(false);

    const routeBy = ref("");
    const routeName = ref("");

    const routeNameOptions = ref([]);

    const routeConfiguration = reactive([]);

    const routesSettingsInput = reactive({
      code: "",
      value: "",
    });

    watch(
      () => props.isConfigured,
      (newValue) => {
      },
      { deep: true }
    );

    watch(
      () => props.routesSettings,
      (newValue) => {
        if (props.isConfigured) {
          routeBy.value = newValue.routeBy.value;
          routeName.value = newValue.routeName.value;

          routeConfiguration.push(newValue.routeBy);
          routeConfiguration.push(newValue.routeName);
        } else {
          routeConfiguration.push({ code: "ROUTE_BY", value: "" });
          routeConfiguration.push({ code: "ROUTE_NAME", value: "" });
        }
        console.log("routeConfiguration => ", routeConfiguration);
      },
      { deep: true }
    );

    watch(
      () => routeBy.value,
      (newValue) => {
        routeNameOptions.value = [];
        if (newValue === "V") {
          routeNameOptions.value.push({
            value: "VC",
            label: "Código del vehículo",
          });
          routeNameOptions.value.push({
            value: "VLP",
            label: "Placa del vehículo",
          });
        } else {
          routeNameOptions.value.push({
            value: "DC",
            label: "Código del conductor",
          });
        }
      },
      { deep: true }
    );

    const { mutate: createRouteSetting } = useMutation(
      CREATE_ROUTES_SETTINGS,
      () => ({
        variables: { inputModel: routesSettingsInput },
      })
    );

    const { mutate: updateRouteSetting } = useMutation(
      UPDATE_ROUTES_SETTINGS,
      () => ({
        variables: { inputModel: routesSettingsInput },
      })
    );

    const configureRoutes = () => {
      if (props.isConfigured) {
        console.log('actualizar');
        for (let index = 0; index < routeConfiguration.length; index++) {
          routesSettingsInput.code = routeConfiguration[index].code;

          if (index === 0) routesSettingsInput.value = routeBy.value;
          if (index === 1) routesSettingsInput.value = routeName.value;

          updateRouteSetting()
            .then((response) => {
              emit("routes-updated");
              toast.success("Rutas configuradas exitosamente", {
                timeout: 2000,
              });
            })
            .catch((error) => {
              toast.error("Ha ocurrido un error", {
                timeout: 2000,
              });
            });
        }
      } else {
        console.log('crear');
        for (let index = 0; index < routeConfiguration.length; index++) {
          routesSettingsInput.code = routeConfiguration[index].code;
          
          if (index === 0) routesSettingsInput.value = routeBy.value;
          if (index === 1) routesSettingsInput.value = routeName.value;

          createRouteSetting()
            .then((response) => {
              emit("routes-updated");
              toast.success("Rutas configuradas exitosamente", {
                timeout: 2000,
              });
            })
            .catch((error) => {
              toast.error("Ha ocurrido un error", {
                timeout: 2000,
              });
            });
        }
      }

      closeModal.value = !closeModal.value;
    };

    return {
      closeModal,
      routeBy,
      routeName,
      routeNameOptions,
      configureRoutes,
      routesSettingsInput,
    };
  },
};
</script>
