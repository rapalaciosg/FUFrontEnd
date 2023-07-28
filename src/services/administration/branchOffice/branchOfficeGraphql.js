import gql from "graphql-tag";

export const GET_ALL_BRANCH_OFFICES = gql`
  query getBranchOffices {
    srvBranchOffice {
      companyId
      ruc
      dv
      address
      phone
      email
      provinceId
      branchOfficeId
      branchOfficeName
      active
    }
  }
`;

export const CREATE_BRANCH_OFFICE = gql`
  query getBranchOffices {
    srvBranchOffice {
      companyId
      ruc
      dv
      address
      phone
      email
      provinceId
      branchOfficeId
      branchOfficeName
      active
    }
  }
`;

export const DELETE_BRANCH_OFFICE = gql`
  mutation deleteBranchOfficeMut($id: Int!) {
    deleteBranchOffice(id: $id) {
      statusCode
      message
      idObject
    }
  }
`;
