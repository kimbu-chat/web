import React, { useCallback, useMemo, ReactElement } from 'react';

import { useSelector } from 'react-redux';
import './message-item.scss';

import { myIdSelector } from '@store/my-profile/selectors';

import { useTranslation } from 'react-i18next';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getMessageSelector, getIsSelectMessagesStateSelector } from '@store/chats/selectors';
import { Avatar } from '@components/shared';
import { MessageAudioAttachment, FileAttachment } from '@components/messenger-page';
import { CallStatus } from '@store/common/models';
import dayjs from 'dayjs';

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
  MessageState,
  SystemMessageType,
  MessageLinkType,
} from '@store/chats/models';
import {
  constructSystemMessageText,
  getSystemMessageData,
  ICallMessage,
} from '@utils/message-utils';
import { changeChatInfoOpenedAction, selectMessageAction } from '@store/chats/actions';
import { getUserSelector } from '@store/users/selectors';
import { getUserName } from '@utils/user-utils';
import { ChatId } from '@store/chats/chat-id';
import { MediaGrid } from './attachments/media-grid/media-grid';
import { RecordingAttachment } from './attachments/recording-attachment/recording-attachment';
import { MessageItemActions } from './message-item-actions/message-item-actions';
import { RepliedMessage } from './replied-message/replied-message';

interface IMessageItemProps {
  messageId: number;
  selectedChatId: number;
  needToShowCreator?: boolean;
  isSelected?: boolean;
}

const MessageItem: React.FC<IMessageItemProps> = React.memo(
  ({ messageId, selectedChatId, needToShowCreator, isSelected }) => {
    const isSelectState = useSelector(getIsSelectMessagesStateSelector);
    const myId = useSelector(myIdSelector) as number;
    const message = useSelector(getMessageSelector(selectedChatId, messageId));
    const userCreator = useSelector(getUserSelector(message?.userCreatorId));
    const linkedMessageUserCreator = useSelector(
      getUserSelector(message?.linkedMessage?.userCreatorId),
    );

    const messageToProcess =
      message?.linkedMessageType === MessageLinkType.Forward ? message?.linkedMessage : message;

    const isCurrentUserMessageCreator = message?.userCreatorId === myId;

    const { t } = useTranslation();

    const selectMessage = useActionWithDispatch(selectMessageAction);
    const openCloseChatInfo = useActionWithDispatch(changeChatInfoOpenedAction);

    const displayMessageCreatorInfo = useCallback(() => {
      if (message?.userCreatorId) {
        openCloseChatInfo(ChatId.from(message.userCreatorId).id);
      }
    }, [openCloseChatInfo, message?.userCreatorId]);

    const selectThisMessage = useCallback(
      (event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
        event?.stopPropagation();
        selectMessage({ messageId });
      },
      [messageId, selectMessage],
    );

    const getMessageIcon = (): ReactElement => {
      let icon;

      switch (message?.state) {
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
        messageToProcess?.attachments?.reduce(
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
      [messageToProcess?.attachments],
    );

    if (message && message.systemMessageType !== SystemMessageType.None) {
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
              {message?.systemMessageType === SystemMessageType.GroupChatMemberAdded && (
                <AddUsersSvg className="message__system-message__icon" viewBox="0 0 18 18" />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatMemberRemoved && (
                <LeaveSvg className="message__system-message__icon" viewBox="0 0 18 18" />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatCreated && (
                <CreateChatSvg className="message__system-message__icon" viewBox="0 0 24 24" />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatNameChanged && (
                <CrayonSvg className="message__system-message__icon" viewBox="0 0 16 16" />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatAvatarChanged && (
                <PictureSvg className="message__system-message__icon" viewBox="0 0 18 19" />
              )}

              {(message?.systemMessageType === SystemMessageType.CallEnded &&
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

              <span>{constructSystemMessageText(message, t, myId, userCreator)}</span>
            </div>
          </div>
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
          id={`message-${messageId}`}>
          {needToShowCreator && (
            <p onClick={displayMessageCreatorInfo} className="message__sender-name">
              {userCreator && getUserName(userCreator, t)}
            </p>
          )}

          <div className={`message__item ${isSelected ? 'message__item--selected' : ''}`}>
            <button
              type="button"
              onClick={selectThisMessage}
              className={`message__checkbox ${isSelected ? '' : 'message__checkbox--unselected'}`}>
              <SelectSvg />
            </button>

            <div className="message__sender-photo-wrapper">
              {needToShowCreator && (
                <Avatar
                  onClick={displayMessageCreatorInfo}
                  className="message__sender-photo "
                  user={userCreator}
                />
              )}
            </div>

            <div
              className={`message__contents-wrapper ${
                needToShowCreator ? '' : 'message__contents-wrapper--upcoming'
              }`}>
              <MessageItemActions
                messageId={messageId}
                isEditAllowed={
                  isCurrentUserMessageCreator &&
                  !(message?.linkedMessageType === MessageLinkType.Forward)
                }
              />

              {messageToProcess?.isEdited && <CrayonSvg className="message__edited" />}

              {!(
                ((message?.attachments?.length || 0) > 0 && message?.text) ||
                message?.linkedMessageType === MessageLinkType.Forward ||
                message?.text
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

                  {structuredAttachments?.media && (
                    <MediaGrid media={structuredAttachments.media} />
                  )}
                </div>
              )}

              {(((messageToProcess?.attachments?.length || 0) > 0 && message?.text) ||
                message?.linkedMessageType === MessageLinkType.Forward ||
                message?.text) && (
                <div className="message__content">
                  {message &&
                    message.linkedMessage &&
                    message.linkedMessageType === MessageLinkType.Reply && (
                      <RepliedMessage linkedMessage={message.linkedMessage} />
                    )}

                  {message &&
                    message.linkedMessage &&
                    message.linkedMessageType === MessageLinkType.Forward && (
                      <div className="message__forward-indicator">
                        {t('messageItem.forward-indicator')}
                        <span className="message__forward-indicator__name">
                          {linkedMessageUserCreator && getUserName(linkedMessageUserCreator, t)}
                        </span>
                      </div>
                    )}

                  {(messageToProcess?.attachments?.length || 0) > 0 && (
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

                  <span className="message__content__text">{messageToProcess?.text}</span>
                </div>
              )}
            </div>
            {isCurrentUserMessageCreator && getMessageIcon()}
            <div className="message__time">
              {dayjs.utc(message?.creationDateTime).local().format('LT')}
            </div>
          </div>
        </div>
      </>
    );
  },
);

MessageItem.displayName = 'MessageItem';

export { MessageItem };
