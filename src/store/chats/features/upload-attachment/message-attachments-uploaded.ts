import { createAction } from "@reduxjs/toolkit";

export class MessageAttachmentsUploaded {
  static get action() {
    return createAction('MESSAGE_ATTACHMENTS_UPLOADED');
  }
}
