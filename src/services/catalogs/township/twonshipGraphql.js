import gql from "graphql-tag";

export const GET_ALL_TOWNSHIP_BY_DISTRICT_ID = gql`
  query getTownshipByDistrictId($id: String!) {
    srvTownshipByDistrictId(id: $id) {
      townshipId
      name
      districtId
    }
  }
`;
