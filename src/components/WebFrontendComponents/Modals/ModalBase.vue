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
      <Button v-if="isDetailModal === true" text="Guardar" btnClass="btn-success" @click="save()" />
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
  emits: ['save'],
  props: {
    title: {
      type: String,
      default: "",
    },
    closeModal: {
      type: Boolean,
      default: false
    },
    isDetailModal: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    closeModal(newValue) {
      if(newValue === true)
        this.$refs.modal.closeModal()
    }
  },
  methods: {
    save() {
      this.$emit('save')
      //this.$refs.modal.closeModal()
    }
  }
};
</script>
<style lang=""></style>
