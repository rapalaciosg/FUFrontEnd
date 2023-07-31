import gql from "graphql-tag";

export const GET_ALL_VEHICLES = gql`
  query getVehicles {
    srvVehicle {
      vehicleId
      name
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
      code
      licensePlate
      description
      active
    }
  }
`;

export const CREATE_VEHICLE = gql`
  mutation createVehicleMut($inputModel: VehicleInputModelInput!) {
    createVehicle(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation updateVehicleMut($inputModel: VehicleInputModelInput!) {
    updateVehicle(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const ENABLE_DISABLE_VEHICLE = gql`
  mutation enableDisableVehicle($inputModel: VehicleInputModelInput!) {
    updateVehicle(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;