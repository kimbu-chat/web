import { UploadingAttachment } from './models';

export let uploadingAttachments: UploadingAttachment[] = [];

export const removeUploadingAttachment = (attachmentId: number) => {
  uploadingAttachments = uploadingAttachments.filter(({ id }) => id !== attachmentId);
};

export const addUploadingAttachment = (attachment: UploadingAttachment) => {
  uploadingAttachments.push(attachment);
};
