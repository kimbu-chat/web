import React, { useMemo } from 'react';

import classnames from 'classnames';
import { MessageLinkType, SystemMessageType } from 'kimbu-models';
import { size } from 'lodash';
import truncate from 'lodash/truncate';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { MessageStatus } from '@components/message-status';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import Ripple from '@shared-components/ripple';
import { getTypingStringSelector, getChatSelector, getChatLastMessageUser, getChatLastMessageSelector } from '@store/chats/selectors';
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

  const isLastMessageCreatorCurrentUser: boolean = lastMessageUserCreator?.id === currentUserId;

  const messageText = useMemo((): string => {
    let messageToProcess;

    if (chatLastMessage?.linkedMessageType === MessageLinkType.Forward && chatLastMessage?.linkedMessage !== null) {
      messageToProcess = chatLastMessage?.linkedMessage;
    } else {
      messageToProcess = chatLastMessage;
    }

    if (messageToProcess && !messageToProcess.text) {
      return t('chatFromList.media');
    }

    if (chatLastMessage?.linkedMessageType && !chatLastMessage?.linkedMessage && !chatLastMessage?.text && !size(chatLastMessage?.attachments)) {
      return t('linkedMessage.message-deleted');
    }

    if (messageToProcess) {
      if (messageToProcess.systemMessageType && messageToProcess.systemMessageType !== SystemMessageType.None) {
        return truncate(
          constructSystemMessageText(
            // TODO: replace this logic
            messageToProcess,
            t,
            currentUserId,
            lastMessageUserCreator,
          ),
          truncateOptions,
        );
      }

      if (chat.groupChat) {
        if (isLastMessageCreatorCurrentUser) {
          return truncate(`${t('chatFromList.you')}: ${messageToProcess.text}`, truncateOptions);
        }
        return truncate(`${lastMessageUserCreator?.firstName}: ${messageToProcess.text}`, truncateOptions);
      }

      return truncate(messageToProcess.text, truncateOptions);
    }

    return '';
  }, [chatLastMessage, t, chat.groupChat, currentUserId, lastMessageUserCreator, isLastMessageCreatorCurrentUser]);

  const messageDateTime = useMemo(() => {
    if (!chatLastMessage?.creationDateTime) return '';

    if (checkIfDatesAreDifferentDate(new Date(chatLastMessage.creationDateTime), new Date())) {
      return getDayMonthYear(chatLastMessage.creationDateTime);
    }

    return getShortTimeAmPm(chatLastMessage.creationDateTime).toLowerCase();
  }, [chatLastMessage?.creationDateTime]);

  const messageStatus = useMemo(() => {
    if (!chatLastMessage?.state || chatLastMessage?.systemMessageType !== SystemMessageType.None || !isLastMessageCreatorCurrentUser) {
      return <></>;
    }

    return <MessageStatus state={chatLastMessage.state} />;
  }, [chatLastMessage?.systemMessageType, chatLastMessage?.state, isLastMessageCreatorCurrentUser]);

  return (
    <NavLink
      to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', chat?.id])}
      className={({ isActive }) => classnames(BLOCK_NAME, { [`${BLOCK_NAME}--active`]: isActive })}>
      {interlocutor && <Avatar className={`${BLOCK_NAME}__avatar`} size={48} user={interlocutor} statusBadge />}
      {chat?.groupChat && <Avatar className={`${BLOCK_NAME}__avatar`} size={48} groupChat={chat?.groupChat} />}
      <div className={`${BLOCK_NAME}__contents`}>
        <div className={`${BLOCK_NAME}__heading`}>
          <div className={`${BLOCK_NAME}__name`}>{getChatInterlocutor(interlocutor, chat, t)}</div>
          <div className={`${BLOCK_NAME}__status`}>{messageStatus}</div>
          <div className={`${BLOCK_NAME}__time`}>{messageDateTime}</div>
        </div>
        <div className={`${BLOCK_NAME}__last-message`}>{typingString || renderText(messageText)}</div>
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
