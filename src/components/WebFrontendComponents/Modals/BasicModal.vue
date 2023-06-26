<template>
  <Modal
    title="Basic Modal"
    :label="title"
    labelClass="btn-success h-[40px]"
    ref="modal1"
  >
    <h4 class="font-medium text-lg mb-3 text-slate-900">
      Lorem ipsum dolor sit.
    </h4>
    <div class="text-base text-slate-600 dark:text-slate-300">
      Oat cake ice cream candy chocolate cake chocolate cake cotton candy dragée
      apple pie. Brownie carrot cake candy canes bonbon fruitcake topping
      halvah. Cake sweet roll cake cheesecake cookie chocolate cake liquorice.
    </div>
    <template v-slot:footer>
      <Button
        text="Accept"
        btnClass="btn-success "
        @click="$refs.modal1.closeModal()"
      />
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
      default: ""
    }
  },
};
</script>
<style lang=""></style>
