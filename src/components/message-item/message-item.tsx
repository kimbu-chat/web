import React, { useCallback, useMemo, ReactElement } from 'react';

import classNames from 'classnames';
import {
  IAttachmentBase,
  IPictureAttachment,
  IVoiceAttachment,
  IVideoAttachment,
  IAudioAttachment,
  AttachmentType,
  SystemMessageType,
  MessageLinkType,
  CallStatus,
} from 'kimbu-models';
import { size } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { MessageAudioAttachment } from '@components/audio-attachment';
import { Avatar } from '@components/avatar';
import { FileAttachment } from '@components/file-attachment';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as AddUsersSvg } from '@icons/add-users.svg';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as LeaveSvg } from '@icons/leave.svg';
import { ReactComponent as MessageQeuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as SelectSvg } from '@icons/select.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { changeChatInfoOpenedAction, selectMessageAction } from '@store/chats/actions';
import { ChatId } from '@store/chats/chat-id';
import { MessageState } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';
import { getMessageSelector, getIsSelectMessagesStateSelector } from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import { getShortTimeAmPm } from '@utils/date-utils';
import {
  constructSystemMessageText,
  getSystemMessageData,
  ICallMessage,
} from '@utils/message-utils';
import { replaceInUrl } from '@utils/replace-in-url';
import { getUserName } from '@utils/user-utils';

import renderText from '../../utils/render-text/render-text';

import { MediaGrid } from './attachments/media-grid/media-grid';
import { RecordingAttachment } from './attachments/recording-attachment/recording-attachment';
import { MessageItemActions } from './message-item-actions/message-item-actions';
import { RepliedMessage } from './replied-message/replied-message';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './message-item.scss';

interface IMessageItemProps {
  messageId: number;
  selectedChatId: number;
  needToShowCreator?: boolean;
  isSelected?: boolean;
  observeIntersection: ObserveFn;
}

const BLOCK_NAME = 'message';

