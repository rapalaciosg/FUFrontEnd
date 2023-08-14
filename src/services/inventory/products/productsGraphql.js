import gql from "graphql-tag";

export const GET_ALL_PRODUCTS = gql`
  query getProducts {
    srvProducts {
      productId
      company {
        companyId
        name
      }
      name
      code
      tag
      basePrice
      productCategory {
        productCategoryId
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COMPANY = gql`
  query getProductsByCompany($id: Int!) {
    srvProductsByCompanyId(id: $id) {
      productId
      company {
        companyId
        name
      }
      name
      code
      tag
      basePrice
      productCategory {
        productCategoryId
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query getProductsByCategory($productCategoryId: Int!) {
    srvProductsByProductCategoryId(productCategoryId: $productCategoryId) {
      productId
      company {
        companyId
        name
      }
      name
      code
      tag
      basePrice
      productCategory {
        productCategoryId
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_NAME = gql`
  query getProductsByName($name: String!) {
    srvProductsByName(name: $name) {
      productId
      company {
        companyId
        name
      }
      name
      code
      tag
      basePrice
      productCategory {
        productCategoryId
        name
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProductMut($inputModel: ProductInputModelInput!) {
    createProduct(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProductMut($inputModel: ProductInputModelInput!) {
    updateProduct(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProductMut($id: Int!) {
    deleteProduct(id: $id) {
      statusCode
      message
      idObject
    }
  }
`;