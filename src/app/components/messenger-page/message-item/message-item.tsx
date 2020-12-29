import React, { useContext, useCallback } from 'react';
import { Message, SystemMessageType, MessageState, FileType } from 'store/messages/models';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';

import { getMyIdSelector } from 'store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { MessageActions } from 'store/messages/actions';
import { getSelectedMessagesLength } from 'store/messages/selectors';
import { Avatar } from 'components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { UserPreview } from 'store/my-profile/models';
import moment from 'moment';

import MessageQeuedSvg from 'icons/ic-time.svg';
import MessageSentSvg from 'icons/ic-tick.svg';
import MessageReadSvg from 'icons/ic-double_tick.svg';
import SelectedSvg from 'icons/ic-check-filled.svg';
import UnSelectedSvg from 'icons/ic-check-outline.svg';
import { RawAttachment, PictureAttachment, VoiceAttachment, VideoAttachment, AudioAttachment } from 'store/chats/models';
import { Link } from 'react-router-dom';
import { MessageAudioAttachment, FileAttachment } from 'app/components';
import { MediaGrid } from './attachments/media-grid/media-grid';
import { RecordingAttachment } from './attachments/recording-attachment/recording-attachment';

namespace MessageNS {
  export interface Props {
    message: Message;
  }
}

const MessageItem = React.memo(
  ({ message }: MessageNS.Props) => {
    const currentUserId = useSelector(getMyIdSelector) as number;
    const selectedChatId = useSelector(getSelectedChatSelector)?.id;
    const isSelectState = useSelector(getSelectedMessagesLength) > 0;
    const myId = useSelector(getMyIdSelector) as number;

    const isCurrentUserMessageCreator = message.userCreator?.id === myId;

    const { t } = useContext(LocalizationContext);

    const selectMessage = useActionWithDispatch(MessageActions.selectMessage);

    const selectThisMessage = useCallback(
      (event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
        event?.stopPropagation();
        selectMessage({ chatId: selectedChatId as number, messageId: message.id });
      },
      [selectedChatId, message.id],
    );

    const structuredAttachments = message.attachments?.reduce(
      (
        accum: {
          files: RawAttachment[];
          media: (VideoAttachment | PictureAttachment)[];
          audios: AudioAttachment[];
          recordings: VoiceAttachment[];
        },
        currentAttachment,
      ) => {
        switch (currentAttachment.type) {
          case FileType.raw:
            accum.files.push(currentAttachment as RawAttachment);

            break;
          case FileType.picture:
            accum.media.push(currentAttachment as PictureAttachment);

            break;
          case FileType.video:
            accum.media.push(currentAttachment as VideoAttachment);

            break;
          case FileType.audio:
            accum.audios.push(currentAttachment as AudioAttachment);

            break;
          case FileType.voice:
            accum.recordings.push(currentAttachment as VoiceAttachment);

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
          <span>{MessageUtils.constructSystemMessageText(message as Message, t, currentUserId)}</span>
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
              {getUserInitials(message.userCreator as UserPreview)}
            </Avatar>
          ) : (
            <Link className='message__sender-photo-wrapper' to={`/chats/${message.userCreator.id}1`}>
              <Avatar className='message__sender-photo ' src={message.userCreator.avatar?.previewUrl}>
                {getUserInitials(message.userCreator as UserPreview)}
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