const MessageItem: React.FC<IMessageItemProps> = React.memo(
  ({ messageId, selectedChatId, needToShowCreator, isSelected, observeIntersection }) => {
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
      if (message?.userCreatorId && message.userCreatorId !== myId) {
        openCloseChatInfo(ChatId.from(message.userCreatorId).id);
      }
    }, [openCloseChatInfo, message?.userCreatorId, myId]);

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
          icon = <MessageReadSvg className={`${BLOCK_NAME}__state`} />;
          break;
        case MessageState.QUEUED:
          icon = <MessageQeuedSvg className={`${BLOCK_NAME}__state`} />;
          break;
        default:
          icon = <MessageSentSvg className={`${BLOCK_NAME}__state`} />;
      }

      return icon;
    };

    const structuredAttachments = useMemo(
      () =>
        messageToProcess?.attachments?.reduce(
          (
            accum: {
              files: IAttachmentBase[];
              media: (IVideoAttachment | IPictureAttachment)[];
              audios: IAudioAttachment[];
              recordings: IVoiceAttachment[];
            },
            currentAttachment,
          ) => {
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
        ),
      [messageToProcess?.attachments],
    );

    if (message && message.systemMessageType !== SystemMessageType.None) {
      const additionalData = getSystemMessageData<ICallMessage>(message);
      const callStatus = additionalData?.status;
      const isOutgoing = myId === additionalData?.userCallerId;

      return (
        <>
          <div className={`${BLOCK_NAME}__system-message`}>
            <div
              className={classNames(`${BLOCK_NAME}__system-message__content`, {
                [`${BLOCK_NAME}__system-message__content--success-call`]:
                  callStatus === CallStatus.Ended,
                [`${BLOCK_NAME}__content--failure-call`]:
                  callStatus === CallStatus.Declined ||
                  callStatus === CallStatus.NotAnswered ||
                  callStatus === CallStatus.Interrupted,
              })}>
              {message?.systemMessageType === SystemMessageType.GroupChatMemberAdded && (
                <AddUsersSvg className={`${BLOCK_NAME}__system-message__icon`} />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatMemberRemoved && (
                <LeaveSvg className={`${BLOCK_NAME}__system-message__icon`} />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatCreated && (
                <CreateChatSvg className={`${BLOCK_NAME}__system-message__icon`} />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatNameChanged && (
                <CrayonSvg className={`${BLOCK_NAME}__system-message__icon`} />
              )}
              {message?.systemMessageType === SystemMessageType.GroupChatAvatarChanged && (
                <PictureSvg className={`${BLOCK_NAME}__system-message__icon`} />
              )}

              {(message?.systemMessageType === SystemMessageType.CallEnded &&
                callStatus === CallStatus.Ended &&
                (isOutgoing ? (
                  <OutgoingCallSvg className={`${BLOCK_NAME}__system-message__icon`} />
                ) : (
                  <IncomingCallSvg className={`${BLOCK_NAME}__system-message__icon`} />
                ))) ||
                (callStatus === CallStatus.NotAnswered && (
                  <MissedCallSvg className={`${BLOCK_NAME}__system-message__icon`} />
                )) ||
                ((callStatus === CallStatus.Declined || callStatus === CallStatus.Interrupted) && (
                  <DeclinedCallSvg className={`${BLOCK_NAME}__system-message__icon`} />
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
          className={classNames(`${BLOCK_NAME}__container`, {
            [`${BLOCK_NAME}__container--outgoing`]: isCurrentUserMessageCreator,
            [`${BLOCK_NAME}__container--incoming`]: !isCurrentUserMessageCreator,
          })}
          onClick={isSelectState ? selectThisMessage : undefined}
          id={`message-${messageId}`}>
          {needToShowCreator && (
            <p
              onClick={displayMessageCreatorInfo}
              className={classNames(`${BLOCK_NAME}__sender-name`, {
                [`${BLOCK_NAME}__sender-name--me`]: myId === message?.userCreatorId,
              })}>
              {userCreator && getUserName(userCreator, t)}
            </p>
          )}

          <div
            className={classNames(`${BLOCK_NAME}__item`, {
              [`${BLOCK_NAME}__item--selected`]: isSelected,
            })}>
            <button
              type="button"
              onClick={selectThisMessage}
              className={classNames(`${BLOCK_NAME}__checkbox`, {
                [`${BLOCK_NAME}__checkbox--unselected`]: !isSelected,
              })}>
              <SelectSvg />
            </button>

            {needToShowCreator && (
              <Avatar
                className={classNames(`${BLOCK_NAME}__sender-photo`, {
                  [`${BLOCK_NAME}__sender-photo--me`]: myId === message?.userCreatorId,
                })}
                onClick={displayMessageCreatorInfo}
                size={40}
                user={userCreator}
              />
            )}
            <div
              className={classNames(`${BLOCK_NAME}__contents-wrapper`, {
                [`${BLOCK_NAME}__contents-wrapper--upcoming`]: !needToShowCreator,
              })}>
              <MessageItemActions
                messageId={messageId}
                isEditAllowed={
                  isCurrentUserMessageCreator &&
                  !(message?.linkedMessageType === MessageLinkType.Forward)
                }
              />

              {messageToProcess?.isEdited && <CrayonSvg className={`${BLOCK_NAME}__edited`} />}

              {!(
                (size(message?.attachments) > 0 && message?.text) ||
                message?.linkedMessageType === MessageLinkType.Forward ||
                message?.text
              ) && (
                <div className={`${BLOCK_NAME}__attachments`}>
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
                    <MediaGrid
                      observeIntersection={observeIntersection}
                      media={structuredAttachments.media}
                    />
                  )}
                </div>
              )}

              {((size(messageToProcess?.attachments) > 0 && message?.text) ||
                message?.linkedMessageType === MessageLinkType.Forward ||
                message?.text) && (
                <div className={`${BLOCK_NAME}__content`}>
                  {message &&
                    message.linkedMessage &&
                    message.linkedMessageType === MessageLinkType.Reply && (
                      <RepliedMessage
                        observeIntersection={observeIntersection}
                        linkedMessage={message.linkedMessage}
                      />
                    )}

                  {message &&
                    message.linkedMessage &&
                    message.linkedMessageType === MessageLinkType.Forward && (
                      <div className={`${BLOCK_NAME}__forward-indicator`}>
                        {t('messageItem.forward-indicator')}
                        <Link
                          to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, [
                            'id?',
                            ChatId.from(linkedMessageUserCreator?.id).id,
                          ])}
                          className={`${BLOCK_NAME}__forward-indicator__name`}>
                          {linkedMessageUserCreator && getUserName(linkedMessageUserCreator, t)}
                        </Link>
                      </div>
                    )}

                  {size(messageToProcess?.attachments) > 0 && (
                    <div className={`${BLOCK_NAME}__attachments`}>
                      {structuredAttachments?.files.map((file) => (
                        <FileAttachment key={file.id} {...file} />
                      ))}

                      {structuredAttachments?.recordings.map((recording) => (
                        <RecordingAttachment key={recording.id} {...recording} />
                      ))}

                      {structuredAttachments?.audios.map((audio) => (
                        <MessageAudioAttachment key={audio.id} {...audio} />
                      ))}

                      {structuredAttachments?.media && (
                        <MediaGrid
                          observeIntersection={observeIntersection}
                          media={structuredAttachments.media}
                        />
                      )}
                    </div>
                  )}

                  <span className={`${BLOCK_NAME}__content__text`}>
                    {messageToProcess?.text && renderText(messageToProcess?.text)}
                  </span>
                </div>
              )}
            </div>
            {isCurrentUserMessageCreator && getMessageIcon()}
            <div className={`${BLOCK_NAME}__time`}>
              {getShortTimeAmPm(message?.creationDateTime)}
            </div>
          </div>
        </div>
      </>
    );
  },
);

MessageItem.displayName = 'MessageItem';

export { MessageItem };
