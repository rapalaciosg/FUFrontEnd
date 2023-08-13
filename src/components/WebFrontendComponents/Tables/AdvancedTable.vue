<template>
  <div>
    <Card noborder>
      <div class="md:flex justify-between pb-6 md:space-y-0 space-y-3 items-center">
        <h5>{{ title }}</h5>
        <div class="flex space-x-2">
          <InputGroup v-model="searchInput" placeholder="Buscar" type="text" prependIcon="heroicons-outline:search" merged />
          <slot name="button"></slot>
        </div>
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
          externalQuery: searchTerm
        }"
        :select-options="(showSelectOptions) ? selectOptions : {}"
      >
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'isAssociated'" class="flex justify-center">
            <Checkbox v-if="props.row.isAssociated" checked disabled />
            <Checkbox v-else disabled />
          </span>
          <span v-if="props.column.field == 'isDistributor'" class="flex justify-center">
            <Checkbox v-if="props.row.isDistributor" checked disabled />
            <Checkbox v-else disabled />
          </span>
          <span v-if="props.column.field == 'activeCustomerCreation'" class="flex justify-center">
            <Checkbox v-if="props.row.activeCustomerCreation" checked disabled />
            <Checkbox v-else disabled />
          </span>
          <span v-if="props.column.field == 'enabled' || props.column.field == 'active'" class="flex justify-center">
            <img v-if="props.row.enabled || props.row.active" :src= "checkedImg" alt="" class="block object-cover" />
            <img v-if="props.row.enabled === false || props.row.active === false" :src= "disabledImg" alt="" class="block object-cover" />
          </span>
          <span v-if="props.column.field == 'monday'">
            <Icon v-if="!props.row.monday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'tuesday'">
            <Icon v-if="!props.row.tuesday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'wednesday'" class="flex">
            <Icon v-if="!props.row.wednesday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'thursday'" class="flex">
            <Icon v-if="!props.row.thursday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'friday'" class="flex">
            <Icon v-if="!props.row.friday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'saturday'" class="flex">
            <Icon v-if="!props.row.saturday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'sunday'" class="flex">
            <Icon v-if="!props.row.sunday" :icon="'material-symbols:circle'" />
            <Icon v-else :icon="'fluent-emoji-flat:green-circle'" />
          </span>
          <span v-if="props.column.field == 'actions'">
            <Dropdown classMenuItems="w-[140px]">
              <span class="text-xl"
                ><Icon icon="heroicons-outline:dots-vertical"
              /></span>
              <template v-slot:menus>
                <MenuItem v-for="(item, i) in actions" :key="i" @click="showModal(props.row, item.value)">
                  <div
                    :class="`
                  ${
                    item.name === 'delete'
                      ? 'bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white'
                      : 'hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50'
                  }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `"
                  >
                    <span v-if="props.row.enabled && item.value === 'enable/disable'" class="text-base"><Icon :icon="iconDisable" /></span>
                    <span v-else-if="props.row.active && item.value === 'enable/disable'" class="text-base"><Icon :icon="iconDisable" /></span>
                    <span v-else class="text-base"><Icon :icon="item.icon" /></span>
                    <span v-if="props.row.enabled && item.value === 'enable/disable'">Deshabilitar</span>
                    <span v-else-if="props.row.active && item.value === 'enable/disable'">Deshabilitar</span>
                    <span v-else >{{ item.name }}</span>
                  </div>
                </MenuItem>
              </template>
            </Dropdown>
          </span>
        </template>
        <template #pagination-bottom="props">
          <div class="py-4 px-3">
            <Pagination
              :total="total"
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
import Checkbox from "@/components/DashCodeComponents/Checkbox";
import checkedImg from "@/assets/images/all-img/icons8-checked-25.png";
import disabledImg from "@/assets/images/all-img/icons8-disabled-25.png";
import { MenuItem } from "@headlessui/vue";
export default {
  components: {
    Pagination,
    InputGroup,
    Dropdown,
    Icon,
    Card,
    MenuItem,
    Checkbox
  },

  props: {
    headers: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "",
    },
    actions: {
      type: Array,
      default: []
    },
    filter: {
      type: String,
      default: ""
    },
    showSelectOptions: {
      type: Boolean,
      default: true
    }
  },

  emits: ['open-modal'],

  watch: {
    data(newValue) {
      this.total = newValue.length
      let totalPage =  Math.ceil(newValue.length / this.perpage)
      this.pageRange = totalPage
      for (let i = 1; i <= totalPage; i++) {
        this.options.push({ value: `${i}`, label: `${i}` })
      }
    },
    filter(newValue) {
      if (newValue) {
        if (newValue.value === 'enabled') this.searchTerm = 'true'
        else this.searchTerm = 'false'
      } else {
        this.searchTerm = ''
      }
    },
    searchTerm(newValue) {
      this.options = []
      let dataFiltered = []
      let totalPage =  0

      dataFiltered = this.data.filter(x => (newValue === 'true') ? x.enabled : !x.enabled)

      if (dataFiltered.length > 0) {
        this.total = dataFiltered.length
        totalPage = Math.ceil(dataFiltered.length / this.perpage)
      }
      if (newValue === "") {
        this.total = this.data.length
        totalPage = Math.ceil(this.data.length / this.perpage)
      }

      for (let i = 1; i <= totalPage; i++) {
        this.options.push({ value: `${i}`, label: `${i}` })
      }

      this.pageRange = totalPage
    },
    searchInput(newValue) {
      this.searchTerm = newValue
    }
  },

  data() {
    return {
      iconDisable: "material-symbols:error-outline-rounded",
      checkedImg,
      disabledImg,
      current: 1,
      perpage: 10,
      pageRange: 0,
      searchTerm: "",
      searchInput: "",
      options: [],
      total: 0,
      selectOptions: {
        enabled: true,
        selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
        selectioninfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
        disableSelectinfo: true, // disable the select info-500 panel on top
        selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
      }
    };
  },

  methods: {
    showModal(row, action) {
      const payload = {
        row,
        action
      }
      this.$emit('open-modal', { row, action })
    }
  }
};
</script>
<style lang="scss"></style>
