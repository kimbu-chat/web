import { FileType, IAudioAttachment, IBaseAttachment, IPictureAttachment, IRawAttachment, IVideoAttachment, IVoiceAttachment } from 'app/store/chats/models';
import { IUserPreview } from 'app/store/models';
import React, { useMemo } from 'react';
import { MessageAudioAttachment } from '../../shared/audio-attachment/audio-attachment';
import { FileAttachment } from '../../shared/file-attachment/file-attachment';
import { MediaGrid } from '../attachments/media-grid/media-grid';
import { RecordingAttachment } from '../attachments/recording-attachment/recording-attachment';
import './message-link.scss';

interface IMessageLinkProps {
  linkedMessage: {
    id: number;
    userCreator: IUserPreview;
    text: string;
    attachments?: IBaseAttachment[];
  };
  linkedMessageType: 'Reply' | 'Forward';
}

const MessageLink: React.FC<IMessageLinkProps> = React.memo(({ linkedMessage, linkedMessageType }) => {
  const structuredAttachments = useMemo(
    () =>
      linkedMessage.attachments?.reduce(
        (
          accum: {
            files: IRawAttachment[];
            media: (IVideoAttachment | IPictureAttachment)[];
            audios: IAudioAttachment[];
            recordings: IVoiceAttachment[];
          },
          currentAttachment,
        ) => {
          switch (currentAttachment.type) {
            case FileType.Raw:
              accum.files.push(currentAttachment as IRawAttachment);

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
    [linkedMessage.attachments],
  );

  return (
    <div className={`message-link ${linkedMessageType === 'Forward' ? 'message-link--forward' : 'message-link--reply'}`}>
      <div className='message-link__interlocutor'>{`${linkedMessageType === 'Forward' ? 'Forwarded from ' : 'Replied to'} ${
        linkedMessage.userCreator.firstName
      } ${linkedMessage.userCreator.lastName}`}</div>
      <div className='message-link__text'>{linkedMessage.text}</div>
      <div className='message-link__attachments'>
        {structuredAttachments?.files.map((file) => (
          <FileAttachment key={file.id} attachment={file} />
        ))}
        {structuredAttachments?.recordings.map((recording) => (
          <RecordingAttachment key={recording.id} attachment={recording} />
        ))}
        {structuredAttachments?.audios.map((audio) => (
          <MessageAudioAttachment key={audio.id} attachment={audio} />
        ))}
        {(structuredAttachments?.media.length || 0) > 0 && <MediaGrid media={structuredAttachments!.media} />}
      </div>
    </div>
  );
});

MessageLink.displayName = 'MessageLink';

export { MessageLink };
