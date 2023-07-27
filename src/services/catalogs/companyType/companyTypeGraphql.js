import gql from "graphql-tag";

export const GET_ALL_COMPANY_TYPES = gql`
  query getCompanyTypes {
    srvCompanyTypes {
      companyTypeId
      name
    }
  }
`;
