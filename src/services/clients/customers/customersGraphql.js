import gql from "graphql-tag";

export const GET_ALL_CUSTOMERS = gql`
  query getCustomers {
    srvCustomer {
      customerId
      route {
        routeId
        name
        customerPrefix
      }
      code
      name
      lastName
      identityCard
      address
      houseNumber
      latitude
      longitude
      customerType {
        customerTypeId
        name
      }
      contactName
      phone
      email
      dv
      province {
        provinceId
        name
      }
      district {
        districtId
        name
      }
      township {
        townshipId
        name
      }
      village {
        villageId
        name
      }
      taxpayerType {
        taxpayerTypeId
        name
      }
      active
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomerMut($inputModel: CustomerInputModelInput!) {
    createCustomer(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
