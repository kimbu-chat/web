import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import './chat-from-list.scss';
import { IChat, IMessage, MessageLinkType, MessageState, SystemMessageType } from 'store/chats/models';
import { MessageUtils } from 'app/utils/message-utils';

import { StatusBadge, Avatar } from 'components';
import { LocalizationContext } from 'app/app';
import { getMyIdSelector } from 'store/my-profile/selectors';
import truncate from 'lodash/truncate';

import MessageQeuedSvg from 'icons/ic-time.svg';
import MessageSentSvg from 'icons/ic-tick.svg';
import MessageReadSvg from 'icons/ic-double_tick.svg';
import { getTypingStringSelector } from 'store/chats/selectors';
import { getChatInterlocutor, getInterlocutorInitials } from 'utils/interlocutor-name-utils';

interface IChatFromListProps {
  chat: IChat;
}

const ChatFromList: React.FC<IChatFromListProps> = React.memo(({ chat }) => {
  const { interlocutor, lastMessage, groupChat } = chat;
  const { t } = useContext(LocalizationContext);

  const currentUserId = useSelector(getMyIdSelector) as number;
  const typingString = useSelector(getTypingStringSelector(t, chat.id));

  const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;

  const getChatAvatar = useCallback((): string => {
    if (interlocutor) {
      return interlocutor.avatar?.previewUrl as string;
    }

    return groupChat?.avatar?.previewUrl as string;
  }, [interlocutor?.avatar?.previewUrl, groupChat?.avatar?.previewUrl]);

  const getMessageText = useCallback((): string => {
    const messageToProcess = lastMessage?.linkedMessageType === MessageLinkType.Forward ? lastMessage?.linkedMessage : lastMessage;

    if (
      (lastMessage?.text.length === 0 && (lastMessage.attachments?.length || 0) > 0) ||
      (lastMessage?.linkedMessage?.text.length === 0 && (lastMessage?.linkedMessage.attachments?.length || 0) > 0)
    ) {
      return t('chatFromList.media');
    }

    if (messageToProcess) {
      if (messageToProcess && (messageToProcess as IMessage).systemMessageType && (messageToProcess as IMessage).systemMessageType !== SystemMessageType.None) {
        return truncate(MessageUtils.constructSystemMessageText(messageToProcess as IMessage, t, currentUserId), {
          length: 53,
          omission: '...',
        });
      }

      if (groupChat) {
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
  }, [lastMessage]);

  return (
    <NavLink to={`/chats/${chat.id.toString()}`} className='chat-from-list' activeClassName='chat-from-list chat-from-list--active'>
      <div className='chat-from-list__active-line' />
      {!groupChat ? (
        <StatusBadge containerClassName='chat-from-list__avatar-container' additionalClassNames='chat-from-list__avatar' user={chat.interlocutor!} />
      ) : (
        <Avatar className='chat-from-list__avatar chat-from-list__avatar-container' src={getChatAvatar()}>
          {getInterlocutorInitials(chat)}
        </Avatar>
      )}

      <div className='chat-from-list__contents'>
        <div className='chat-from-list__heading'>
          <div className='chat-from-list__name'>{getChatInterlocutor(chat)}</div>
          <div className='chat-from-list__status'>
            {!(lastMessage?.systemMessageType !== SystemMessageType.None || !isMessageCreatorCurrentUser) && (
              <>
                {lastMessage?.state === MessageState.QUEUED && <MessageQeuedSvg />}
                {lastMessage?.state === MessageState.SENT && <MessageSentSvg />}
                {lastMessage?.state === MessageState.READ && <MessageReadSvg />}
              </>
            )}
          </div>
          <div className='chat-from-list__time'>
            {MessageUtils.checkIfDatesAreSameDate(new Date(lastMessage?.creationDateTime!), new Date())
              ? moment.utc(lastMessage?.creationDateTime).local().format('dd MMM YY')
              : moment.utc(lastMessage?.creationDateTime).local().format('LT')}
          </div>
        </div>
        <div className='chat-from-list__last-message'>{typingString || getMessageText()}</div>
        {(chat.unreadMessagesCount || false) && (
          <div className={chat.isMuted ? 'chat-from-list__count chat-from-list__count--muted' : 'chat-from-list__count'}>{chat.unreadMessagesCount}</div>
        )}
      </div>
    </NavLink>
  );
});

ChatFromList.displayName = 'ChatFromList';

export { ChatFromList };
