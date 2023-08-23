import gql from "graphql-tag";

export const GET_ALL_GRAPH_USERS = gql`
  query getUsers {
    srvUser {
      userId
      userName
      companiesAll
      companiesList
      branchesOfficesAll
      brancheOfficeList
      routesAll
      routeList
      company {
        companyId
        name
      }
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
      route {
        routeId
        name
      }
    }
  }
`;

export const GET_ALL_GRAPH_USERS_BY_ID = gql`
  query getUsersById($id: UUID!) {
    srvUserById(id: $id) {
      userId
      userName
      companiesAll
      companiesList
      branchesOfficesAll
      brancheOfficeList
      routesAll
      routeList
      company {
        companyId
        name
      }
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
      route {
        routeId
        name
      }
    }
  }
`;

export const GET_ALL_GRAPH_USERS_BY_NAME = gql`
  query getUsersByName($username: String!) {
    srvUserByUsername(username: $username) {
      userId
      userName
      companiesAll
      companiesList
      branchesOfficesAll
      brancheOfficeList
      routesAll
      routeList
      company {
        companyId
        name
      }
      branchOffice {
        branchOfficeId
        branchOfficeName
      }
      route {
        routeId
        name
      }
    }
  }
`;

export const CREATE_GRAPH_USER = gql`
  mutation createUserMut($inputModel: UserInputModelInput!) {
    createUser(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_GRAPH_USER = gql`
  mutation updateUserMut($inputModel: UserInputModelInput!) {
    updateUser(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const DELETE_GRAPH_USER = gql`
  mutation deleteUserMut($id: UUID!) {
    deleteUser(id: $id) {
      statusCode
      message
      idObject
    }
  }
`;
