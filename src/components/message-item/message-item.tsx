import React, { useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { AttachmentType, IUser, MessageLinkType, SystemMessageType } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { ForwardedMessage } from '@components/message-item/forwarded-message';
import { SystemMessage } from '@components/message-item/system-message';
import { normalizeAttachments } from '@components/message-item/utilities';
import { MessageStatus } from '@components/message-status';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { ReactComponent as SelectSvg } from '@icons/select.svg';
import { changeChatInfoOpenedAction, selectMessageAction } from '@store/chats/actions';
import { ChatId } from '@store/chats/chat-id';
import { INormalizedLinkedMessage, MessageState } from '@store/chats/models';
import { getIsSelectMessagesStateSelector, getMessageSelector } from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import { getShortTimeAmPm } from '@utils/date-utils';
import { getUserName } from '@utils/user-utils';

import renderText from '../../utils/render-text/render-text';

import { AttachmentsMap } from './attachments/attachments-map';
import { MessageItemActions } from './message-item-actions/message-item-actions';
import { RepliedMessage } from './replied-message/replied-message';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './message-item.scss';

interface IMessageItemProps {
  messageId: number;
  selectedChatId: number;
  needToShowCreator?: boolean;
  isSelected?: boolean;
  animated?: boolean;
  observeIntersection: ObserveFn;
  onAddAnchors?: (anchors: ScrollAnchorType[]) => void;
}

export type ScrollAnchorType = {
  id: number;
  autoScroll: boolean;
};

const BLOCK_NAME = 'message';

const linkedMessageTypes = [MessageLinkType.Forward, MessageLinkType.Reply];

const MessageItem = React.forwardRef<HTMLDivElement, IMessageItemProps>(
  ({ messageId, selectedChatId, needToShowCreator, isSelected, observeIntersection, animated, onAddAnchors }, ref) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const isSelectState = useSelector(getIsSelectMessagesStateSelector);
    const myId = useSelector(myIdSelector);
    const message = useSelector(getMessageSelector(selectedChatId, messageId));
    const userCreator = useSelector(getUserSelector(message?.userCreatorId));
    const linkedMessageUserCreator = useSelector(getUserSelector(message?.linkedMessage?.userCreatorId));
    const isMessageQueued = message.state === MessageState.QUEUED;

    const [justCreated, setJustCreated] = useState(false);

    useEffect(() => {
      if (message.state === MessageState.QUEUED) {
        setJustCreated(true);
      }
    }, [message.state]);

    const showMenu = useCallback(() => setMenuVisible(true), []);
    const hideMenu = useCallback(() => setMenuVisible(false), []);

    const isLinkedMessage = linkedMessageTypes.some((type) => type === message?.linkedMessageType);

    const messageToProcess = isLinkedMessage ? (message?.linkedMessage as INormalizedLinkedMessage) : message;

    const isCurrentUserMessageCreator = message?.userCreatorId === myId;

    const scrollToForward = useCallback(() => {
      if (isLinkedMessage && onAddAnchors && messageToProcess) {
        onAddAnchors([
          { id: messageToProcess.id, autoScroll: true },
          { id: message.id, autoScroll: false },
        ]);
      }
    }, [onAddAnchors, isLinkedMessage, messageToProcess, message.id]);

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
        if (isMessageQueued) {
          return;
        }
        event?.stopPropagation();
        selectMessage({ messageId });
      },
      [messageId, selectMessage, isMessageQueued],
    );

    const messageStatus = useMemo(() => {
      if (message?.systemMessageType !== SystemMessageType.None || !isCurrentUserMessageCreator) {
        return <></>;
      }

      return <MessageStatus state={message.state ? message.state : MessageState.SENT} />;
    }, [message?.systemMessageType, message.state, isCurrentUserMessageCreator]);

    const rootAttachments = normalizeAttachments(message.attachments);

    if (!myId) {
      return null;
    }

    if (message && message.systemMessageType !== SystemMessageType.None) {
      return <SystemMessage message={message} userCreator={userCreator as IUser} />;
    }

    const renderReply = () => (
      <>
        <RepliedMessage
          observeIntersection={observeIntersection}
          linkedMessage={messageToProcess as INormalizedLinkedMessage}
          isCurrentUserMessageCreator={isCurrentUserMessageCreator}
        />
        <AttachmentsMap
          structuredAttachments={rootAttachments}
          isCurrentUserMessageCreator={isCurrentUserMessageCreator}
          observeIntersection={observeIntersection}
        />
      </>
    );

    const renderForward = () => (
      <ForwardedMessage
        linkedMessageUserCreator={linkedMessageUserCreator}
        linkedMessage={messageToProcess as INormalizedLinkedMessage}
        observeIntersection={observeIntersection}
        isCurrentUserMessageCreator={isCurrentUserMessageCreator}
      />
    );

    const linkedMessageByType = {
      [MessageLinkType.Reply]: renderReply,
      [MessageLinkType.Forward]: renderForward,
    };

    return (
      <>
        <div
          className={classNames(`${BLOCK_NAME}__container`, {
            [`${BLOCK_NAME}__container--outgoing`]: isCurrentUserMessageCreator,
            [`${BLOCK_NAME}__container--incoming`]: !isCurrentUserMessageCreator,
          })}
          onClick={isSelectState ? selectThisMessage : undefined}
          ref={ref}
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
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
            className={classNames(`${BLOCK_NAME}__item`, {
              [`${BLOCK_NAME}__item--selected`]: isSelected,
            })}>
            <button
              type="button"
              onClick={selectThisMessage}
              className={classNames(`${BLOCK_NAME}__checkbox`, {
                [`${BLOCK_NAME}__checkbox--unselected`]: !isSelected,
                [`${BLOCK_NAME}__checkbox--hidden`]: isMessageQueued,
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
                [`${BLOCK_NAME}__contents-wrapper--animated`]: animated || justCreated,
              })}>
              {messageToProcess?.isEdited && <CrayonSvg className={`${BLOCK_NAME}__edited`} />}

              {!isLinkedMessage && (
                <AttachmentsMap
                  className={`${BLOCK_NAME}__attachments`}
                  structuredAttachments={rootAttachments}
                  isCurrentUserMessageCreator={isCurrentUserMessageCreator}
                  observeIntersection={observeIntersection}
                  messageId={messageId}
                />
              )}

              {(isLinkedMessage || message?.text) && (
                <div className={`${BLOCK_NAME}__content`} onClick={scrollToForward}>
                  {isLinkedMessage && linkedMessageByType[message.linkedMessageType as MessageLinkType]()}
                  {message?.text && <span className={`${BLOCK_NAME}__content__text`}>{renderText(message?.text)}</span>}
                </div>
              )}
            </div>
            <div className={`${BLOCK_NAME}__state`}>{messageStatus}</div>
            <div className={`${BLOCK_NAME}__time`}>{getShortTimeAmPm(message?.creationDateTime)}</div>
            <MessageItemActions
              visible={isMenuVisible}
              messageId={messageId}
              isEditAllowed={
                isCurrentUserMessageCreator &&
                !(message?.linkedMessageType === MessageLinkType.Forward) &&
                !message.attachments?.some(({ type }) => type === AttachmentType.Voice)
              }
              isMessageQueued={isMessageQueued}
            />
          </div>
        </div>
      </>
    );
  },
);

const MemorizedMessageItem = React.memo(MessageItem);

MemorizedMessageItem.displayName = 'MemorizedMessageItem';

export { MemorizedMessageItem };
