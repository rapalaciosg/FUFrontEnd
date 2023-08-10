import gql from "graphql-tag";

export const GET_VEHICLE_DRIVER_ASOCIATION = gql`
  query getVehicleDriver {
    srvVehicleDriver {
      driver {
        driverId
        code
        name
        lastName
      }
      vehicle {
        vehicleId
        code
        licensePlate
      }
    }
  }
`;

export const CREATE_VEHICLE_DRIVER = gql`
  mutation createVehicleDriverMut($inputModel: VehicleDriverInputModelInput!) {
    createVehicleDriver(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const DELETE_VEHICLE_DRIVER = gql`
  mutation deleteVehicleDriverMut($inputModel: VehicleDriverInputModelInput!) {
    deleteVehicleDriver(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
