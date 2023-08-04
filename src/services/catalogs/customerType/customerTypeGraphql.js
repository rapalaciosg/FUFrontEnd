import gql from "graphql-tag";

export const GET_ALL_CUSTOMER_TYPE = gql`
  query getCustomerType {
    srvCustomerTypes {
      customerTypeId
      name
    }
  }
`;
