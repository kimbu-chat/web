import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import truncate from 'lodash/truncate';

import {
  MessageLinkType,
  MessageState,
  SystemMessageType,
  INormalizedMessage,
} from '@store/chats/models';
import { Avatar } from '@components/avatar';
import { myIdSelector } from '@store/my-profile/selectors';
import { ReactComponent as MessageQeuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';
import { ReactComponent as MessageErrorSvg } from '@icons/message-error.svg';
import { getTypingStringSelector, getChatSelector } from '@store/chats/selectors';
import { getChatInterlocutor } from '@utils/user-utils';
import { constructSystemMessageText } from '@utils/message-utils';
import { checkIfDatesAreDifferentDate } from '@utils/date-utils';
import { getUserSelector } from '@store/users/selectors';

import './chat-item.scss';

interface IChatItemProps {
  chatId: number;
}

const ChatItem: React.FC<IChatItemProps> = React.memo(({ chatId }) => {
  const { t } = useTranslation();
  const chat = useSelector(getChatSelector(chatId));
  const lastMessageUserCreator = useSelector(getUserSelector(chat?.lastMessage?.userCreatorId));
  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));

  const currentUserId = useSelector(myIdSelector) as number;
  const typingString = useSelector(getTypingStringSelector(t, chatId));

  const isMessageCreatorCurrentUser: boolean = chat?.lastMessage?.userCreatorId === currentUserId;

  const getMessageText = useCallback((): string => {
    const messageToProcess =
      chat?.lastMessage?.linkedMessageType === MessageLinkType.Forward &&
      chat?.lastMessage?.linkedMessage !== null
        ? chat?.lastMessage?.linkedMessage
        : chat?.lastMessage;

    if (
      (chat?.lastMessage?.text.length === 0 && (chat?.lastMessage.attachments?.length || 0) > 0) ||
      (chat?.lastMessage?.linkedMessage?.text?.length === 0 &&
        (chat?.lastMessage?.linkedMessage?.attachments?.length || 0) > 0)
    ) {
      return t('chatFromList.media');
    }

    if (
      chat?.lastMessage?.text.length === 0 &&
      (chat?.lastMessage.attachments?.length || 0) === 0 &&
      chat?.lastMessage?.linkedMessage === null
    ) {
      return t('message-link.message-deleted');
    }

    if (messageToProcess) {
      if (
        messageToProcess &&
        (messageToProcess as INormalizedMessage).systemMessageType &&
        (messageToProcess as INormalizedMessage).systemMessageType !== SystemMessageType.None
      ) {
        return truncate(
          constructSystemMessageText(
            // TODO: replace this logic
            messageToProcess as INormalizedMessage,
            t,
            currentUserId,
            lastMessageUserCreator,
          ),
          {
            length: 53,
            omission: '...',
          },
        );
      }

      if (chat?.groupChat) {
        if (isMessageCreatorCurrentUser) {
          return truncate(`${t('chatFromList.you')}: ${messageToProcess?.text}`, {
            length: 53,
            omission: '...',
          });
        }
        return truncate(`${lastMessageUserCreator?.firstName}: ${messageToProcess?.text}`, {
          length: 53,
          omission: '...',
        });
      }

      const shortedText = truncate(messageToProcess?.text, {
        length: 53,
        omission: '...',
      });

      return shortedText;
    }

    return '';
  }, [
    chat?.groupChat,
    chat?.lastMessage,
    currentUserId,
    isMessageCreatorCurrentUser,
    lastMessageUserCreator,
    t,
  ]);

  const messageStatIconMap = {
    [MessageState.QUEUED]: <MessageQeuedSvg />,
    [MessageState.SENT]: <MessageSentSvg />,
    [MessageState.READ]: <MessageReadSvg />,
    [MessageState.ERROR]: <MessageErrorSvg />,
    [MessageState.DELETED]: undefined,
    [MessageState.LOCALMESSAGE]: undefined,
  };

  return (
    <NavLink
      to={`/chats/${chat?.id.toString()}`}
      className="chat-item"
      activeClassName="chat-item chat-item--active">
      {interlocutor && (
        <div className="chat-item__avatar-container">
          <Avatar className="chat-item__avatar" user={interlocutor} statusBadge />
        </div>
      )}

      {chat?.groupChat && (
        <Avatar
          className="chat-item__avatar chat-item__avatar-container"
          groupChat={chat?.groupChat}
        />
      )}
      <div className="chat-item__contents">
        <div className="chat-item__heading">
          <div className="chat-item__name">{getChatInterlocutor(interlocutor, chat, t)}</div>
          <div className="chat-item__status">
            {!(
              chat?.lastMessage?.systemMessageType !== SystemMessageType.None ||
              !isMessageCreatorCurrentUser
            ) &&
              chat?.lastMessage.state &&
              messageStatIconMap[chat?.lastMessage.state]}
          </div>
          <div className="chat-item__time">
            {checkIfDatesAreDifferentDate(
              new Date(chat?.lastMessage?.creationDateTime as Date),
              new Date(),
            )
              ? dayjs.utc(chat?.lastMessage?.creationDateTime).local().format('dd MMM YY')
              : dayjs.utc(chat?.lastMessage?.creationDateTime).local().format('LT').toLowerCase()}
          </div>
        </div>
        <div className="chat-item__last-message">{typingString || getMessageText()}</div>
        {Boolean(chat?.unreadMessagesCount) && (
          <div
            className={
              chat?.isMuted ? 'chat-item__count chat-item__count--muted' : 'chat-item__count'
            }>
            {chat?.unreadMessagesCount}
          </div>
        )}
      </div>
    </NavLink>
  );
});

ChatItem.displayName = 'ChatFromList';

export { ChatItem as ChatFromList };
