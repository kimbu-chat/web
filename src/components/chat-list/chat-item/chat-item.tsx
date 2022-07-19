import React, { useEffect, useMemo, useRef } from 'react';

import classnames from 'classnames';
import { MessageLinkType, SystemMessageType } from 'kimbu-models';
import { size } from 'lodash';
import truncate from 'lodash/truncate';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { ReactComponent as MessageErrorSvg } from '@icons/message-error.svg';
import { ReactComponent as MessageQueuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import Ripple from '@shared-components/ripple';
import { MessageState } from '@store/chats/models';
import {
  getTypingStringSelector,
  getChatSelector,
  getChatLastMessageUser,
  getChatLastMessageSelector,
  getSelectedChatMessagesSearchStringSelector,
} from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import { checkIfDatesAreDifferentDate, getDayMonthYear, getShortTimeAmPm } from '@utils/date-utils';
import { constructSystemMessageText } from '@utils/message-utils';
import renderText from '@utils/render-text/render-text';
import { replaceInUrl } from '@utils/replace-in-url';
import { getChatInterlocutor } from '@utils/user-utils';

import './chat-item.scss';

interface IChatItemProps {
  chatId: number;
}

const BLOCK_NAME = 'chat-item';

const truncateOptions = {
  length: 53,
  omission: '...',
};

const ChatItem: React.FC<IChatItemProps> = React.memo(({ chatId }) => {
  const { t } = useTranslation();
  const chat = useSelector(getChatSelector(chatId));
  const chatLastMessage = useSelector(getChatLastMessageSelector(chatId));
  const lastMessageUserCreator = useSelector(getChatLastMessageUser(chatId));
  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));

  const currentUserId = useSelector(myIdSelector);
  const typingString = useSelector(getTypingStringSelector(t, chatId));

  const messagesSearchString = useSelector(getSelectedChatMessagesSearchStringSelector);

  const chatLastMessageRef = useRef(chatLastMessage);
  const lastMessageUserCreatorRef = useRef(lastMessageUserCreator);
  const isLastMessageCreatorCurrentUserRef = useRef<null | boolean>(null);
  const lastActivityDateRef = useRef<null | string>(null);

  const isLastMessageCreatorCurrentUser: boolean = lastMessageUserCreator?.id === currentUserId;

  const messageUserCreator = messagesSearchString
    ? lastMessageUserCreatorRef.current
    : lastMessageUserCreator;

  useEffect(() => {
    if (messagesSearchString) return;
    lastMessageUserCreatorRef.current = lastMessageUserCreator;
  }, [lastMessageUserCreator, messagesSearchString]);

  useEffect(() => {
    if (messagesSearchString) return;

    if (
      chatLastMessage?.creationDateTime &&
      checkIfDatesAreDifferentDate(new Date(chatLastMessage.creationDateTime), new Date())
    ) {
      lastActivityDateRef.current = getDayMonthYear(chatLastMessage.creationDateTime);
    } else if (chatLastMessage) {
      lastActivityDateRef.current = getShortTimeAmPm(
        chatLastMessage.creationDateTime,
      ).toLowerCase();
    }
  }, [chatLastMessage, messagesSearchString]);

  useEffect(() => {
    if (messagesSearchString || !chatLastMessage) return;
    chatLastMessageRef.current = chatLastMessage;
  }, [chatLastMessage, messagesSearchString]);

  useEffect(() => {
    if (messagesSearchString || !lastMessageUserCreator) return;
    isLastMessageCreatorCurrentUserRef.current = lastMessageUserCreator?.id === currentUserId;
  }, [currentUserId, lastMessageUserCreator, messagesSearchString]);

  const messageText = useMemo((): string => {
    let messageToProcess;

    if (
      chatLastMessageRef.current?.linkedMessageType === MessageLinkType.Forward &&
      chatLastMessageRef.current?.linkedMessage !== null
    ) {
      messageToProcess = chatLastMessageRef.current?.linkedMessage;
    } else {
      messageToProcess = chatLastMessageRef.current;
    }

    if (messageToProcess && !messageToProcess.text) {
      return t('chatFromList.media');
    }

    if (
      chatLastMessageRef.current?.linkedMessageType &&
      !chatLastMessageRef.current?.linkedMessage &&
      !chatLastMessageRef.current?.text &&
      !size(chatLastMessageRef.current?.attachments)
    ) {
      return t('linkedMessage.message-deleted');
    }

    if (messageToProcess) {
      if (messageToProcess.systemMessageType !== SystemMessageType.None) {
        return truncate(
          constructSystemMessageText(
            // TODO: replace this logic
            messageToProcess,
            t,
            currentUserId,
            messageUserCreator,
          ),
          truncateOptions,
        );
      }

      if (chat.groupChat) {
        if (isLastMessageCreatorCurrentUserRef.current) {
          return truncate(`${t('chatFromList.you')}: ${messageToProcess.text}`, truncateOptions);
        }
        return truncate(
          `${messageUserCreator?.firstName}: ${messageToProcess.text}`,
          truncateOptions,
        );
      }

      return truncate(messageToProcess.text, truncateOptions);
    }

    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.groupChat, currentUserId, lastMessageUserCreator, t]);

  // TODO: Make this logic common across chat item and message item
  const messageStatIconMap = {
    [MessageState.QUEUED]: <MessageQueuedSvg />,
    [MessageState.SENT]: <MessageSentSvg />,
    [MessageState.READ]: <MessageReadSvg />,
    [MessageState.ERROR]: <MessageErrorSvg />,
    [MessageState.DELETED]: undefined,
    [MessageState.LOCALMESSAGE]: undefined,
    [MessageState.DRAFT]: undefined,
  };

  let messageStatus;
  if (
    !(
      chatLastMessage?.systemMessageType !== SystemMessageType.None ||
      !isLastMessageCreatorCurrentUser
    )
  ) {
    if (chatLastMessage.state) {
      messageStatus = messageStatIconMap[chatLastMessage.state];
    }
  }

  return (
    <NavLink
      to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', chat?.id])}
      className={BLOCK_NAME}
      activeClassName={classnames(BLOCK_NAME, `${BLOCK_NAME}--active`)}>
      {interlocutor && (
        <Avatar className={`${BLOCK_NAME}__avatar`} size={48} user={interlocutor} statusBadge />
      )}
      {chat?.groupChat && (
        <Avatar className={`${BLOCK_NAME}__avatar`} size={48} groupChat={chat?.groupChat} />
      )}
      <div className={`${BLOCK_NAME}__contents`}>
        <div className={`${BLOCK_NAME}__heading`}>
          <div className={`${BLOCK_NAME}__name`}>{getChatInterlocutor(interlocutor, chat, t)}</div>
          <div className={`${BLOCK_NAME}__status`}>{messageStatus}</div>
          <div className={`${BLOCK_NAME}__time`}>{lastActivityDateRef.current}</div>
        </div>
        <div className={`${BLOCK_NAME}__last-message`}>
          {typingString || renderText(messageText)}
        </div>
        {Boolean(chat?.unreadMessagesCount) && (
          <div
            className={classnames(`${BLOCK_NAME}__count`, {
              [`${BLOCK_NAME}__count--muted`]: chat?.isMuted,
            })}>
            {chat?.unreadMessagesCount}
          </div>
        )}
      </div>
      <Ripple />
    </NavLink>
  );
});

ChatItem.displayName = 'ChatItem';

export { ChatItem as ChatFromList };
