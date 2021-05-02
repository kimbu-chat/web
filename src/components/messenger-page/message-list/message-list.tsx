import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './message-list.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

import { useTranslation } from 'react-i18next';
import {
  getIsSelectMessagesStateSelector,
  getMessagesIdsByChatIdSelector,
  getMessagesLoadingSelector,
  getHasMoreMessagesMessagesSelector,
  getSelectedChatIdSelector,
  getSelectedChatUnreadMessagesCountSelector,
} from '@store/chats/selectors';
import { InfiniteScroll, SelectedMessagesData, MessageItem } from '@components/messenger-page';
import { FadeAnimationWrapper } from '@components/shared';

import { MESSAGES_LIMIT } from '@utils/pagination-limits';

import { getMessagesAction, markMessagesAsReadAction } from '@store/chats/actions';

const MessageList = () => {
  const getMessages = useActionWithDispatch(getMessagesAction);
  const markMessagesAsRead = useActionWithDispatch(markMessagesAsReadAction);

  const { t } = useTranslation();

  const selectedChatId = useSelector(getSelectedChatIdSelector);
  const unreadMessagesCount = useSelector(getSelectedChatUnreadMessagesCountSelector);
  const isSelectState = useSelector(getIsSelectMessagesStateSelector);
  const messagesIds = useSelector(getMessagesIdsByChatIdSelector);
  const areMessagesLoading = useSelector(getMessagesLoadingSelector);
  const hasMoreMessages = useSelector(getHasMoreMessagesMessagesSelector);

  useEffect(() => {
    if (selectedChatId && (unreadMessagesCount || 0) > 0) {
      markMessagesAsRead();
    }
  }, [unreadMessagesCount, selectedChatId, markMessagesAsRead]);

  const loadMore = useCallback(() => {
    const pageData = {
      limit: MESSAGES_LIMIT,
      offset: messagesIds?.length || 0,
    };

    getMessages({
      page: pageData,
    });
  }, [getMessages, messagesIds?.length]);

  if (!selectedChatId) {
    return (
      <div className="chat__messages-list">
        <div className="chat__select-chat">{t('chat.select_chat')}</div>
      </div>
    );
  }

  return (
    <div className="chat__messages-list">
      <div className="chat__messages-container">
        {!areMessagesLoading && !hasMoreMessages && (messagesIds || []).length === 0 && (
          <div className="chat__messages-list__empty">
            <p>{t('chat.empty')}</p>
          </div>
        )}

        <FadeAnimationWrapper isDisplayed={isSelectState}>
          <SelectedMessagesData />
        </FadeAnimationWrapper>

        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreMessages}
          isLoading={areMessagesLoading}
          isReverse>
          {messagesIds?.map((messageId) => (
            <MessageItem selectedChatId={selectedChatId} messageId={messageId} key={messageId} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

MessageList.displayName = 'MessageList';

export { MessageList };
