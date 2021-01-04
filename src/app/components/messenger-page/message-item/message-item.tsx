import React, { useContext, useCallback } from 'react';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';

import { getMyIdSelector } from 'store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getIsSelectMessagesStateSelector } from 'store/chats/selectors';
import { Avatar } from 'components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { IUserPreview } from 'store/my-profile/models';
import moment from 'moment';

import MessageQeuedSvg from 'icons/ic-time.svg';
import MessageSentSvg from 'icons/ic-tick.svg';
import MessageReadSvg from 'icons/ic-double_tick.svg';
import SelectedSvg from 'icons/ic-check-filled.svg';
import UnSelectedSvg from 'icons/ic-check-outline.svg';
import {
  IRawAttachment,
  IPictureAttachment,
  IVoiceAttachment,
  IVideoAttachment,
  IAudioAttachment,
  FileType,
  IMessage,
  MessageState,
  SystemMessageType,
} from 'store/chats/models';
import { Link } from 'react-router-dom';
import { MessageAudioAttachment, FileAttachment } from 'app/components';
import { SelectMessage } from 'app/store/chats/features/select-message/select-message';
import { MediaGrid } from './attachments/media-grid/media-grid';
import { RecordingAttachment } from './attachments/recording-attachment/recording-attachment';

interface IMessageItemProps {
  message: IMessage;
}

const MessageItem: React.FC<IMessageItemProps> = React.memo(
  ({ message }) => {
    const isSelectState = useSelector(getIsSelectMessagesStateSelector);
    const myId = useSelector(getMyIdSelector) as number;

    const isCurrentUserMessageCreator = message.userCreator?.id === myId;

    const { t } = useContext(LocalizationContext);

    const selectMessage = useActionWithDispatch(SelectMessage.action);

    const selectThisMessage = useCallback(
      (event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
        event?.stopPropagation();
        selectMessage({ messageId: message.id });
      },
      [message.id],
    );

    const structuredAttachments = message.attachments?.reduce(
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
    );

    if (message?.systemMessageType !== SystemMessageType.None) {
      return (
        <div className='message__separator'>
          <span>{MessageUtils.constructSystemMessageText(message as IMessage, t, myId)}</span>
        </div>
      );
    }

    return (
      <div
        className={`message__container
				${message.isSelected ? 'message__container--selected' : ''}`}
        onClick={isSelectState ? selectThisMessage : () => {}}
      >
        <div className={`message__item ${!message.needToShowCreator ? 'message__item--upcoming' : ''}`}>
          {message.needToShowCreator &&
            (myId === message.userCreator.id ? (
              <p className='message__sender-name'>{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
            ) : (
              <Link to={`/chats/${message.userCreator.id}1`} className='message__sender-name'>
                {`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}
              </Link>
            ))}
          <div className='message__item-apart'>
            <span className='message__contents'>{message.text}</span>

            <div className='message__time-status'>
              {message.isEdited && <span className='message__edited'>Edited •</span>}

              {isCurrentUserMessageCreator &&
                (message.state === MessageState.READ ? (
                  <MessageReadSvg viewBox='0 0 25 25' className='message__read' />
                ) : message.state === MessageState.QUEUED ? (
                  <MessageQeuedSvg viewBox='0 0 25 25' className='message__read' />
                ) : (
                  <MessageSentSvg viewBox='0 0 25 25' className='message__read' />
                ))}

              <span className='message__time'>{moment.utc(message.creationDateTime).local().format('LT')}</span>
            </div>
          </div>
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
        {message.needToShowCreator &&
          (myId === message.userCreator.id ? (
            <Avatar className='message__sender-photo message__sender-photo--me ' src={message.userCreator.avatar?.previewUrl}>
              {getUserInitials(message.userCreator as IUserPreview)}
            </Avatar>
          ) : (
            <Link className='message__sender-photo-wrapper' to={`/chats/${message.userCreator.id}1`}>
              <Avatar className='message__sender-photo ' src={message.userCreator.avatar?.previewUrl}>
                {getUserInitials(message.userCreator as IUserPreview)}
              </Avatar>
            </Link>
          ))}

        <div onClick={selectThisMessage} className='message__selected'>
          {message.isSelected ? <SelectedSvg /> : <UnSelectedSvg className='message__unselected' />}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.message.text === nextProps.message.text &&
    prevProps.message.isSelected === nextProps.message.isSelected &&
    prevProps.message.isEdited === nextProps.message.isEdited &&
    prevProps.message.state === nextProps.message.state,
  // xorBy([prevProps.message.attachments, nextProps.message.attachments], 'id').length === 0,
);

MessageItem.displayName = 'MessageItem';

export { MessageItem };
