import gql from "graphql-tag";

export const GET_ALL_PROVINCES = gql`
  query getProvinces {
    srvProvince {
      name
      provinceId
    }
  }
`;
