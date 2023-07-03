<template>
  <Modal
    :title="title"
    :label="title"
    labelClass="btn-success h-[40px]"
    ref="modal"
  >
  <slot name="modal-body"></slot>
    <template v-slot:footer>
      <Button
        text="Cerrar"
        btnClass="btn-secondary"
        @click="$refs.modal.closeModal()"
      />
      <Button text="Guardar" btnClass="btn-success" />
    </template>
  </Modal>
</template>
<script>
import Button from "@/components/DashCodeComponents/Button";
import Modal from "@/components/DashCodeComponents/Modal/Modal";
export default {
  components: {
    Modal,
    Button,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang=""></style>
