import gql from "graphql-tag";

export const GET_ALL_PRODUCT_CATEGORIES = gql`
  query getProductCategories {
    srvProductCategories {
      productCategoryId
      name
    }
  }
`;
