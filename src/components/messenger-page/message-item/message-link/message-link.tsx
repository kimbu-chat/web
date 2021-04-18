import { useTranslation } from 'react-i18next';
import { Avatar } from '@components/shared';
import {
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IBaseAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from '@store/chats/models';
import React, { useMemo } from 'react';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import { ILinkedMessage } from '@store/chats/models/linked-message';
import { MessageAudioAttachment } from '../../shared/audio-attachment/audio-attachment';
import { FileAttachment } from '../../shared/file-attachment/file-attachment';
import { MediaGrid } from '../attachments/media-grid/media-grid';
import { RecordingAttachment } from '../attachments/recording-attachment/recording-attachment';
import './message-link.scss';

interface IMessageLinkProps {
  linkedMessage?: ILinkedMessage | null;
}

const MessageLink: React.FC<IMessageLinkProps> = React.memo(({ linkedMessage }) => {
  const { t } = useTranslation();

  const structuredAttachments = useMemo(
    () =>
      linkedMessage?.attachments?.reduce(
        (
          accum: {
            files: IBaseAttachment[];
            media: (IVideoAttachment | IPictureAttachment)[];
            audios: IAudioAttachment[];
            recordings: IVoiceAttachment[];
          },
          currentAttachment,
        ) => {
          switch (currentAttachment.type) {
            case FileType.Raw:
              accum.files.push(currentAttachment);

              break;
            case FileType.Picture:
              accum.media.push(currentAttachment as IPictureAttachment);

              break;
            case FileType.Video:
              accum.media.push(currentAttachment as IVideoAttachment);

              break;
            case FileType.Audio:
              accum.audios.push(currentAttachment as IAudioAttachment);

              break;
            case FileType.Voice:
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
      ),
    [linkedMessage?.attachments],
  );

  return (
    <div className="message-link">
      <Avatar className="message-link__avatar" src={linkedMessage?.userCreator.avatar?.previewUrl}>
        {getUserInitials(linkedMessage?.userCreator)}
      </Avatar>

      <div className="message-link__text">
        <span>
          {linkedMessage === null ? t('message-link.message-deleted') : linkedMessage?.text}
        </span>

        <div className="message-link__attachments">
          {structuredAttachments?.files.map((file) => (
            <FileAttachment key={file.id} {...file} />
          ))}
          {structuredAttachments?.recordings.map((recording) => (
            <RecordingAttachment key={recording.id} attachment={recording} />
          ))}
          {structuredAttachments?.audios.map((audio) => (
            <MessageAudioAttachment key={audio.id} {...audio} />
          ))}
          {structuredAttachments && structuredAttachments.media.length > 0 && (
            <MediaGrid media={structuredAttachments.media} />
          )}
        </div>
      </div>
    </div>
  );
});

MessageLink.displayName = 'MessageLink';

export { MessageLink };
