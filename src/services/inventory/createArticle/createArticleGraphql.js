import gql from "graphql-tag";

export const GET_ALL_ARTICLES_QUERY = gql`
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
