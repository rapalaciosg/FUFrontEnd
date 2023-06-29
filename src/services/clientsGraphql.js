import gql from "graphql-tag";

export const ALL_CLIENTS_QUERY = gql`
  query getAllClients($truckId: String!) {
    srvLoadClientsAll(truckId: $truckId) {
      ruta
      clienteID
      sucursal
      nombreCliente
      direccionCliente
      rutaID
      precio
      precioAdd
      tipoNegocio
      provincia
      distrito
      corregimiento
    }
  }
`;
