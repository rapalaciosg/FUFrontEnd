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

export const GET_FREQUENCIAS = gql`
  query getFrecuenciaRutas($route: String!) {
    srvFrecuenciaRuta(route: $route) {
      idReg
      cliente
      sucCliente
      frecuencia
      proximaVisita
      visitaAnterior
      observaciones
      l
      m
      mi
      j
      v
      s
      d
      empresa
      ruta
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

export const UPDATE_FREQUENCY = gql`
  mutation updateFrecuencyMut(
    $frecuenciaCliente: FrequencyResponseModelInput!
  ) {
    updateFrecuency(frecuenciaCliente: $frecuenciaCliente) {
      statusCode
      message
    }
  }
`;
