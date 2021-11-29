import {
  AttachmentType,
  IAttachmentBase,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from 'kimbu-models';

import { INamedAttachment } from '@store/chats/models/named-attachment';

import type { IAttachmentWithClient } from '@store/chats/models';

export type NormalizeAccumulator = {
  files: IAttachmentBase[];
  media: (IVideoAttachment | IPictureAttachment)[];
  audios: IAudioAttachment[];
  recordings: (IVoiceAttachment & { clientId?: number })[];
};

export function normalizeAttachments(
  attachments: IAttachmentBase[] | IAttachmentWithClient[] = [],
): NormalizeAccumulator {
  return (
    attachments as Array<IAttachmentBase | IAttachmentWithClient>
  )?.reduce<NormalizeAccumulator>(
    (accum, currentAttachment) => {
      switch (currentAttachment.type) {
        case AttachmentType.Raw:
          if ((currentAttachment as INamedAttachment).fileName?.endsWith('.gif')) {
            accum.media.push(currentAttachment as IPictureAttachment);
          } else {
            accum.files.push(currentAttachment);
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
