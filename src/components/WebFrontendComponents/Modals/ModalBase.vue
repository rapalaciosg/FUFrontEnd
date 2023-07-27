<template>
  <Modal
    :title="title"
    :label="title"
    labelClass="btn-success h-[40px]"
    ref="modal"
  >
  <slot name="modal-body"></slot>
    <!-- <template v-slot:footer>
      <slot name="footer-buttons"></slot>
      <Button text="Cerrar" btnClass="btn-secondary" @click="close()" />
      <Button v-if="isDetailModal === true" text="Guardar" btnClass="btn-success" @click="save()" />
    </template> -->
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
    // isDetailModal: {
    //   type: Boolean,
    //   default: true
    // }
  },
  watch: {
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
      this.$emit('close', true)
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
