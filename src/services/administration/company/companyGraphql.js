import gql from "graphql-tag";

export const GET_ALL_COMPANIES = gql`
  query getCompanies {
    srvCompanies {
      companyId
      name
      prefix
      address
      province {
        provinceId
        name
      }
      companyType {
        companyTypeId
        name
      }
      sequential
      isDistributor
    }
  }
`;

export const GET_ALL_COMPANIES_BY_PROVINCE = gql`
  query getCompaniesByProvince($id: String!) {
    srvCompaniesByProvinceId(id: $id) {
      companyId
      name
      prefix
      address
      province {
        provinceId
        name
      }
      companyType {
        companyTypeId
        name
      }
      sequential
      isDistributor
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation createCompanyMut($inputModel: CompanyInputModelInput!) {
    createCompany(inputModel: $inputModel) {
      message
      statusCode
      idObject
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompanyMut($inputModel: CompanyInputModelInput!) {
    updateCompany(inputModel: $inputModel) {
      message
      statusCode
      idObject
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation deleteCompanyMut($id: Int!) {
    deleteCompany(id: $id) {
      message
      statusCode
      idObject
    }
  }
`;
