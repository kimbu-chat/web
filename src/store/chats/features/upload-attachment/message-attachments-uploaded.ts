import { createAction } from '@reduxjs/toolkit';

export interface IMessageAttachmentsUploadedPayload {
  messageId: number;
}

export class MessageAttachmentsUploaded {
  static get action() {
    return createAction<IMessageAttachmentsUploadedPayload>('MESSAGE_ATTACHMENTS_UPLOADED');
  }
}
