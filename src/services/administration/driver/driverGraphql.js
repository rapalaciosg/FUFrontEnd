import gql from "graphql-tag";

export const GET_ALL_DRIVERS = gql`
  query getDrivers {
    srvDriver {
      driverId
      name
      lastName
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
      code
      boxCode
      active
      keycloakUserId
      keycloakUser
    }
  }
`;

export const CREATE_DRIVER = gql`
  mutation createDriveMut($inputModel: DriverInputModelInput!) {
    createDrive(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_DRIVER = gql`
  mutation updateDriveMut($inputModel: DriverInputModelInput!) {
    updateDrive(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const ENABLE_DISABLE_DRIVER = gql`
  mutation enableDisableDrive($inputModel: DriverInputModelInput!) {
    updateDrive(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;