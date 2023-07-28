import gql from "graphql-tag";

export const GET_ALL_VEHICLES = gql`
  query getVehicles {
    srvVehicle {
      vehicleId
      name
      branchOfficeId
      code
      licensePlate
      description
    }
  }
`;

export const CREATE_VEHICLE = gql`
  query getVehicles {
    srvVehicle {
      vehicleId
      name
      branchOfficeId
      code
      licensePlate
      description
    }
  }
`;
