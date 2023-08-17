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
      active
    }
  }
`;

export const GET_ALL_SPECIAL_PRICES_BY_CUSTOMER = gql`
  query getSpecialPricesByCustomer($customerId: Int!) {
    srvSpecialPriceByCustomerId(customerId: $customerId) {
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
      active
    }
  }
`;

export const GET_ALL_SPECIAL_PRICES_BY_BRANCH_OFFICE = gql`
  query getSpecialPricesByBranchOffice($branchId: Int!) {
    srvSpecialPriceByBranchId(branchId: $branchId) {
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
      active
    }
  }
`;

export const GET_ALL_SPECIAL_PRICES_BY_PRODUCT = gql`
  query getSpecialPricesByProduct($productId: Int!) {
    srvSpecialPriceByProductId(productId: $productId) {
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
      active
    }
  }
`;

export const GET_ALL_SPECIAL_PRICES_BY_ROUTE_AND_COMPANY = gql`
  query getSpecialPricesByRouteAndCompany($routeId: Int!, $companyId: Int!) {
    srvSpecialPriceByRouteIdAndCompanyId(routeId: $routeId, companyId: $companyId) {
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
      active
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