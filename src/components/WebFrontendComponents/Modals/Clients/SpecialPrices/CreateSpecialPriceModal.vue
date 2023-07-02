<template>
  <modal-base>
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <h1>Create special price</h1>
      </div>
    </template>
  </modal-base>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from "vue";
import ModalBase from "../../ModalBase.vue";

export default {
  components: {
    ModalBase,
  }
};
</script>
