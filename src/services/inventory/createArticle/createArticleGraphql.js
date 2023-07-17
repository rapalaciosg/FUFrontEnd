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

export const CREATE_ARTICLE = gql`
  mutation createrArticleMut($entityArticle: ArticleModelInput!) {
    createrArticle(entityArticle: $entityArticle) {
      statusCode
      message
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation updaterArticleMut($entityArticle: ArticleModelInput!) {
    updaterArticle(entityArticle: $entityArticle) {
      statusCode
      message
    }
  }
`;