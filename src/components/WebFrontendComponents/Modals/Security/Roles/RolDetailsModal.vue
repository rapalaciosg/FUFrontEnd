<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 py-6">
        <p class="font-medium">Nombre del rol:</p>
        <p>{{ data.name }}</p>
        <p class="font-medium">Permisos:</p>
        <p>{{ showArrayFormatted(rolesList) }}</p>
      </div>
      <div class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
        <button class="btn btn-secondary block text-center" @click="closeModal = !closeModal">Cerrar</button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref } from "vue";
import ModalBase from "../../ModalBase.vue";
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import roleAdministrationService from "@/services/keycloak/roleAdministrationService";
import keycloak from "@/security/KeycloakService.js";

export default {
  components: {
    ModalBase
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  emits: [],
  data() {
    return {
      rolDetails: {},
      rolesList: []
    };
  },
  watch: {
    data(newValue) {
      this.getRolDetails(keycloak.token, newValue.id);
    },
    rolDetails(newValue) {
      this.rolesList = newValue.realmRoles
    },
  },
  methods: {
    getRolDetails(token, rolId) {
        roleAdministrationService
        .getRolDetails(token, rolId)
        .then((response) => {
          this.rolDetails = response.data;
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });
    },
    showArrayFormatted(array) {
      let itemName = "";
      for (let index = 0; index < array.length; index++) {
        if (index == array.length - 1) {
          itemName += array[index];
        } else {
          itemName += array[index] + ", ";
        }
      }
      return itemName;
    },
  },
  setup(props, { emit }) {
    let closeModal = ref(false);

    return { closeModal };
  },
};
</script>
