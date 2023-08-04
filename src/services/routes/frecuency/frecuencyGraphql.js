import gql from "graphql-tag";

export const GET_ALL_FRECUENCIES = gql`
  query getFrecuencies {
    srvCustomerFrequency {
      customerFrequencyId
      customerId
      customerName
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

export const GET_FRECUENCIAS = gql`
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

export const UPDATE_FRECUENCY = gql`
  mutation updateFrecuencyMut(
    $frecuenciaCliente: FrequencyResponseModelInput!
  ) {
    updateFrecuency(frecuenciaCliente: $frecuenciaCliente) {
      statusCode
      message
    }
  }
`;
