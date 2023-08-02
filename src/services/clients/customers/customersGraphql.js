import gql from "graphql-tag";

export const GET_ALL_CUSTOMERS = gql`
  query getCustomers {
    srvCustomer {
      customerId
      routeId
      code
      name
      lastName
      identityCard
      address
      houseNumber
      latitude
      longitude
      customerTypeId
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
