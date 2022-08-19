import {
  AttachmentType,
  IAttachmentBase,
  IAudioAttachment,
  IPictureAttachment,
  IRawAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from 'kimbu-models';
import size from 'lodash/size';

import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

export type NormalizeAccumulator = {
  files: (IRawAttachment | (IAttachmentToSend & { fileName: string }))[];
  media: (IVideoAttachment | IPictureAttachment)[];
  audios: IAudioAttachment[];
  recordings: (IVoiceAttachment & { clientId?: number })[];
};

export function normalizeAttachments(attachments: (IAttachmentBase | IAttachmentToSend)[] = []): NormalizeAccumulator | null {
  if (!size(attachments)) {
    return null;
  }
  return (attachments as (IAttachmentBase | IAttachmentToSend)[]).reduce<NormalizeAccumulator>(
    (accum, currentAttachment) => {
      switch (currentAttachment.type) {
        case AttachmentType.Raw:
          if ((currentAttachment as INamedAttachment).fileName?.endsWith('.gif')) {
            accum.media.push(currentAttachment as IPictureAttachment);
          } else {
            accum.files.push({
              ...currentAttachment,
              fileName: (currentAttachment as IRawAttachment).fileName
                ? (currentAttachment as IRawAttachment).fileName
                : (currentAttachment as IAttachmentToSend).file.name,
            } as IRawAttachment | (IAttachmentToSend & { fileName: string }));
          }

          break;
        case AttachmentType.Picture:
          accum.media.push({
            ...(currentAttachment as IPictureAttachment & IAttachmentToSend),
            fileName: (currentAttachment as IPictureAttachment).fileName
              ? (currentAttachment as IPictureAttachment).fileName
              : (currentAttachment as IPictureAttachment & IAttachmentToSend).file.name,
          });

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
