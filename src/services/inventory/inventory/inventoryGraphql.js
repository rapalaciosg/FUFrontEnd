import gql from "graphql-tag";

export const GET_ALL_INVENTORY = gql`
  query getInventory {
    srvInventory {
      wharehouseId
      productId
      stock
      warehouse {
        warehouseId
        name
        code
      }
      product {
        productId
        name
        code
      }
    }
  }
`;

export const GET_INVENTORY_BY_PRODUCT = gql`
  query getInventoryByProduct($productId: Int!) {
    srvInventoryByProductId(productId: $productId) {
      wharehouseId
      productId
      stock
      warehouse {
        warehouseId
        name
        code
      }
      product {
        productId
        name
        code
      }
    }
  }
`;

export const GET_INVENTORY_BY_WAREHOUSE = gql`
  query getInventoryByWarehouse($wharehouseId: Int!) {
    srvInventoryByWharehouseId(wharehouseId: $wharehouseId) {
      wharehouseId
      productId
      stock
      warehouse {
        warehouseId
        name
        code
      }
      product {
        productId
        name
        code
      }
    }
  }
`;

export const CREATE_INVENTORY = gql`
  mutation createOrUpdateInventoryMut($inputModel: [InventoryInputModelInput!]!) {
    createOrUpdateInventory(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;