import gql from "graphql-tag";

export const GET_ALL_TAX_PAYER_TYPE = gql`
  query getTaxPayerType {
    srvTaxpayerTypes {
      taxpayerTypeId
      name
    }
  }
`;
