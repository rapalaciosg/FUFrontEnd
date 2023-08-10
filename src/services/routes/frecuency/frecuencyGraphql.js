import gql from "graphql-tag";

export const GET_ALL_FREQUENCIES = gql`
  query getFrecuencies {
    srvCustomerFrequency {
      customerFrequencyId
      customer {
        customerId
        name
        lastName
      }
      frequency
      nextVisit
      lasstVisit
      observations
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
    }
  }
`;

export const GET_FREQUENCIES_BY_ROUTE_ID = gql`
  query getFrequencyByRouteId($id: Int!) {
    srvCustomerFrequencyByRouteId(id: $id) {
      customerFrequencyId
      customer {
        customerId
        name
        lastName
      }
      frequency
      nextVisit
      lasstVisit
      observations
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
    }
  }
`;

export const CREATE_FRECUENCY = gql`
  mutation createCustomerFrecuencyMut(
    $inputModel: CustomerFrequencyInputModelInput!
  ) {
    createCustomerFrequency(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_FREQUENCY = gql`
  mutation updateCustomerFrecuencyMut(
    $inputModel: CustomerFrequencyInputModelInput!
  ) {
    updateCustomerFrequency(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
