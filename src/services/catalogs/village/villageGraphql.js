import gql from "graphql-tag";

export const GET_ALL_VILLAGE_BY_TOWNSHIP_ID = gql`
  query getVillageByTownshipId($id: String!) {
    srvVillageByTownshipId(id: $id) {
      villageId
      name
      townshipId
    }
  }
`;
