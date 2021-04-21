import React, { useCallback, useMemo, ReactElement } from 'react';

import { useSelector } from 'react-redux';
import './message-item.scss';

import { myIdSelector } from '@store/my-profile/selectors';

import { useTranslation } from 'react-i18next';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getIsSelectMessagesStateSelector } from '@store/chats/selectors';
import { Avatar } from '@components/shared';
import { MessageAudioAttachment, FileAttachment } from '@components/messenger-page';
import { CallStatus } from '@store/common/models';
import moment from 'moment';

import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { ReactComponent as LeaveSvg } from '@icons/leave.svg';
import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';
import { ReactComponent as AddUsersSvg } from '@icons/add-users.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';

import { ReactComponent as MessageQeuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';

import { ReactComponent as SelectSvg } from '@icons/select.svg';
import {
  IBaseAttachment,
  IPictureAttachment,
  IVoiceAttachment,
  IVideoAttachment,
  IAudioAttachment,
  FileType,
  IMessage,
  MessageState,
  SystemMessageType,
  MessageLinkType,
} from '@store/chats/models';
import { Link } from 'react-router-dom';

import { ChatId } from '@store/chats/chat-id';
import {
  constructSystemMessageText,
  getSystemMessageData,
  ICallMessage,
} from '@utils/message-utils';
import { selectMessageAction } from '@store/chats/actions';
import { MediaGrid } from './attachments/media-grid/media-grid';
import { RecordingAttachment } from './attachments/recording-attachment/recording-attachment';
import { MessageItemActions } from './message-item-actions/message-item-actions';
import { MessageLink } from './message-link/message-link';

interface IMessageItemProps {
  message: IMessage;
}

const MessageItem: React.FC<IMessageItemProps> = ({ message }) => {
  const isSelectState = useSelector(getIsSelectMessagesStateSelector);
  const myId = useSelector(myIdSelector) as number;

  const isCurrentUserMessageCreator = message.userCreator?.id === myId;

  const { t } = useTranslation();

  const selectMessage = useActionWithDispatch(selectMessageAction);

  const selectThisMessage = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
      event?.stopPropagation();
      selectMessage({ messageId: message.id });
    },
    [message.id, selectMessage],
  );

  const getMessageIcon = (): ReactElement => {
    let icon;

    switch (message.state) {
      case MessageState.READ:
        icon = <MessageReadSvg className="message__state" />;
        break;
      case MessageState.QUEUED:
        icon = <MessageQeuedSvg className="message__state" />;
        break;
      default:
        icon = <MessageSentSvg className="message__state" />;
    }

    return icon;
  };

  const structuredAttachments = useMemo(
    () =>
      message.attachments?.reduce(
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
    [message.attachments],
  );

  if (message?.systemMessageType !== SystemMessageType.None) {
    const additionalData = getSystemMessageData<ICallMessage>(message);
    const callStatus = additionalData?.status;
    const isOutgoing = myId === additionalData?.userCallerId;

    return (
      <>
        <div className="message__system-message">
          <div
            className={`message__system-message__content ${
              callStatus === CallStatus.Ended && 'message__system-message__content--success-call'
            } ${
              (callStatus === CallStatus.Declined ||
                callStatus === CallStatus.NotAnswered ||
                callStatus === CallStatus.Interrupted) &&
              'message__system-message__content--failure-call'
            }`}>
            {message.systemMessageType === SystemMessageType.GroupChatMemberAdded && (
              <AddUsersSvg className="message__system-message__icon" viewBox="0 0 18 18" />
            )}
            {message.systemMessageType === SystemMessageType.GroupChatMemberRemoved && (
              <LeaveSvg className="message__system-message__icon" viewBox="0 0 18 18" />
            )}
            {message.systemMessageType === SystemMessageType.GroupChatCreated && (
              <CreateChatSvg className="message__system-message__icon" viewBox="0 0 24 24" />
            )}
            {message.systemMessageType === SystemMessageType.GroupChatNameChanged && (
              <CrayonSvg className="message__system-message__icon" viewBox="0 0 16 16" />
            )}
            {message.systemMessageType === SystemMessageType.GroupChatAvatarChanged && (
              <PictureSvg className="message__system-message__icon" viewBox="0 0 18 19" />
            )}

            {(message.systemMessageType === SystemMessageType.CallEnded &&
              callStatus === CallStatus.Ended &&
              (isOutgoing ? (
                <OutgoingCallSvg className="message__system-message__icon" viewBox="0 0 11 12" />
              ) : (
                <IncomingCallSvg className="message__system-message__icon" viewBox="0 0 12 12" />
              ))) ||
              (callStatus === CallStatus.NotAnswered && (
                <MissedCallSvg className="message__system-message__icon" viewBox="0 0 12 12" />
              )) ||
              ((callStatus === CallStatus.Declined || callStatus === CallStatus.Interrupted) && (
                <DeclinedCallSvg className="message__system-message__icon" viewBox="0 0 13 14" />
              ))}

            <span>{constructSystemMessageText(message as IMessage, t, myId)}</span>
          </div>
        </div>

        {message.needToShowDateSeparator && (
          <div className="message__separator message__separator--date">
            <span>
              {moment.utc(message.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}
            </span>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={`message__container  ${
          isCurrentUserMessageCreator
            ? 'message__container--outgoing'
            : 'message__container--incoming'
        }`}
        onClick={isSelectState ? selectThisMessage : undefined}
        id={`message-${message.id}`}>
        {message.needToShowCreator &&
          (myId === message.userCreator.id ? (
            <p className="message__sender-name">{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
          ) : (
            <Link to={`/chats/${message.userCreator.id}1`} className="message__sender-name">
              {`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}
            </Link>
          ))}

        <div className={`message__item ${message.isSelected ? 'message__item--selected' : ''}`}>
          <button
            type="button"
            onClick={selectThisMessage}
            className={`message__checkbox ${
              message.isSelected ? '' : 'message__checkbox--unselected'
            }`}>
            <SelectSvg />
          </button>

          <div className="message__sender-photo-wrapper">
            {message.needToShowCreator &&
              (myId === message.userCreator.id ? (
                <Avatar className="message__sender-photo " user={message.userCreator} />
              ) : (
                <Link to={`/chats/${ChatId.from(message.userCreator.id).id}`}>
                  <Avatar className="message__sender-photo " user={message.userCreator} />
                </Link>
              ))}
          </div>

          <div
            className={`message__contents-wrapper ${
              message.needToShowCreator ? '' : 'message__contents-wrapper--upcoming'
            }`}>
            <MessageItemActions
              messageId={message.id}
              isEditAllowed={
                isCurrentUserMessageCreator &&
                !(message.linkedMessageType === MessageLinkType.Forward)
              }
            />

            {message.isEdited && <CrayonSvg className="message__edited" />}

            {!(
              ((message.attachments?.length || 0) > 0 && message.text) ||
              message.linkedMessageType ||
              message.text
            ) && (
              <div className="message__attachments">
                {structuredAttachments?.files.map((file) => (
                  <FileAttachment key={file.id} {...file} />
                ))}

                {structuredAttachments?.recordings.map((recording) => (
                  <RecordingAttachment key={recording.id} attachment={recording} />
                ))}

                {structuredAttachments?.audios.map((audio) => (
                  <MessageAudioAttachment key={audio.id} {...audio} />
                ))}

                {structuredAttachments?.media && <MediaGrid media={structuredAttachments.media} />}
              </div>
            )}

            {(((message.attachments?.length || 0) > 0 && message.text) ||
              message.linkedMessageType ||
              message.text) && (
              <div className="message__content">
                {message.linkedMessageType && <MessageLink linkedMessage={message.linkedMessage} />}

                {(message.attachments?.length || 0) > 0 && (
                  <div className="message__attachments">
                    {structuredAttachments?.files.map((file) => (
                      <FileAttachment key={file.id} {...file} />
                    ))}

                    {structuredAttachments?.recordings.map((recording) => (
                      <RecordingAttachment key={recording.id} attachment={recording} />
                    ))}

                    {structuredAttachments?.audios.map((audio) => (
                      <MessageAudioAttachment key={audio.id} {...audio} />
                    ))}

                    {structuredAttachments?.media && (
                      <MediaGrid media={structuredAttachments.media} />
                    )}
                  </div>
                )}

                <span>{message.text}</span>
              </div>
            )}
          </div>
          {isCurrentUserMessageCreator && getMessageIcon()}
          <div className="message__time">
            {moment.utc(message.creationDateTime).local().format('LT')}
          </div>
        </div>
      </div>

      {message.needToShowDateSeparator && (
        <div className="message__separator message__separator--date">
          <span>
            {moment.utc(message.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}
          </span>
        </div>
      )}
    </>
  );
};

MessageItem.displayName = 'MessageItem';

export { MessageItem };
