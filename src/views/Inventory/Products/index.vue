<template>
  <div class="space-y-5">
    <Card>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <VueSelect :options="filters" placeholder="Seleccione una tipo de filtro" v-model="filterBy" :clearable="(filterBy) ? true : false"/>
        <VueSelect :options="filtersOptions" :placeholder="'Seleccione una opción'" v-model="filterValue" :clearable="(filterValue) ? true : false" :disabled="(filterBy) ? false : true"/>
        <div class="grid grid-cols-2 gap-x-5">
          <download-excel class="btn-info rounded pt-2 text-center" :data="productsList" :fields="headersProductsListExport" name="filename.xls">Exportar</download-excel>
        </div>
      </div>
    </Card>
    <AdvancedTable title="Listado de productos" :headers="headersProductsTable" :data="productsList" :actions="actions" :showSelectOptions="false" @open-modal="toggleModal"
    >
      <template v-slot:button>
        <Button class="h-[40px]" text="Crear producto" btnClass="btn-success" @click="toggleModal()"/>
      </template>
    </AdvancedTable>
    <DetailsProductsModal v-if="isModalDetailsOpen" title="Detalles de producto" :data="productsDetails" @close-modal="isModalDetailsOpen = false"/>
    <CreateProductModal v-if="isModalCreateOpen" title="Crear producto" @product-created="loadProducts()" @close-modal="isModalCreateOpen = false"/>
    <EditProductModal v-if="isModalEditOpen" title="Editar producto" :data="productsDetails" @close-modal="isModalEditOpen = false" @product-updated="loadProducts()"/>
    <DeleteProductModal v-if="isModalDeleteOpen" title="Eliminar compañia" :product="productsDetails" @close-modal="isModalDeleteOpen = false" @product-deleted="loadProducts()"/>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, watch } from "vue";

import AdvancedTable from "@/components/WebFrontendComponents/Tables/AdvancedTable.vue";
import Card from "@/components/DashCodeComponents/Card";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";
import Button from "@/components/DashCodeComponents/Button";

import { headersProductsTable } from "@/constant/inventory/products/constantProducts.js";

import DetailsProductsModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DetailsProductsModal.vue";
import CreateProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/CreateProductModal.vue";
import EditProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/EditProductModal.vue";
import DeleteProductModal from "@/components/WebFrontendComponents/Modals/Inventory/Products/DeleteProductModal.vue";

import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_COMPANY, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS_BY_NAME } from "@/services/inventory/products/productsGraphql.js";
import { GET_ALL_PRODUCT_CATEGORIES } from "@/services/inventory/productCategories/productCategoriesGraphql.js";
import { GET_ALL_COMPANIES } from "@/services/administration/company/companyGraphql.js";

