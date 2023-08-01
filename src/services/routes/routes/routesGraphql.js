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
    }
  }
`;
