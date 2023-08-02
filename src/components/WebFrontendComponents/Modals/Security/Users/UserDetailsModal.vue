<template>
  <modal-base :closeModal="closeModal">
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5 px-4 py-6">
        <p class="font-medium">Nombre de usuario:</p>
        <p>{{ data.username }}</p>
        <p class="font-medium">Nombre:</p>
        <p>{{ data.firstName }}</p>
        <p class="font-medium">Apellido:</p>
        <p>{{ data.lastName }}</p>
        <p class="font-medium">Correo:</p>
        <p>{{ data.email }}</p>
        <p class="font-medium">Roles:</p>
        <p>{{ showArrayFormatted(userGroupsFormatted) }}</p>
        <p class="font-medium">Estado:</p>
        <span class="grid grid-cols-2 gap-5">
          <div v-if="data.enabled" class="grid grid-cols-2 gap-5">
            <img :src="checkedImg" alt="" class="block object-cover" />
          </div>
          <div v-else class="grid grid-cols-2 gap-5">
            <img :src="disabledImg" alt="" class="block object-cover" />
          </div>
        </span>
      </div>
      <div
        class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
      >
        <button
          class="btn btn-secondary block text-center"
          @click="closeModal = !closeModal"
        >
          Cerrar
        </button>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { ref } from "vue";
import ModalBase from "../../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import checkedImg from "@/assets/images/all-img/icons8-checked-25.png";
import disabledImg from "@/assets/images/all-img/icons8-disabled-25.png";
import userAdministrationService from "@/services/keycloak/userAdministrationService";
import keycloak from "@/security/KeycloakService.js";

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
  emits: [],
  data() {
    return {
      checkedImg,
      disabledImg,
      userGroups: [],
      userGroupsFormatted: []
    };
  },
  watch: {
    data(newValue) {
      this.getUserGroups(keycloak.token, newValue.id)
    },
    userGroups(newValue) {
      this.userGroupsFormatted = newValue.map(item => item.name)
    }
  },
  methods: {
    getUserGroups(token, userId) {
      userAdministrationService
        .getUserGroups(token, userId)
        .then((response) => {
          this.userGroups = response.data;
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error", {
            timeout: 2000,
          });
        });
    },
    showArrayFormatted(array) {
      let itemName = ''
      for (let index = 0; index < array.length; index++) {
        if (index == (array.length - 1)) {
            itemName += array[index]
        } else {
            itemName += array[index] + ', '
        }
      }
      return itemName
    }
  },
  setup(props, { emit }) {

    let closeModal = ref(false);

    return { closeModal };
  },
};
</script>
