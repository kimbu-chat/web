import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import './chat-from-list.scss';
import { Chat } from 'store/chats/models';
import { MessageUtils } from 'app/utils/message-utils';

import { StatusBadge, Avatar } from 'components';
import { SystemMessageType, Message, MessageState } from 'store/messages/models';
import { LocalizationContext } from 'app/app';
import { getMyIdSelector } from 'store/my-profile/selectors';
import truncate from 'lodash/truncate';

import MessageQeuedSvg from 'icons/ic-time.svg';
import MessageSentSvg from 'icons/ic-tick.svg';
import MessageReadSvg from 'icons/ic-double_tick.svg';
import { getTypingString } from 'store/chats/selectors';
import { getChatInterlocutor, getInterlocutorInitials } from '../../../../utils/interlocutor-name-utils';

namespace ChatFromListNS {
  export interface Props {
    chat: Chat;
  }
}

const ChatFromList = React.memo(
  ({ chat }: ChatFromListNS.Props) => {
    const { interlocutor, lastMessage, groupChat } = chat;
    const { t } = useContext(LocalizationContext);
    const currentUserId = useSelector(getMyIdSelector) as number;
    const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;

    const getChatAvatar = useCallback((): string => {
      if (interlocutor) {
        return interlocutor.avatar?.previewUrl as string;
      }

      return groupChat?.avatar?.previewUrl as string;
    }, []);

    const getMessageText = (): string => {
      const { lastMessage, groupChat } = chat;
      if (lastMessage) {
        if (lastMessage && lastMessage?.systemMessageType !== SystemMessageType.None) {
          return truncate(MessageUtils.constructSystemMessageText(lastMessage as Message, t, currentUserId), {
            length: 53,
            omission: '...',
          });
        }

        if (groupChat) {
          if (isMessageCreatorCurrentUser) {
            return truncate(`${t('chatFromList.you')}: ${lastMessage?.text}`, {
              length: 53,
              omission: '...',
            });
          }
          return truncate(`${lastMessage?.userCreator?.firstName}: ${lastMessage?.text}`, {
            length: 53,
            omission: '...',
          });
        }

        const shortedText = truncate(lastMessage?.text, {
          length: 53,
          omission: '...',
        });

        return shortedText;
      }

      return '';
    };

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
          <div className='chat-from-list__last-message'>{(chat.typingInterlocutors?.length || 0) > 0 ? getTypingString(t, chat) : getMessageText()}</div>
          {(chat.unreadMessagesCount || false) && (
            <div className={chat.isMuted ? 'chat-from-list__count chat-from-list__count--muted' : 'chat-from-list__count'}>{chat.unreadMessagesCount}</div>
          )}
        </div>
      </NavLink>
    );
  },
  (prevProps, nextProps) =>
    prevProps.chat.groupChat?.avatar?.previewUrl === nextProps.chat.groupChat?.avatar?.previewUrl &&
    prevProps.chat.groupChat?.name === nextProps.chat.groupChat?.name &&
    prevProps.chat.lastMessage?.state === nextProps.chat.lastMessage?.state &&
    prevProps.chat.lastMessage?.text === nextProps.chat.lastMessage?.text &&
    prevProps.chat.unreadMessagesCount === nextProps.chat.unreadMessagesCount,
);

ChatFromList.displayName = 'ChatFromList';

export { ChatFromList };
