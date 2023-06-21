<template>
  <div class="space-y-5">
    <Card title="Demo map">
      <MapDemo />
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card";
import MapDemo from "./Map/MapDemo.vue";

export default {
  components: {
    Card,
    MapDemo
  }
}
</script>