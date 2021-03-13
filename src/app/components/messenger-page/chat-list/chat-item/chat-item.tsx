import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import './chat-item.scss';
import { IChat, IMessage, MessageLinkType, MessageState, SystemMessageType } from 'store/chats/models';
import { MessageUtils } from 'app/utils/message-utils';

import { StatusBadge, Avatar } from 'components';
import { LocalizationContext } from 'app/app';
import { myIdSelector } from 'store/my-profile/selectors';
import truncate from 'lodash/truncate';

import MessageQeuedSvg from 'icons/message-queued.svg';
import MessageSentSvg from 'icons/message-sent.svg';
import MessageReadSvg from 'icons/message-read.svg';
import MessageErrorSvg from 'icons/message-error.svg';

import { getTypingStringSelector } from 'store/chats/selectors';
import { getChatInterlocutor, getInterlocutorInitials } from 'utils/interlocutor-name-utils';
import { isEqual } from 'lodash';

interface IChatItemProps {
  chat: IChat;
}

const ChatItem: React.FC<IChatItemProps> = React.memo(
  ({ chat }) => {
    const { t } = useContext(LocalizationContext);

    const currentUserId = useSelector(myIdSelector) as number;
    const typingString = useSelector(getTypingStringSelector(t, chat.id));

    const isMessageCreatorCurrentUser: boolean = chat.lastMessage?.userCreator?.id === currentUserId;

    const getMessageText = useCallback((): string => {
      const messageToProcess =
        chat.lastMessage?.linkedMessageType === MessageLinkType.Forward && !chat.lastMessage?.linkedMessage?.isDeleted
          ? chat.lastMessage?.linkedMessage
          : chat.lastMessage;

      if (
        (chat.lastMessage?.text.length === 0 && (chat.lastMessage.attachments?.length || 0) > 0) ||
        (chat.lastMessage?.linkedMessage?.text?.length === 0 && (chat.lastMessage?.linkedMessage.attachments?.length || 0) > 0)
      ) {
        return t('chatFromList.media');
      }

      if (chat.lastMessage?.text.length === 0 && (chat.lastMessage.attachments?.length || 0) === 0 && chat.lastMessage?.linkedMessage?.isDeleted) {
        return t('message-link.message-deleted');
      }

      if (messageToProcess) {
        if (
          messageToProcess &&
          (messageToProcess as IMessage).systemMessageType &&
          (messageToProcess as IMessage).systemMessageType !== SystemMessageType.None
        ) {
          return truncate(MessageUtils.constructSystemMessageText(messageToProcess as IMessage, t, currentUserId), {
            length: 53,
            omission: '...',
          });
        }

        if (chat.groupChat) {
          if (isMessageCreatorCurrentUser) {
            return truncate(`${t('chatFromList.you')}: ${messageToProcess?.text}`, {
              length: 53,
              omission: '...',
            });
          }
          return truncate(`${messageToProcess?.userCreator?.firstName}: ${messageToProcess?.text}`, {
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
    }, [chat.lastMessage]);

    return (
      <NavLink to={`/chats/${chat.id.toString()}`} className='chat-item' activeClassName='chat-item chat-item--active'>
        {!chat.groupChat ? (
          <StatusBadge containerClassName='chat-item__avatar-container' additionalClassNames='chat-item__avatar' user={chat.interlocutor!} />
        ) : (
          <Avatar className='chat-item__avatar chat-item__avatar-container' src={chat.groupChat?.avatar?.previewUrl}>
            {getInterlocutorInitials(chat)}
          </Avatar>
        )}
        <div className='chat-item__contents'>
          <div className='chat-item__heading'>
            <div className='chat-item__name'>{getChatInterlocutor(chat)}</div>
            <div className='chat-item__status'>
              {!(chat.lastMessage?.systemMessageType !== SystemMessageType.None || !isMessageCreatorCurrentUser) && (
                <>
                  {chat.lastMessage?.state === MessageState.QUEUED && <MessageQeuedSvg />}
                  {chat.lastMessage?.state === MessageState.SENT && <MessageSentSvg />}
                  {chat.lastMessage?.state === MessageState.READ && <MessageReadSvg />}
                  {chat.lastMessage?.state === MessageState.ERROR && <MessageErrorSvg />}
                </>
              )}
            </div>
            <div className='chat-item__time'>
              {MessageUtils.checkIfDatesAreSameDate(new Date(chat.lastMessage?.creationDateTime!), new Date())
                ? moment.utc(chat.lastMessage?.creationDateTime).local().format('dd MMM YY')
                : moment.utc(chat.lastMessage?.creationDateTime).local().format('LT')}
            </div>
          </div>
          <div className='chat-item__last-message'>{typingString || getMessageText()}</div>
          {(chat.unreadMessagesCount || false) && (
            <div className={chat.isMuted ? 'chat-item__count chat-item__count--muted' : 'chat-item__count'}>{chat.unreadMessagesCount}</div>
          )}
        </div>
      </NavLink>
    );
  },
  (prevProps, nextProps) => {
    const result =
      prevProps.chat.id === nextProps.chat.id &&
      prevProps.chat.unreadMessagesCount === nextProps.chat.unreadMessagesCount &&
      prevProps.chat.isMuted === nextProps.chat.isMuted &&
      prevProps.chat.interlocutor?.firstName === nextProps.chat.interlocutor?.firstName &&
      prevProps.chat.interlocutor?.lastName === nextProps.chat.interlocutor?.lastName &&
      prevProps.chat.groupChat?.name === nextProps.chat.groupChat?.name &&
      isEqual(prevProps.chat.interlocutor?.avatar, nextProps.chat.interlocutor?.avatar) &&
      isEqual(prevProps.chat.groupChat?.avatar, nextProps.chat.groupChat?.avatar) &&
      isEqual(prevProps.chat.lastMessage, nextProps.chat.lastMessage);
    return result;
  },
);

ChatItem.displayName = 'ChatFromList';

export { ChatItem as ChatFromList };
