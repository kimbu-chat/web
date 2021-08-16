import React, { useMemo } from 'react';

import classnames from 'classnames';
import { MessageLinkType, SystemMessageType } from 'kimbu-models';
import truncate from 'lodash/truncate';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { ReactComponent as MessageErrorSvg } from '@icons/message-error.svg';
import { ReactComponent as MessageQeuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import Ripple from '@shared-components/ripple';
import { INormalizedMessage, MessageState } from '@store/chats/models';
import { getTypingStringSelector, getChatSelector } from '@store/chats/selectors';
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

const ChatItem: React.FC<IChatItemProps> = React.memo(({ chatId }) => {
  const { t } = useTranslation();
  const chat = useSelector(getChatSelector(chatId));
  const lastMessageUserCreator = useSelector(getUserSelector(chat?.lastMessage?.userCreatorId));
  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));

  const currentUserId = useSelector(myIdSelector) as number;
  const typingString = useSelector(getTypingStringSelector(t, chatId));

  const isMessageCreatorCurrentUser: boolean = chat?.lastMessage?.userCreatorId === currentUserId;

  const messageText = useMemo((): string => {
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
          <div className={`${BLOCK_NAME}__status`}>
            {!(
              chat?.lastMessage?.systemMessageType !== SystemMessageType.None ||
              !isMessageCreatorCurrentUser
            ) &&
              chat?.lastMessage.state &&
              messageStatIconMap[chat?.lastMessage.state]}
          </div>
          <div className={`${BLOCK_NAME}__time`}>
            {chat?.lastMessage &&
              chat.lastMessage.creationDateTime &&
              (checkIfDatesAreDifferentDate(new Date(chat.lastMessage.creationDateTime), new Date())
                ? getDayMonthYear(chat.lastMessage.creationDateTime)
                : getShortTimeAmPm(chat.lastMessage.creationDateTime).toLowerCase())}
          </div>
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

ChatItem.displayName = 'ChatFromList';

export { ChatItem as ChatFromList };
