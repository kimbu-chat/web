import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import {
  getMessagesIdsByChatIdSelector,
  getSelectedMessageIds,
  getMessagesLoadingSelector,
  getHasMoreMessagesMessagesSelector,
  getSelectedChatIdSelector,
  getSelectedChatUnreadMessagesCountSelector,
  getSelectedChatMessagesSelector,
  getSelectedChatMessagesSearchStringSelector,
} from '@store/chats/selectors';
import {
  InfiniteScroll,
  SelectedMessagesData,
  MessageItem,
  FadeAnimationWrapper,
} from '@components';
import { MESSAGES_LIMIT } from '@utils/pagination-limits';
import { SystemMessageType } from '@store/chats/models';
import { getMessagesAction, markMessagesAsReadAction } from '@store/chats/actions';
import { checkIfDatesAreDifferentDate } from '@utils/date-utils';

import './message-list.scss';

const MessageList = () => {
  const getMessages = useActionWithDispatch(getMessagesAction);
  const markMessagesAsRead = useActionWithDispatch(markMessagesAsReadAction);

  const { t } = useTranslation();

  const selectedChatId = useSelector(getSelectedChatIdSelector);
  const unreadMessagesCount = useSelector(getSelectedChatUnreadMessagesCountSelector);
  const selectedMessageIds = useSelector(getSelectedMessageIds);
  const messagesIds = useSelector(getMessagesIdsByChatIdSelector);
  const messages = useSelector(getSelectedChatMessagesSelector);
  const areMessagesLoading = useSelector(getMessagesLoadingSelector);
  const hasMoreMessages = useSelector(getHasMoreMessagesMessagesSelector);
  const messagesSearchString = useSelector(getSelectedChatMessagesSearchStringSelector);

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
      isFromScroll: true,
      searchString: messagesSearchString,
    });
  }, [getMessages, messagesIds?.length, messagesSearchString]);

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

        <FadeAnimationWrapper isDisplayed={selectedMessageIds.length > 0}>
          <SelectedMessagesData />
        </FadeAnimationWrapper>

        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreMessages}
          isLoading={areMessagesLoading}
          isReverse>
          {messagesIds
            ?.reduce(
              (accumulator: number[][], currentMessageId, index) => {
                if (
                  index > 0 &&
                  checkIfDatesAreDifferentDate(
                    (messages && messages[messagesIds[index - 1]]?.creationDateTime) || '',
                    (messages && messages[currentMessageId]?.creationDateTime) || '',
                  )
                ) {
                  accumulator.push([]);
                }

                accumulator[accumulator.length - 1].push(currentMessageId);

                return accumulator;
              },
              [[]] as number[][],
            )
            .map((separatedMessages) => (
              <div key={`${separatedMessages[0]}group`} className="chat__messages-group">
                {separatedMessages.map((messageId, index) => (
                  <MessageItem
                    selectedChatId={selectedChatId}
                    isSelected={selectedMessageIds.includes(messageId)}
                    messageId={messageId}
                    key={messageId}
                    needToShowCreator={
                      messages &&
                      (messages[messageId]?.userCreatorId !==
                        messages[separatedMessages[index + 1]]?.userCreatorId ||
                        messages[separatedMessages[index + 1]]?.systemMessageType !==
                          SystemMessageType.None)
                    }
                  />
                ))}
                {separatedMessages.length > 0 && (
                  <div className="message__separator">
                    <span>
                      {dayjs
                        .utc((messages && messages[separatedMessages[0]]?.creationDateTime) || '')
                        .local()
                        .format('dddd, MMMM D, YYYY')
                        .toString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

MessageList.displayName = 'MessageList';

export { MessageList };