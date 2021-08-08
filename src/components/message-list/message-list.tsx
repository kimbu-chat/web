import React, { useEffect, useCallback, useRef, useMemo } from 'react';

import dayjs from 'dayjs';
import { SystemMessageType } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  INTERSECTION_THROTTLE_FOR_MEDIA,
  INTERSECTION_THRESHOLD_FOR_MEDIA,
} from '@common/constants/media';
import { InfiniteScroll } from '@components/infinite-scroll';
import { CenteredLoader, LoaderSize } from '@components/loader';
import { MessageItem } from '@components/message-item';
import { SelectedMessagesData } from '@components/selected-messages-data';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useIntersectionObserver } from '@hooks/use-intersection-observer';
import { getMessagesAction, markMessagesAsReadAction } from '@store/chats/actions';
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
import { DAY_NAME_MONTH_NAME_DAY_NUMBER_YEAR } from '@utils/constants';
import { checkIfDatesAreDifferentDate } from '@utils/date-utils';
import { MESSAGES_LIMIT } from '@utils/pagination-limits';

import { Welcome } from '../welcome/welcome';

import './message-list.scss';

const BLOCK_NAME = 'chat';

const MessageList = () => {
  const getMessages = useActionWithDispatch(getMessagesAction);
  const markMessagesAsRead = useActionWithDispatch(markMessagesAsReadAction);

  const { t } = useTranslation();

  const rootRef = useRef<HTMLDivElement>(null);

  const { observe: observeIntersectionForMedia } = useIntersectionObserver({
    rootRef,
    throttleMs: INTERSECTION_THROTTLE_FOR_MEDIA,
    threshold: INTERSECTION_THRESHOLD_FOR_MEDIA,
  });

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

  const separatedMessagesPacks = useMemo(
    () =>
      messagesIds?.reduce(
        (accumulator: number[][], currentMessageId, index) => {
          if (
            index > 0 &&
            checkIfDatesAreDifferentDate(
              messages[messagesIds[index - 1]]?.creationDateTime || '',
              messages[currentMessageId]?.creationDateTime || '',
            )
          ) {
            accumulator.push([]);
          }

          accumulator[accumulator.length - 1].push(currentMessageId);

          return accumulator;
        },
        [[]] as number[][],
      ),
    [messages, messagesIds],
  );

  if (!selectedChatId) {
    return <Welcome />;
  }

  return (
    <div className={`${BLOCK_NAME}__messages-list`}>
      <div className={`${BLOCK_NAME}__messages-container`} ref={rootRef}>
        {!areMessagesLoading &&
          areMessagesLoading !== undefined &&
          !hasMoreMessages &&
          !messagesIds?.length && (
            <div className={`${BLOCK_NAME}__messages-list__empty`}>
              <p>{t('chat.empty')}</p>f
            </div>
          )}

        {selectedMessageIds.length > 0 && <SelectedMessagesData />}
        {messagesIds?.length ? (
          <InfiniteScroll
            containerRef={rootRef}
            onReachBottom={loadMore}
            hasMore={hasMoreMessages}
            className={`${BLOCK_NAME}__messages-list__scroll`}
            isLoading={areMessagesLoading}>
            {separatedMessagesPacks.map((separatedMessages) => (
              <div
                key={`${separatedMessages[separatedMessages.length - 1]}group`}
                className={`${BLOCK_NAME}__messages-group`}>
                {separatedMessages.map((messageId, index) => (
                  <MessageItem
                    observeIntersection={observeIntersectionForMedia}
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
                  <div className={`${BLOCK_NAME}__separator`}>
                    <span className={`${BLOCK_NAME}__separator-date`}>
                      {dayjs
                        .utc(messages[separatedMessages[0]]?.creationDateTime || '')
                        .local()
                        .format(DAY_NAME_MONTH_NAME_DAY_NUMBER_YEAR)
                        .toString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <CenteredLoader size={LoaderSize.LARGE} />
        )}
      </div>
    </div>
  );
};

MessageList.displayName = 'MessageList';

export { MessageList };
