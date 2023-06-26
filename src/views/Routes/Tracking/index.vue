<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-4 gap-5">
        <div class="col-span-4">
          <Project />
        </div>
      </div>
    </Card>
    <div class="grid grid-cols-1 lg:grid-cols-8 gap-5">
      <div class="lg:col-span-2">
        <TaskList title="Rutas" />
      </div>
      <div class="lg:col-span-6">
        <Card>
          <MapDemo />
        </Card>
        <!-- <MapDemo /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Card from "@/components/DashCodeComponents/Card";
import MapDemo from "./MapDemo.vue";
import TaskList from "@/components/WebFrontendComponents/Lists/TaskList.vue";
import Project from "@/components/WebFrontendComponents/Widgets/Charts/Project.vue";
export default {
  components: {
    Card,
    MapDemo,
    TaskList,
    Project,
  },
};
</script>