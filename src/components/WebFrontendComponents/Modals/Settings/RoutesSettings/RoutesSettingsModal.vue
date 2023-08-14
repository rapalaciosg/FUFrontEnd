<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="configureRoutes">
        <div class="grid grid-cols-1 gap-5 px-4 py-3">
          <Card title="Rutas configuradas por:">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(item, i) in routesByOptions" :key="i">
                <Radio :label="item.label" class="mb-5" v-model="routeBy" :value="item.value"/>
              </div>
            </div>
          </Card>
          <Card title="Nombre rutas por:">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(item, i) in routeNameOptions" :key="i">
                <Radio :label="item.label" class="mb-5" v-model="routeName" :value="item.value"/>
              </div>
            </div>
          </Card>
        </div>
        <div class="px-4 pt-3 pb-1 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn btn-secondary block text-center" @click="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-success block text-center">Guardar</button>
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

import { CREATE_ROUTES_SETTINGS, UPDATE_ROUTES_SETTINGS } from "@/services/settings/routeSettings/routeSettingsGraphql";
import { useMutation,} from "@vue/apollo-composable";

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
  emits: ["routes-updated", "close-modal"],
  data() {
    return {
      routesByOptions: [
        { value: "V", label: "Vehículo" },
        { value: "D", label: "Conductor" },
      ],
    };
  },
  setup(props, { emit }) {

    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    const routeBy = ref("");
    const routeName = ref("");

    const routeNameOptions = ref([]);

    const routeConfiguration = reactive([]);

    // Input model

    const routesSettingsInput = reactive({
      code: "",
      value: "",
    });

    // Initialization function

    const initilize = () => {
      if (props.isConfigured) {
        routeBy.value = props.routesSettings.routeBy.value;
        routeName.value = props.routesSettings.routeName.value;

        routeConfiguration.push(props.routesSettings.routeBy);
        routeConfiguration.push(props.routesSettings.routeName);
      } else {
        routeConfiguration.push({ code: "ROUTE_BY", value: "" });
        routeConfiguration.push({ code: "ROUTE_NAME", value: "" });
      }
      activeModal.value = true;
    }

    // Mounted function

    onMounted(() => initilize())

    // Watchers

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
      },
      { deep: true }
    );

    watch(
      () => routeBy.value,
      (newValue) => {
        routeNameOptions.value = [];
        if (newValue === "V") {
          routeNameOptions.value.push({ value: "VC", label: "Código del vehículo" });
          routeNameOptions.value.push({ value: "VLP", label: "Placa del vehículo" });
        } else {
          routeNameOptions.value.push({ value: "DC", label: "Código del conductor" });
        }
      },
      { deep: true }
    );

    // Apollo mutations

    const { mutate: createRouteSetting } = useMutation(CREATE_ROUTES_SETTINGS, () => ({ variables: { inputModel: routesSettingsInput }}));

    const { mutate: updateRouteSetting } = useMutation(UPDATE_ROUTES_SETTINGS, () => ({ variables: { inputModel: routesSettingsInput }}));

    // Trigger functions

    const configureRoutes = () => {
      if (props.isConfigured) {
        for (let index = 0; index < routeConfiguration.length; index++) {
          routesSettingsInput.code = routeConfiguration[index].code;

          if (index === 0) routesSettingsInput.value = routeBy.value;
          if (index === 1) routesSettingsInput.value = routeName.value;

          updateRouteSetting()
            .then((response) => {
              if (response.data.updateRouteSetting.statusCode === "OK") toast.success("Rutas configuradas exitosamente", { timeout: 2000 });
              else toast.error(response.data.updateRouteSetting.message, { timeout: 2000 });

              // emit("routes-updated");
            })
            .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
        }
      } else {
        for (let index = 0; index < routeConfiguration.length; index++) {
          routesSettingsInput.code = routeConfiguration[index].code;
          
          if (index === 0) routesSettingsInput.value = routeBy.value;
          if (index === 1) routesSettingsInput.value = routeName.value;

          createRouteSetting()
            .then((response) => {
              if (response.data.createRouteSetting.statusCode === "OK") toast.success("Rutas configuradas exitosamente", { timeout: 2000 });
              else toast.error(response.data.createRouteSetting.message, { timeout: 2000 });

              // emit("routes-updated");
            })
            .catch((error) => toast.error("Ha ocurrido un error", { timeout: 2000 }))
        }
      }

      emit("routes-updated");
      closeModal();
    };

    // Close modal function

    const closeModal = () => emit('close-modal');

    // Returning values

    return {
      closeModal,
      activeModal,
      routeBy,
      routeName,
      routeNameOptions,
      configureRoutes,
      routesSettingsInput,
    };
  },
};
</script>
