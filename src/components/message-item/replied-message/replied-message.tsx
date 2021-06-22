import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import {
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IBaseAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from '@store/chats/models';
import { INormalizedLinkedMessage } from '@store/chats/models/linked-message';
import { getUserSelector } from '@store/users/selectors';

import { MessageAudioAttachment } from '../../audio-attachment/audio-attachment';
import { FileAttachment } from '../../file-attachment/file-attachment';
import { MediaGrid } from '../attachments/media-grid/media-grid';
import { RecordingAttachment } from '../attachments/recording-attachment/recording-attachment';
import './replied-message.scss';

interface IRepliedMessageProps {
  linkedMessage: INormalizedLinkedMessage | null;
}

const RepliedMessage: React.FC<IRepliedMessageProps> = ({ linkedMessage }) => {
  const { t } = useTranslation();

  const userCreator = useSelector(getUserSelector(linkedMessage?.userCreatorId));

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
    <div className="replied-message">
      <Avatar className="replied-message__avatar" user={userCreator} />

      <div className="replied-message__contents">
        <span className="replied-message__text">
          {linkedMessage === null ? t('repliedMessage.message-deleted') : linkedMessage?.text}
        </span>

        <div className="replied-message__attachments">
          {structuredAttachments?.files.map((file) => (
            <FileAttachment key={file.id} {...file} />
          ))}
          {structuredAttachments?.recordings.map((recording) => (
            <RecordingAttachment key={recording.id} {...recording} />
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
};

RepliedMessage.displayName = 'RepliedMessage';

export { RepliedMessage };
