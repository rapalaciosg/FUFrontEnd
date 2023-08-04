import gql from "graphql-tag";

export const GET_ALL_DISTRICTS_BY_PROVINCE_ID = gql`
  query getDistrictByProvinceId($id: String!) {
    srvDistrictByProvinceId(id: $id) {
      districtId
      name
      provinceId
    }
  }
`;
