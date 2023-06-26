<template>
  <!-- <div class="space-y-5">
      <Card title="Demo map">
        <MapDemo />
      </Card>
    </div> -->
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-4 gap-5">
        <div class="col-span-4">
          <Project />
        </div>
        <!-- <VueSelect :options="options" placeholder="Seleccione un valor" />
          <VueSelect :options="options" placeholder="Seleccione un valor" />
          <VueSelect :options="options" placeholder="Seleccione un valor" />
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" /> -->
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
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";
export default {
  components: {
    Card,
    MapDemo,
    TaskList,
    VueSelect,
    Button,
    Project,
  },
};
</script>
