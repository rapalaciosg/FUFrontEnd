import gql from "graphql-tag";

export const GET_INVENTORY_BY_TRUCKID = gql`
  query getInventoryByTruckId($truckId: String!) {
    srvDataListaTransferencia(truckId: $truckId) {
      id
      emisor
      receptor
      articulo
      cantidad
      fecha
      fechaReg
      descripcion1
      movID
    }
  }
`;

export const GET_INVENTORY_BY_DATE = gql`
  query getInventoryByDate(
    $truckId: String!
    $startDate: String!
    $endDate: String!
  ) {
    srvInventoryDailyReport(
      truckId: $truckId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      emisor
      receptor
      articulo
      cantidad
      fecha
      fechaReg
      descripcion1
      movID
    }
  }
`;

export const UPDATE_TRANSFER = gql`
  mutation updateTransferMut($entityTransfer: TransferRequestModelInput!) {
    updateTransfrencia(entityTransfer: $entityTransfer) {
      statusCode
      message
    }
  }
`;
