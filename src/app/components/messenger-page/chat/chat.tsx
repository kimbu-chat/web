import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './chat.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { MessageActions } from 'store/messages/actions';
import { LocalizationContext } from 'app/app';
import { getSelectedChatSelector, getTypingString } from 'store/chats/selectors';
import { getMessagesLoading, getMessagesByChatId, getSelectedMessagesLength } from 'store/messages/selectors';
import { MessageUtils } from 'app/utils/message-utils';
import moment from 'moment';
import { FadeAnimationWrapper } from 'components';
import { ChatActions } from 'store/chats/actions';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { MESSAGES_LIMIT } from 'app/utils/pagination-limits';
import { SelectedMessagesData, MessageItem } from 'app/components';

const Chat = React.memo(() => {
  const getMessages = useActionWithDispatch(MessageActions.getMessages);
  const markMessagesAsRead = useActionWithDispatch(ChatActions.markMessagesAsRead);

  const { t } = useContext(LocalizationContext);

  const selectedChat = useSelector(getSelectedChatSelector);
  const isSelectState = useSelector(getSelectedMessagesLength) > 0;
  const messageList = useSelector(getMessagesByChatId(selectedChat?.id!));
  const areMessagesLoading = useSelector(getMessagesLoading);

  const messages = messageList?.messages;
  const hasMoreMessages = messageList?.hasMoreMessages;

  useEffect(() => {
    if (selectedChat && (selectedChat.unreadMessagesCount || 0) > 0 && messages) {
      markMessagesAsRead({
        chatId: selectedChat.id,
        lastReadMessageId: messages[0].id,
      });
    }
  }, [selectedChat?.id, selectedChat?.unreadMessagesCount, messages]);

  useEffect(() => {
    if (selectedChat) {
      // fetching first 25messages
      getMessages({
        page: {
          limit: MESSAGES_LIMIT,
          offset: 0,
        },
        chat: selectedChat,
      });
    }
  }, [selectedChat?.id]);

  const loadMore = useCallback(() => {
    const pageData = {
      limit: MESSAGES_LIMIT,
      offset: messages?.length || 0,
    };

    if (selectedChat) {
      getMessages({
        page: pageData,
        chat: selectedChat,
      });
    }
  }, [messages?.length, selectedChat]);

  const messagesContainerRef = useRef(null);

  if (!selectedChat) {
    return (
      <div className='messenger__messages-list'>
        <div className='messenger__select-chat'>{t('chat.select_chat')}</div>
      </div>
    );
  }

  const itemsWithUserInfo = MessageUtils.signAndSeparate(messages || []);

  return (
    <div className='messenger__messages-list'>
      <div ref={messagesContainerRef} className='messenger__messages-container'>
        {(selectedChat?.typingInterlocutors?.length || 0) > 0 && <div className='messenger__typing-notification'>{getTypingString(t, selectedChat)}</div>}

        {itemsWithUserInfo.length === 0 && !areMessagesLoading && (
          <div className='messenger__messages-list__empty'>
            <p>{t('chat.empty')}</p>
          </div>
        )}

        <FadeAnimationWrapper isDisplayed={isSelectState}>
          <SelectedMessagesData />
        </FadeAnimationWrapper>

        <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreMessages} isLoading={areMessagesLoading} isReverse>
          {itemsWithUserInfo.map((msg) => (
            <React.Fragment key={msg.id}>
              <MessageItem message={msg} key={msg.id} />
              {msg.needToShowDateSeparator && (
                <div className='message__separator message__separator--capitalized'>
                  <span>{moment.utc(msg.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});

Chat.displayName = 'Chat';

export { Chat };
