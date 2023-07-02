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
