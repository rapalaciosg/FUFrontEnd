import gql from "graphql-tag";

export const GET_ALL_SPECIAL_PRICES = gql`
  query getSpecialPrices {
    srvSpecialPrice {
      specialPriceId
      customer {
        customerId
        name
        lastName
      }
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
      product {
        productId
        code
        name
      }
      adjustment
    }
  }
`;

export const CREATE_SPECIAL_PRICE = gql`
  mutation createSpecialPriceMut($inputModel: SpecialPriceInputModelInput!) {
    createSpecialPrice(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_SPECIAL_PRICE = gql`
  mutation updateSpecialPriceMut($inputModel: SpecialPriceInputModelInput!) {
    updateSpecialPrice(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const DELETE_SPECIAL_PRICE = gql`
  mutation deleteSpecialPriceMut($id: Int!) {
    deleteSpecialPrice(id: $id) {
      statusCode
      message
      idObject
    }
  }
`;