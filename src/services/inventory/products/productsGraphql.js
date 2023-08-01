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
