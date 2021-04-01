import { CancelTokenSource } from 'axios';

interface IUploadingAttachment {
  id: number;
  cancelTokenSource: CancelTokenSource;
}

let uploadingAttachments: IUploadingAttachment[] = [];

export const removeUploadingAttachment = (attachmentId: number) => {
  const uploadingAttachment = getUploadingAttachments().find(({ id }) => id === attachmentId);

  uploadingAttachment?.cancelTokenSource.cancel();

  uploadingAttachments = uploadingAttachments.filter(({ id }) => id !== attachmentId);
};

export const getUploadingAttachments = () => uploadingAttachments;

export const addUploadingAttachment = (attachment: IUploadingAttachment) => {
  uploadingAttachments.push(attachment);
};
