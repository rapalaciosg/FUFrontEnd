<template>
  <div class="space-y-5">
    <Card title="Dashboard Rutas">
      <div class="grid grid-cols-3 gap-5">
        <VueSelect :options="options" placeholder="Proyecto" />
        <VueSelect :options="options" placeholder="Producto" />
        <div class="grid grid-cols-2 gap-x-5">
          <Button class="h-[40px]" text="Buscar" btnClass="btn-warning" />
          <Button class="h-[40px]" text="Limpiar" btnClass="btn-info" />
        </div>
      </div>
    </Card>
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-5">
      <div class="lg:col-span-5">
        <AdvancedTable />
      </div>
      <div class="lg:col-span-2">
        <Card title="trends calcultation">
          <div class="legend-ring3">
            <apexchart
              type="pie"
              height="335"
              :options="
                this.$store.themeSettingsStore.isDark
                  ? pieChartDark.chartOptions
                  : pieChart.chartOptions
              "
              :series="pieChart.series"
            />
          </div>
        </Card>
      </div>
    </div>
    <AdvancedTable />
  </div>
</template>
<script>
import Card from "@/components/Card";
import BasicModal from "./Dashboard/Modal/BasicModal.vue";
import VueSelect from "@/components/Select/VueSelect";
import Button from "@/components/Button";
import AdvancedTable from "./ComponentsWebFrontend/Tables/AdvancedTable.vue";
import {
  pieChart,
  pieChartDark,
  stacked,
  stackedDark,
} from "./Analytics-Components/data.js";
import SelectMonth from "./Analytics-Components/SelectMonth";
export default {
  components: {
    Card,
    BasicModal,
    VueSelect,
    Button,
    AdvancedTable,
    SelectMonth,
  },
  data() {
    return {
      pieChart,
      pieChartDark,
      stacked,
      stackedDark,
      options: [
        {
          value: "option1",
          label: "Option 1",
        },
        {
          value: "option2",
          label: "Option 2",
        },
        {
          value: "option3",
          label: "Option 3",
        },
      ],
    }
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