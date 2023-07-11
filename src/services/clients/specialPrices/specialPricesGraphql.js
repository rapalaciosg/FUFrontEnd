import gql from "graphql-tag";

export const GET_COMPANIES_QUERY = gql`
  query getAllCompanies($route: String!) {
    srvEmpresa(route: $route) {
      nombre
      empresaID
    }
  }
`;

export const GET_ALL_SPECIAL_PRICES = gql`
  query getAllSpecialPrices($route: String!, $company: String!) {
    srvClientAjutePrecioClienteSucursal(route: $route, company: $company) {
      clienteID
      sucursal
      articuloID
      ajustePrecio
      fechaInicial
      fechaFinal
      ruta
      estatus
      empresa
    }
  }
`;

export const GET_ALL_ARTICLES = gql`
  query getAllArticles($truckId: String!) {
    srvArticulosRuta(truckId: $truckId) {
      articulo
      descripcion1
      descripcion2
      nombreCorto
      grupo
      categoria
      familia
      linea
      fabricante
      impuesto1
      estatus
      existencia
      almacen
      price
    }
  }
`;

export const CREATE_SPECIAL_PRICE = gql`
  mutation createAjustePrecioMut(
    $clientAjustePrecio: AdjustmentPriceRequestModelInput!
  ) {
    createAjustePrecio(clientAjustePrecio: $clientAjustePrecio) {
      statusCode
      message
    }
  }
`;

export const UPDATE_SPECIAL_PRICE = gql`
  mutation updateAjustePrecioMut(
    $clientAjustePrecio: AdjustmentPriceRequestModelInput!
  ) {
    updateAjustePrecio(clientAjustePrecio: $clientAjustePrecio) {
      statusCode
      message
    }
  }
`;
