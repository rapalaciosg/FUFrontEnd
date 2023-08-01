import gql from "graphql-tag";

export const GET_ALL_PRODUCTS = gql`
  query getProducts {
    srvProducts {
      productId
      company {
        companyId
        name
      }
      code
      tag
      basePrice
      stock
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