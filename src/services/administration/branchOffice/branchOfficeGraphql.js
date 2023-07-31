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
      createdBy
      createdDate
      updatedBy
      updatedDate
      active
    }
  }
`;

export const CREATE_BRANCH_OFFICE = gql`
mutation createBranchOffice(
  $inputModel: BranchOfficeInputModelInput!
) {
  createBranchOffice(inputModel: $inputModel) {
    statusCode
    message
    idObject
  }
}
`;

export const UPDATE_BRANCH_OFFICE = gql`
  mutation updateBranchOfficeMut(
    $inputModel: BranchOfficeInputModelInput!
  ) {
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
