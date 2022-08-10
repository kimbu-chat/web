import {
  AttachmentType,
  IAttachmentBase,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from 'kimbu-models';
import size from 'lodash/size';

import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

export type NormalizeAccumulator = {
  files: IAttachmentBase[];
  media: (IVideoAttachment | IPictureAttachment)[];
  audios: IAudioAttachment[];
  recordings: (IVoiceAttachment & { clientId?: number })[];
};

export type IFileAttachment = IAttachmentBase & {
  fileName: string;
  file?: {
    name: string;
  };
};

export function normalizeAttachments(
  attachments: (IAttachmentBase | IAttachmentToSend)[] = [],
): NormalizeAccumulator | null {
  if (!size(attachments)) {
    return null;
  }
  return (attachments as Array<IAttachmentBase>)?.reduce<NormalizeAccumulator>(
    (accum, currentAttachment) => {
      switch (currentAttachment.type) {
        case AttachmentType.Raw:
          if ((currentAttachment as INamedAttachment).fileName?.endsWith('.gif')) {
            accum.media.push(currentAttachment as IPictureAttachment);
          } else {
            accum.files.push({
              ...currentAttachment,
              fileName: (currentAttachment as IFileAttachment).fileName
                ? (currentAttachment as IFileAttachment).fileName
                : (currentAttachment as IFileAttachment).file?.name,
            } as IFileAttachment);
          }

          break;
        case AttachmentType.Picture:
          accum.media.push(currentAttachment as IPictureAttachment);

          break;
        case AttachmentType.Video:
          accum.media.push(currentAttachment as IVideoAttachment);

          break;
        case AttachmentType.Audio:
          accum.audios.push(currentAttachment as IAudioAttachment);

          break;
        case AttachmentType.Voice:
          accum.recordings.push(currentAttachment as IVoiceAttachment);

          break;
        default:
          break;
      }

      return accum;
    },
    {
      files: [],
      media: [],
      audios: [],
      recordings: [],
    },
  );
}
