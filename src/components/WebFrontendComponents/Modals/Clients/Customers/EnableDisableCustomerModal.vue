<template>
  <modal-base :activeModal="activeModal">
    <template v-slot:modal-body>
      <form @submit.prevent="deleteCustomer">
        <div class="grid grid-cols-1 gap-5">
          <h5>
            ¿{{ action }} este cliente: {{ customer.name }} {{ customer.lastName }} ?
          </h5>
        </div>
        <div
          class="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            class="btn btn-secondary block text-center"
            @click="closeModal()"
          >
            Cerrar
          </button>
          <button type="submit" class="btn btn-success block text-center">
            {{ action }}
          </button>
        </div>
      </form>
    </template>
  </modal-base>
</template>

<script>
import { ref, watch, onMounted, reactive } from "vue";
import ModalBase from "../../ModalBase.vue";
import { useToast } from "vue-toastification";

import moment from 'moment';
import keycloak from "@/security/KeycloakService.js";

import { DELETE_CUSTOMER, UPDATE_CUSTOMER } from "@/services/clients/customers/customersGraphql.js";
import { useMutation } from "@vue/apollo-composable";

export default {
  components: {
    ModalBase,
  },
  props: {
    action: {
      type: String,
      default: "",
    },
    customer: {
      type: Object,
      default: {},
    },
  },
  emits: ["customer-updated"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    // Variables declaration

    const toast = useToast();

    const activeModal = ref(false);

    // Input model

    const customer = reactive({
      customerId: 0,
      routeId: 0,
      code: "",
      name: "",
      lastName: "",
      identityCard: "",
      provinceId: "",
      districtId: "",
      townshipId: "",
      villageId: "",
      address: "",
      houseNumber: "",
      latitude: "",
      longitude: "",
      customerTypeId: 0,
      contactName: "",
      phone: "",
      email: "",
      taxpayerTypeId: 0,
      dv: "",
      createBy: "",
      active: true,
      createdDate: moment(),
    });

    // Function to get and set data from props

    const setData = (props) => {
      customer.customerId = props.customerId;
      customer.routeId = props.route.routeId;
      customer.name = props.name;
      customer.lastName = props.lastName;
      customer.code = props.code;
      customer.address = props.address;
      customer.identityCard = props.identityCard;
      customer.address = props.address;
      customer.provinceId = props.province.provinceId;
      customer.districtId = props.district.districtId;
      customer.townshipId = props.township.townshipId;
      customer.villageId = props.village.villageId;
      customer.houseNumber = props.houseNumber;
      customer.latitude = props.latitude;
      customer.longitude = props.longitude;
      customer.customerTypeId = props.customerType.customerTypeId;
      customer.contactName = props.contactName;
      customer.phone = props.phone;
      customer.email = props.email;
      customer.taxpayerTypeId = props.taxpayerType.taxpayerTypeId;
      customer.dv = props.dv;
      customer.active = props.active;
      customer.createBy = props.createBy;
    }

    // Mounted function

    onMounted(() => {
      activeModal.value = true;
      setData(props.customer);
    });

    // Watchers

    watch(
      () => props.data,
      (newValue) => {
        customer.customerId = newValue.customerId;
        customer.routeId = newValue.routeSelect;
        customer.name = newValue.name;
        customer.lastName = newValue.lastName;
        customer.code = newValue.code;
        customer.address = newValue.address;
        customer.identityCard = newValue.identityCard;
        customer.address = newValue.address;
        customer.provinceId = newValue.provinceSelect;
        customer.districtId = newValue.districtSelect;
        customer.townshipId = newValue.townshipSelect;
        customer.villageId = newValue.villageSelect;
        customer.houseNumber = newValue.houseNumber;
        customer.latitude = newValue.latitude;
        customer.longitude = newValue.longitude;
        customer.customerTypeId = newValue.customerTypeSelect;
        customer.contactName = newValue.contactName;
        customer.phone = newValue.phone;
        customer.email = newValue.email;
        customer.taxpayerTypeId = newValue.taxpayerTypeSelect;
        customer.dv = newValue.dv;
        customer.active = newValue.active;
        customer.createBy = newValue.createBy;
      },
      { deep: true }
    );

    // Apollo mutations

    const { mutate: updateCustomer } = useMutation(UPDATE_CUSTOMER, () => ({
      variables: { inputModel: customer },
    }));

    // Trigger function form

    const deleteCustomer = async () => {
      customer.active = !customer.active;
      customer.updateBy = keycloak.tokenParsed.preferred_username;

      await updateCustomer()
        .then((response) => {
          if (response.data.updateCustomer.statusCode === "OK") toast.success("Cliente actualizado exitosamente", { timeout: 2000 });
          else toast.error(response.data.updateCustomer.message, { timeout: 2000 });

          emit("customer-updated");
        })
        .catch((error) =>
          toast.error("Ha ocurrido un error", { timeout: 2000 })
        );

      closeModal();
    };

    // Close modal function

    const closeModal = () => emit("close-modal");

    // Returning values

    return { closeModal, deleteCustomer, activeModal };
  },
};
</script>
