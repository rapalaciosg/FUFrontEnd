import gql from "graphql-tag";

export const GET_ALL_ROUTES = gql`
  query getRoutes {
    srvRoutes {
      routeId
      company {
        companyId
        name
      }
      code
      name
      description
      customerPrefix
      customerSequential
      activeCustomerCreation
      vehicle {
        vehicleId
        name
        code
        licensePlate
      }
      driver {
        driverId
        name
        lastName
        code
      }
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
    }
  }
`;

export const GET_ROUTES_BY_COMPANY = gql`
  query getRoutesByCompany($id: Int!) {
    srvRoutesByCompanyId(id: $id) {
      routeId
      company {
        companyId
        name
      }
      code
      name
      description
      customerPrefix
      customerSequential
      activeCustomerCreation
      vehicle {
        vehicleId
        name
        code
        licensePlate
      }
      driver {
        driverId
        name
        lastName
        code
      }
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
    }
  }
`;

export const CREATE_ROUTE = gql`
  mutation createRouteMut($inputModel: RouteInputModelInput!) {
    createRoute(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_ROUTE = gql`
  mutation updateRouteMut($inputModel: RouteInputModelInput!) {
    updateRoute(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const DELETE_ROUTE = gql`
  mutation deleteRouteMut($id: Int!) {
    deleteRoute(id: $id) {
      statusCode
      message
      idObject
    }
  }
`;
