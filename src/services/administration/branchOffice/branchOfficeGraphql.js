import gql from "graphql-tag";

export const GET_BRANCH_OFFICES_BY_USER = gql`
  query getBranchOfficesByUser($userId: String!) {
    srvBranchOfficeByUserId(userId: $userId) {
      company {
        companyId
        name
      }
      ruc
      dv
      address
      phone
      email
      province {
        provinceId
        name
      }
      branchOfficeId
      branchOfficeName
      createdBy
      createdDate
      updateBy
      updateDate
      active
    }
  }
`;

export const GET_ALL_BRANCH_OFFICES = gql`
  query getBranchOffices {
    srvBranchOffice {
      company {
        companyId
        name
      }
      ruc
      dv
      address
      phone
      email
      province {
        provinceId
        name
      }
      branchOfficeId
      branchOfficeName
      createdBy
      createdDate
      updateBy
      updateDate
      active
    }
  }
`;

export const GET_BRANCH_OFFICES_BY_LIST_OF_COMPANIES = gql`
  query getBranchOfficesByListOfCompanies($ids: [Int!]!) {
    srvBranchOfficeByListCompany(ids: $ids) {
      branchOfficeId
      branchOfficeName
      ruc
      dv
      address
      phone
      email
      createdBy
      createdDate
      updateBy
      updateDate
      active
      company {
        companyId
        name
      }
      provinceId
      province {
        provinceId
        name
      }
    }
  }
`;

export const GET_BRANCH_OFFICES_BY_COMPANY = gql`
  query getBranchOfficesByCompany($id: Int!) {
    srvBranchOfficeByCompany(id: $id) {
      company {
        companyId
        name
      }
      ruc
      dv
      address
      phone
      email
      province {
        provinceId
        name
      }
      branchOfficeId
      branchOfficeName
      createdBy
      createdDate
      updateBy
      updateDate
      active
    }
  }
`;

export const GET_BRANCH_OFFICES_BY_RUC = gql`
  query getBranchOfficesByRuc($ruc: String!) {
    srvBranchOfficeRUC(ruc: $ruc) {
      company {
        companyId
        name
      }
      ruc
      dv
      address
      phone
      email
      province {
        provinceId
        name
      }
      branchOfficeId
      branchOfficeName
      createdBy
      createdDate
      updateBy
      updateDate
      active
    }
  }
`;

export const CREATE_BRANCH_OFFICE = gql`
  mutation createBranchOffice($inputModel: BranchOfficeInputModelInput!) {
    createBranchOffice(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_BRANCH_OFFICE = gql`
  mutation updateBranchOfficeMut($inputModel: BranchOfficeInputModelInput!) {
    updateBranchOffice(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const ENABLE_DISABLE_BRANCH_OFFICE = gql`
  mutation enableDisableBranchOffice(
    $inputModel: BranchOfficeInputModelInput!
  ) {
    updateBranchOffice(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
