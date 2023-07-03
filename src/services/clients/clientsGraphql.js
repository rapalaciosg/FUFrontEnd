import gql from "graphql-tag";

export const GET_ALL_CLIENTS_QUERY = gql`
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

export const GET_CLIENT_QUERY = gql`
  query getClientInfo($customerId: String!) {
    srvUserInfo(customerId: $customerId) {
      ruta
      clientID
      distrito
      corregimiento
      lugarPoblado
      cedula
      coordenadas
      dv
      birth
      tanquesNuestros
      ubicacion
      otrosTanques
      casa
      contacto
      telefono
    }
  }
`;

// export const GET_PROVINCES = gql``;

export const UPDATE_CLIENT = gql`
  mutation updateClientMut($client: EntityClientInput!) {
    updateClient(entityClient: $client) {
      nombre
    }
  }
`;

export const GET_TIPO_LOCAL = gql`
  query getsrvTipoLocal{
    srvTipoLocal{
      id
      nombre
    }
  } 
`;

export const GET_PROVINCIAS = gql`
  query getProvincias {
    srvProvincia{
      id
      nombre
    }
  }
`;