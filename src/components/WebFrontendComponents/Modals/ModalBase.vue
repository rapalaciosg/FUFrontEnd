<template>
  <Modal
    :title="title"
    :label="title"
    labelClass="btn-success h-[40px]"
    ref="modal"
    :activeModal="activeModal"
  >
  <slot name="modal-body"></slot>
  </Modal>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import Button from "@/components/DashCodeComponents/Button";
import Modal from "@/components/DashCodeComponents/Modal/Modal";
export default {
  components: {
    Modal,
    Button,
  },
  emits: ['save', 'close'],
  props: {
    title: {
      type: String,
      default: "",
    },
    closeModal: {
      type: Boolean,
      default: false
    },
    activeModal: {
      type: Boolean,
      default: false
    }
    // isDetailModal: {
    //   type: Boolean,
    //   default: true
    // }
  },
  watch: {
    activeModal: {
      handler(newValue, oldValue) {},
      deep: true
    },
    closeModal: {
      handler(newValue, oldValue) {
        this.$refs.modal.closeModal()
        // if(newValue === true)
        //   this.$refs.modal.closeModal()
      },
      deep: true
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.$refs.modal.closeModal()
    },
    save() {
      this.$emit('save')
      //this.$refs.modal.closeModal()
    }
  },
};
</script>
<style lang=""></style>
