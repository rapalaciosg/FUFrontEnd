import gql from "graphql-tag";

export const GET_COMPANIES = gql`
  query getCompanies {
    srvCompanies {
      companyId
      name
      prefix
      address
      provinceId
      companyTypeId
      sequential
    }
  }
`;