import { useLazyQuery, provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/main.js";

export default {
  components: {
    AdvancedTable,
    Button,
    Card,
    VueSelect,
    CreateProductModal,
    DetailsProductsModal,
    DeleteProductModal,
    EditProductModal,
  },
  data() {
    return {
      headersProductsTable,
      actions: [
        { name: "Ver detalles", icon: "heroicons:eye", value: "details" },
        { name: "Editar", icon: "heroicons:pencil-square", value: "edit" },
        { name: "Eliminar", icon: "heroicons:trash", value: "delete" },
      ],
      filters: [
        { label: 'Compañía', value: 'company' },
        { label: 'Categoría', value: 'category' },
        { label: 'Nombre de producto', value: 'name' },
      ]
    };
  },
  setup(props, {emit}) {

    // Variables declaration

    let productsDetails = ref({});

    let isModalCreateOpen = ref(false);
    let isModalEditOpen = ref(false);
    let isModalDetailsOpen = ref(false);
    let isModalDeleteOpen = ref(false);

    let headersProductsListExport = ref({});

    let filterBy = ref(null);
    let filterValue = ref(null);

    let filtersOptions = ref([]);

    let companySelect = ref([]);
    let categorySelect = ref([]);
    let nameSelect = ref([]);

    let listProductsByCompany = ref([]);
    let listProductsByCategory = ref([]);
    let listProductsByName = ref([]);

    let productsList = ref([]);

    // Apollo variables

    const variablesProductsByCompany = reactive({ id: 0 });
    const variablesProductsByCategory = reactive({ productCategoryId: 0 });
    const variablesProductsByName = reactive({ name: "" });

    // Apollo queries initialization

    const queryGetProducts = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PRODUCTS));

    const queryGetProductCategories = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_PRODUCT_CATEGORIES));

    const queryGetCompanies = provideApolloClient(apolloClient)(() => useLazyQuery(GET_ALL_COMPANIES));

    const queryGetProductsByCompany = provideApolloClient(apolloClient)(() => useLazyQuery(GET_PRODUCTS_BY_COMPANY, variablesProductsByCompany));

    const queryGetProductsByCategory = provideApolloClient(apolloClient)(() => useLazyQuery(GET_PRODUCTS_BY_CATEGORY, variablesProductsByCategory));

    const queryGetProductsByName = provideApolloClient(apolloClient)(() => useLazyQuery(GET_PRODUCTS_BY_NAME, variablesProductsByName));

    // Apollo fetching data

    const companies = computed(() => queryGetCompanies.result.value?.srvCompanies ?? []);

    const productCategories = computed(() => queryGetProductCategories.result.value?.srvProductCategories ?? []);

    const products = computed(() => queryGetProducts.result.value?.srvProducts ?? []);

    const productsByCompany = computed(() => queryGetProductsByCompany.result.value?.srvProductsByCompanyId ?? []);

    const productsByCategory = computed(() => queryGetProductsByCategory.result.value?.srvProductsByProductCategoryId ?? []);

    const productsByName = computed(() => queryGetProductsByName.result.value?.srvProductsByName ?? []);

    // Apollo lazy functions

    const loadProducts = () => queryGetProducts.load() || queryGetProducts.refetch();

    const loadProductCategories = () => queryGetProductCategories.load() || queryGetProductCategories.refetch();

    const loadCompanies = () => queryGetCompanies.load() || queryGetCompanies.refetch();

    const loadProductsByCompany = () => queryGetProductsByCompany.load() || queryGetProductsByCompany.refetch();

    const loadProductsByCategory = () => queryGetProductsByCategory.load() || queryGetProductsByCategory.refetch();

    const loadProductsByName = () => queryGetProductsByName.load() || queryGetProductsByName.refetch();

    // Mounted function

    onMounted(() => {
      loadProducts();
      loadProductCategories();
      loadCompanies();
      headersProductsListExport.value = formatHeadersListExport(headersProductsTable);
    });

    // Watchers

    watch(() => products.value, (newValue) => {
      nameSelect.value = formatNameSelect(newValue);
      productsList.value = newValue;
    }, { deep: true });

    watch(() => companies.value, (newValue) => { companySelect.value = formatCompanySelect(newValue) }, { deep: true });

    watch(() => productCategories.value, (newValue) => { categorySelect.value = formatCategorySelect(newValue) }, { deep: true });

    watch(() => filterBy.value, (newValue) => {
      filterValue.value = null;

      if (newValue && newValue.value === 'company') filtersOptions.value = companySelect.value;
      else if (newValue && newValue.value === 'category') filtersOptions.value = categorySelect.value;
      else filtersOptions.value = nameSelect.value;
    }, { deep: true });

    watch(() => filterValue.value, (newValue) => {
      if (newValue && filterBy.value?.value === 'company') {
        variablesProductsByCompany.id = newValue.value;
        loadProductsByCompany();
        productsList.value = productsByCompany.value;
      } else if (newValue && filterBy.value?.value === 'category') {
        variablesProductsByCategory.productCategoryId = newValue.value;
        loadProductsByCategory();
        productsList.value = productsByCategory.value;
      } else if (newValue && filterBy.value?.value === 'name') {
        variablesProductsByName.name = newValue.value;
        loadProductsByName();
        productsList.value = productsByCategory.value;
      } else if (!newValue) {
        productsList.value = products.value;
      };
    }, { deep: true });

    watch(() => productsByCompany.value, (newValue) => {
      listProductsByCompany.value = newValue;
      productsList.value = listProductsByCompany.value;
    }, { deep: true });

    watch(() => productsByCategory.value, (newValue) => {
      listProductsByCategory.value = newValue;
      productsList.value = listProductsByCategory.value;
    }, { deep: true });

    watch(() => productsByName.value, (newValue) => {
      listProductsByName.value = newValue;
      productsList.value = listProductsByName.value;
    }, { deep: true });

    // Format functions

    const formatHeadersListExport = (data) => {
      let array = new Map();
      for (let index = 0; index < data.length; index++) {
        array.set(data[index].label, data[index].field);
      }
      let valueFormatted = Array.from(array).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

      delete valueFormatted.Acciones;

      return valueFormatted;
    }

    const formatCompanySelect = (data) => data.map((item) => ({ value: item.companyId, label: item.name }));

    const formatCategorySelect = (data) => data.map((item) => ({ value: item.productCategoryId, label: item.name }));

    const formatNameSelect = (data) => data.map((item) => ({ value: item.name, label: item.name }));

    // Toggle modals

    const toggleModal = (value) => {
      if (value) {
        productsDetails.value = value.row;

        productsDetails.value['companySelect'] = { value: value.row.company.companyId, label: value.row.company.name };

        productsDetails.value['productCategorySelect'] = { value: value.row.productCategory.productCategoryId, label: value.row.productCategory.name };

        if (value.action === "edit") isModalEditOpen.value = true;

        if (value.action === "details") isModalDetailsOpen.value = true;

        if (value.action === "delete") isModalDeleteOpen.value = true;
      } else {
        isModalCreateOpen.value = true;
      }
    };

    // Returning values

    return {
      toggleModal,
      loadProducts,
      productsDetails,
      isModalCreateOpen,
      isModalEditOpen,
      isModalDetailsOpen,
      isModalDeleteOpen,
      filterBy,
      filterValue,
      filtersOptions,
      productsList,
      headersProductsListExport,
    };
  },
};
</script>
<style></style>
