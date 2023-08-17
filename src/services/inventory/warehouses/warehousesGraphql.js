import gql from "graphql-tag";

export const GET_ALL_WAREHOUSES = gql`
  query getWarehouses {
    srvWarehouse {
      warehouseId
      vehicle {
        vehicleId
        code
        licensePlate
      }
      code
      name
      isPrimary
    }
  }
`;
