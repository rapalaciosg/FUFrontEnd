import gql from "graphql-tag";

export const GET_ALL_CLIENTS_QUERY = gql`
  query getAllClients($truckId: String!) {
    srvLoadClientsAll(truckId: $truckId) {
      ruta
      clienteID
      sucursal
      nombreCliente
      direccionCliente
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
      apellido
      nombre
      clientType
      precio
      observacion
      zona
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation createClientMut($entityClient: CustomerRequestModelInput!) {
    createClient(entityClient: $entityClient) {
      statusCode
      message
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation updateClientMut($entityClient: CustomerRequestModelInput!) {
    updateClient(entityClient: $entityClient) {
      statusCode
      message
    }
  }
`;

export const GET_LOCAL_TYPE = gql`
  query getLocalType {
    srvTipoLocal {
      id
      nombre
    }
  }
`;

export const GET_PROVINCES = gql`
  query getProvinces {
    srvProvincia {
      id
      nombre
    }
  }
`;

export const GET_DISTRICTS = gql`
  query getDistricts($provinceId: String!) {
    srvDistrictByProvince(provinceId: $provinceId) {
      id
      nombre
      id_Provincia
    }
  }
`;

export const GET_CORRECTIONS = gql`
  query getCorrections($districtId: String!) {
    srvCorregimiento(districtId: $districtId) {
      id
      nombre
      id_Distrito
    }
  }
`;

export const GET_TWON_PLACES = gql`
  query getPlacesTown($townshipId: String!) {
    srvLugarPoblacionWithPrice(townshipId: $townshipId) {
      id_Corregimiento
      precio
      precio100lbs
      precioXMenor
      id
      nombre
    }
  }
`;
