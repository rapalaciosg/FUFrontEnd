<template>
  <div>
    <Card title="Dashboard">
      <BasicModal />
    </Card>
  </div>
</template>
<script>
import Card from "@/components/Card";
import BasicModal from "./Dashboard/Modal/BasicModal.vue";
export default {
  components: {
    Card,
    BasicModal
  }
};
</script>
<style lang="scss">
  .modal-groups {
    @apply flex items-center flex-wrap justify-start;
    > button {
      @apply mr-3 mb-3;
    }
  }
</style>