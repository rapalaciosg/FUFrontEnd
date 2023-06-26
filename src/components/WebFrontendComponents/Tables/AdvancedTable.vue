<template>
  <div>
    <Card noborder>
      <div
        class="md:flex justify-between pb-6 md:space-y-0 space-y-3 items-center"
      >
        <h5>{{ title }}</h5>
        <InputGroup
          v-model="searchTerm"
          placeholder="Search"
          type="text"
          prependIcon="heroicons-outline:search"
          merged
        />
      </div>

      <vue-good-table
        :columns="headers"
        styleClass=" vgt-table bordered centered"
        :rows="data"
        :pagination-options="{
          enabled: true,
          perPage: perpage,
        }"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm,
        }"
        :select-options="{
          enabled: true,
          selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
          selectioninfoClass: 'custom-class',
          selectionText: 'rows selected',
          clearSelectionText: 'clear',
          disableSelectinfo: true, // disable the select info-500 panel on top
          selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
        }"
      >
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'product'">
            {{ props.row.product }}
          </span>
          <span v-if="props.column.field == 'distributor'">
            {{ props.row.distributor }}
          </span>
        </template>
        <template #pagination-bottom="props">
          <div class="py-4 px-3">
            <Pagination
              :total="50"
              :current="current"
              :per-page="perpage"
              :pageRange="pageRange"
              @page-changed="current = $event"
              :pageChanged="props.pageChanged"
              :perPageChanged="props.perPageChanged"
              enableSearch
              enableSelect
              :options="options"
            >
              >
            </Pagination>
          </div>
        </template>
      </vue-good-table>
    </Card>
  </div>
</template>
<script>
import Dropdown from "@/components/DashCodeComponents/Dropdown";
import Card from "@/components/DashCodeComponents/Card";
import Icon from "@/components/DashCodeComponents/Icon";
import InputGroup from "@/components/DashCodeComponents/InputGroup";
import Pagination from "@/components/DashCodeComponents/Pagination";
import { MenuItem } from "@headlessui/vue";
export default {
  components: {
    Pagination,
    InputGroup,
    Dropdown,
    Icon,
    Card,
    MenuItem,
  },

  props: {
    headers: {
      type: Array,
      default: []
    },
    data: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      current: 1,
      perpage: 10,
      pageRange: 5,
      searchTerm: "",
      actions: [
        { name: "view", icon: "heroicons-outline:eye", },
        { name: "edit", icon: "heroicons:pencil-square", },
        { name: "delete", icon: "heroicons-outline:trash", },
      ],
      options: [
        { value: "1", label: "1", },
        { value: "3", label: "3", },
        { value: "5", label: "5", },
      ],
      
    };
  },
};
</script>
<style lang="scss"></style>
