import React, { useEffect, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './message-list.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import {
  getIsSelectMessagesStateSelector,
  getMessagesByChatIdSelector,
  getMessagesLoadingSelector,
  getHasMoreMessagesMessagesSelector,
  getTypingStringSelector,
  getSelectedChatIdSelector,
  getSelectedChatUnreadMessagesCountSelector,
} from 'store/chats/selectors';
import { FadeAnimationWrapper } from 'components';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { MESSAGES_LIMIT } from 'app/utils/pagination-limits';
import { SelectedMessagesData, MessageItem } from 'app/components';
import { GetMessages } from 'app/store/chats/features/get-messages/get-messages';
import { MarkMessagesAsRead } from 'app/store/chats/features/mark-messages-as-read/mark-messages-as-read';
import { IMessage } from 'app/store/chats/models';
import { MessageUtils } from 'app/utils/message-utils';

const MessageList = React.memo(() => {
  const getMessages = useActionWithDispatch(GetMessages.action);
  const markMessagesAsRead = useActionWithDispatch(MarkMessagesAsRead.action);

  const { t } = useContext(LocalizationContext);

  const selectedChatId = useSelector(getSelectedChatIdSelector);
  const unreadMessagesCount = useSelector(getSelectedChatUnreadMessagesCountSelector);
  const isSelectState = useSelector(getIsSelectMessagesStateSelector);
  const messages = useSelector(getMessagesByChatIdSelector);
  const areMessagesLoading = useSelector(getMessagesLoadingSelector);
  const hasMoreMessages = useSelector(getHasMoreMessagesMessagesSelector);
  const typingString = useSelector(getTypingStringSelector(t, selectedChatId));

  useEffect(() => {
    if (selectedChatId && (unreadMessagesCount || 0) > 0) {
      markMessagesAsRead();
    }
  }, [unreadMessagesCount, selectedChatId]);

  const loadMore = useCallback(() => {
    const pageData = {
      limit: MESSAGES_LIMIT,
      offset: messages?.length || 0,
    };

    getMessages({
      page: pageData,
    });
  }, [messages?.length]);

  if (!selectedChatId) {
    return (
      <div className='chat__messages-list'>
        <div className='chat__select-chat'>{t('chat.select_chat')}</div>
      </div>
    );
  }

  const separatedItemsWithUserInfo = MessageUtils.signAndSeparate(messages || []);

  return (
    <div className='chat__messages-list'>
      <div className='chat__messages-container'>
        {typingString && <div className='chat__typing-notification'>{typingString}</div>}

        {!areMessagesLoading && !hasMoreMessages && (messages || []).length === 0 && (
          <div className='chat__messages-list__empty'>
            <p>{t('chat.empty')}</p>
          </div>
        )}

        <FadeAnimationWrapper isDisplayed={isSelectState}>
          <SelectedMessagesData />
        </FadeAnimationWrapper>

        <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreMessages} isLoading={areMessagesLoading} isReverse>
          {separatedItemsWithUserInfo.map((msg: IMessage) => (
            <MessageItem message={msg} key={msg.id} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});

MessageList.displayName = 'Chat';

export { MessageList };
