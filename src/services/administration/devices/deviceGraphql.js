import gql from "graphql-tag";

export const GET_ALL_POS = gql`
  query getPos {
    srvPos {
      posId
      branchOfficeId
      deviceId
      dPtoFacDF
      invoicePrefix
      invoiceSequential
      invoiceOnline
      invoiceNumberCopies
      invoiceNumberClosings
      eInvoiceSequential
      freight
      creditPrefix
      creditSequential
      printer
      createdBy
      createdDate
      updateBy
      updateDate
      active
    }
  }
`;

export const GET_ALL_POS_BY_DEVICE = gql`
  query getPosByDevice($id: String!) {
    srvPosByDeviceId(id: $id) {
      posId
      branchOfficeId
      deviceId
      dPtoFacDF
      invoicePrefix
      invoiceSequential
      invoiceOnline
      invoiceNumberCopies
      invoiceNumberClosings
      eInvoiceSequential
      freight
      creditPrefix
      creditSequential
      printer
      createdBy
      createdDate
      updateBy
      updateDate
      active
    }
  }
`;

export const CREATE_POS = gql`
  mutation createPosMut($inputModel: PosInputModelInput!) {
    createPos(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;

export const UPDATE_POS = gql`
  mutation updatePosMut($inputModel: PosInputModelInput!) {
    updatePos(inputModel: $inputModel) {
      statusCode
      message
      idObject
    }
  }
`;
