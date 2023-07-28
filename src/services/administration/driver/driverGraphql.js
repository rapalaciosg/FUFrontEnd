import gql from "graphql-tag";

export const GET_ALL_DRIVERS = gql`
  query getDrivers {
    srvDriver {
      driverId
      name
      lastName
      branchOfficeId
      code
      boxCode
      active
      keycloakUserId
      keycloakUser
    }
  }
`;
