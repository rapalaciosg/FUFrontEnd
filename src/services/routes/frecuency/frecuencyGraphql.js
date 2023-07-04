import gql from "graphql-tag";

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
