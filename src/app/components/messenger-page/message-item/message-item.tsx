import React, { useContext, useCallback, useMemo } from 'react';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';

import { myIdSelector } from 'store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getIsSelectMessagesStateSelector } from 'store/chats/selectors';
import { Avatar } from 'components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { IUser } from 'app/store/common/models';
import moment from 'moment';

import MessageQeuedSvg from 'icons/message-queued.svg';
import MessageSentSvg from 'icons/message-sent.svg';
import MessageReadSvg from 'icons/message-read.svg';
import SelectSvg from 'icons/select.svg';
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
  MessageLinkType,
} from 'store/chats/models';
import { Link } from 'react-router-dom';
import { MessageAudioAttachment, FileAttachment } from 'app/components';
import { SelectMessage } from 'app/store/chats/features/select-message/select-message';
import { isEqual } from 'lodash';
import { ChatId } from 'app/store/chats/chat-id';
import { MediaGrid } from './attachments/media-grid/media-grid';
import { RecordingAttachment } from './attachments/recording-attachment/recording-attachment';
import { MessageItemActions } from './message-item-actions/message-item-actions';
import { MessageLink } from './message-link/message-link';

interface IMessageItemProps {
  message: IMessage;
}

const MessageItem: React.FC<IMessageItemProps> = React.memo(
  ({ message }) => {
    const isSelectState = useSelector(getIsSelectMessagesStateSelector);
    const myId = useSelector(myIdSelector) as number;

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

    const structuredAttachments = useMemo(
      () =>
        message.attachments?.reduce(
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
      [message.attachments],
    );

    if (message?.systemMessageType !== SystemMessageType.None) {
      return (
        <>
          <div className='message__separator'>
            <span>{MessageUtils.constructSystemMessageText(message as IMessage, t, myId)}</span>
          </div>
          {message.needToShowDateSeparator && (
            <div className='message__separator message__separator--date'>
              <span>{moment.utc(message.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}</span>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <div className='message__container' onClick={isSelectState ? selectThisMessage : undefined}>
          {message.needToShowCreator &&
            (myId === message.userCreator.id ? (
              <p className='message__sender-name'>{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
            ) : (
              <Link to={`/chats/${message.userCreator.id}1`} className='message__sender-name'>
                {`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}
              </Link>
            ))}

          <div className={`message__item ${message.isSelected ? 'message__item--selected' : ''}`}>
            <button type='button' onClick={selectThisMessage} className={`message__checkbox ${message.isSelected ? '' : 'message__checkbox--unselected'}`}>
              <SelectSvg />
            </button>

            {message.needToShowCreator &&
              (myId === message.userCreator.id ? (
                <Avatar className='message__sender-photo ' src={message.userCreator.avatar?.previewUrl}>
                  {getUserInitials(message.userCreator as IUser)}
                </Avatar>
              ) : (
                <Link to={`/chats/${ChatId.from(message.userCreator.id).id}`}>
                  <Avatar className='message__sender-photo ' src={message.userCreator.avatar?.previewUrl}>
                    {getUserInitials(message.userCreator as IUser)}
                  </Avatar>
                </Link>
              ))}

            <div className={`message__contents-wrapper ${message.needToShowCreator ? '' : 'message__contents-wrapper--upcoming'}`}>
              <MessageItemActions
                messageId={message.id}
                isEditAllowed={isCurrentUserMessageCreator && !(message.linkedMessageType === MessageLinkType.Forward)}
              />
              {message.linkedMessageType && <MessageLink linkedMessageType={message.linkedMessageType!} linkedMessage={message.linkedMessage} />}
              <div className={`message__contents ${isCurrentUserMessageCreator ? 'message__contents--outgoing' : 'message__contents--incoming'}`}>
                {message.text}
              </div>
            </div>

            {message.isEdited && <span className='message__edited'>Edited •</span>}

            {isCurrentUserMessageCreator &&
              (message.state === MessageState.READ ? (
                <MessageReadSvg className='message__state' />
              ) : message.state === MessageState.QUEUED ? (
                <MessageQeuedSvg className='message__state' />
              ) : (
                <MessageSentSvg className='message__state' />
              ))}

            <div className='message__time'>{moment.utc(message.creationDateTime).local().format('LT')}</div>

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

        {message.needToShowDateSeparator && (
          <div className='message__separator message__separator--date'>
            <span>{moment.utc(message.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}</span>
          </div>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    const result = isEqual(prevProps, nextProps);

    return result;
  },
);

MessageItem.displayName = 'MessageItem';

export { MessageItem };
