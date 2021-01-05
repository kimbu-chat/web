import { CancelTokenSource } from 'axios';

interface IUploadingAttachment {
  id: number;
  cancelTokenSource: CancelTokenSource;
}

export let uploadingAttachments: IUploadingAttachment[] = [];

export const removeUploadingAttachment = (attachmentId: number) => {
  uploadingAttachments = uploadingAttachments.filter(({ id }) => id !== attachmentId);
};

export const addUploadingAttachment = (attachment: IUploadingAttachment) => {
  uploadingAttachments.push(attachment);
};
