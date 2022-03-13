import { createEmptyAction } from '@store/common/actions';

export class MessageAttachmentsUploaded {
  static get action() {
    return createEmptyAction('MESSAGE_ATTACHMENTS_UPLOADED');
  }
}
