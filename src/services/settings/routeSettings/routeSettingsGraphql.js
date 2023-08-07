import gql from "graphql-tag";

export const GET_ROUTES_SETTINGS = gql`
  query getRouteSettings {
    srvRouteSetting {
      code
      value
    }
  }
`;

export const CREATE_ROUTES_SETTINGS = gql`
  mutation createRouteSettingMut($inputModel: RouteSettingInputModelInput!) {
    createRouteSetting(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_ROUTES_SETTINGS = gql`
  mutation updateRouteSettingMut($inputModel: RouteSettingInputModelInput!) {
    updateRouteSetting(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
