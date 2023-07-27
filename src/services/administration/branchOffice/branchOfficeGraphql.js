import gql from "graphql-tag";

export const GET_BRANCH_OFFICE = gql`
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
      active
    }
  }
`;
