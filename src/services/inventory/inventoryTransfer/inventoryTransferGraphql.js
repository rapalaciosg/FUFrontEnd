import gql from "graphql-tag";

export const GET_ALL_TRANSFER = gql`
  query getTransfers {
    srvTransfer {
      transferId
      origenWharehouseId
      destinationWharehouseId
      productId
      quantity
      createdBy
      createdDate
      warehouseInputOrigin {
        warehouseId
        name
      }
      warehouseInputDestination {
        warehouseId
        name
      }
      product {
        productId
        name
      }
    }
  }
`;

export const CREATE_TRANSFER = gql`
  mutation createTransferMut($inputModel: TransferInputModelInput!) {
    createTransfer(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
