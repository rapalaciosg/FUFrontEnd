<template>
  <Card :title="title">
    <template #header>
      <DropEvent />
    </template>
    <Accordion :items="items" />
    <!-- <ul class="divide-y divide-slate-100 dark:divide-slate-700 -mx-6 -mb-6">
      <li
        class="flex items-center px-6 space-x-4 py-4 rtl:space-x-reverse"
        v-for="item in TodoList"
        :key="item.id"
      >
        <div class="flex-none flex space-x-2 items-center rtl:space-x-reverse">
          <Checkbox v-model="item.isDone" />
          <div
            class="h-8 w-8 rounded-full text-white"
            :class="item.isDone ? ' opacity-20' : ' opacity-100'"
          >
            <img
              :src="item.image"
              alt=""
              class="block w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div
          class="flex-1 flex"
          :class="item.isDone ? 'line-through dark:text-white' : ''"
        >
          <span class="flex-1 text-sm text-slate-600 dark:text-slate-300">
            {{ item.title.slice(0, 20) + "..." }}</span
          >
          <span
            class="flex-none space-x-2 text-base text-secondary-500 rtl:space-x-reverse"
          >
            <button type="button" v-if="item.isDone === false">
              <Icon icon="heroicons-outline:pencil-alt" />
            </button>
            <button
              type="button"
              @click="removeTodo(item.id)"
              class="transition duration-150 hover:text-danger-500"
            >
              <Icon icon="heroicons-outline:trash" />
            </button>
          </span>
        </div>
      </li>
    </ul> -->
  </Card>
</template>
<script>
import Card from "@/components/DashCodeComponents/Card";
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import Icon from "@/components/DashCodeComponents/Icon";
import DropEvent from "@/components/WebFrontendComponents/Analytics-Component/DropEvent.vue";
import Accordion from "@/components/DashCodeComponents/Accordion";
import { TodoList } from "../../../constant/data.js";
export default {
  components: {
    Card,
    Checkbox,
    Icon,
    DropEvent,
    Accordion,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      TodoList,
      items: [
        {
          title: "TML1",
          content:
            "Cliente test",
        },
        {
          title: "TML2",
          content:
            "Cliente test",
        },
        {
          title: "TML3",
          content:
            "Cliente test",
        },
        {
          title: "TML4",
          content:
            "Cliente test",
        },
        {
          title: "TML5",
          content:
            "Cliente test",
        },
        {
          title: "TML6",
          content:
            "Cliente test",
        },
      ],
    };
  },
  methods: {
    removeTodo(i) {
      this.TodoList = this.TodoList.filter((todo) => {
        return todo.id !== i;
      });
    },
  },
};
</script>
