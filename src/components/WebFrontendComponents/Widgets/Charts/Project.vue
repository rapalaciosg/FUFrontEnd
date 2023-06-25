<template>
  <div class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
    <div
      v-for="(item, i) in statistics"
      :key="i"
      :class="item.bg"
      class="rounded-md p-2 bg-opacity-[0.15] text-center"
    >
      <div
        class="mx-auto h-5 w-5 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4"
        :class="item.text"
      >
        <Icon :icon="item.icon" />
      </div>
      <span
        class="block text-sm text-slate-900 dark:text-white font-medium mb-1"
        >{{ item.title }}</span
      >
      <span
        class="block mb- text-2xl text-slate-900 dark:text-white font-medium"
        >{{ item.count }}</span
      >
    </div>
  </div>
</template>
<script>
import Icon from "@/components/DashCodeComponents/Icon";
export default {
  components: {
    Icon,
  },
  data() {
    return {
      statistics: [
        {
          title: "Clientes atendidos",
          count: "64",
          bg: "bg-info-500",
          text: "text-info-500",
          percent: "25.67% ",
          icon: "heroicons-outline:menu-alt-1",
        },
        {
          title: "Clientes por atender",
          count: "45",
          bg: "bg-warning-500",
          text: "text-warning-500",
          percent: "8.67%",
          icon: "heroicons-outline:chart-pie",
        },
        {
          title: "Clientes incidencia",
          count: "1",
          bg: "bg-primary-500",
          text: "text-primary-500",
          percent: "1.67%  ",
          icon: "heroicons-outline:clock",
        },
        {
          title: "Cliente en curso",
          count: "1",
          bg: "bg-success-500",
          text: "text-success-500",
          percent: "11.67%  ",
          icon: "heroicons-outline:calculator",
        },
      ],
    };
  },
};
</script>
<style lang=""></style>
