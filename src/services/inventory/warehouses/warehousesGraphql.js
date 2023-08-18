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
      active
    }
  }
`;

export const GET_ALL_WAREHOUSES_BY_VEHICLE = gql`
  query getWarehousesByVehicle($vehicleId: Int!) {
    srvWarehouseByVehicleId(vehicleId: $vehicleId) {
      warehouseId
      vehicle {
        vehicleId
        code
        licensePlate
      }
      code
      name
      isPrimary
      active
    }
  }
`;

export const CREATE_WAREHOUSE = gql`
  mutation createWarehouseMut($inputModel: WarehouseInputModelInput!) {
    createWarehouse(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_WAREHOUSE = gql`
  mutation updateWarehouseMut($inputModel: WarehouseInputModelInput!) {
    updateWarehouse(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;