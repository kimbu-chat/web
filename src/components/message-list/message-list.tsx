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

import { Welcome } from '../welcome/welcome';

import './message-list.scss';

const BLOCK_NAME = 'chat';

type ISeparatedMessagesPack = {
  date: string;
  messages: number[];
};

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
    getMessages({
      isFromScroll: true,
      searchString: messagesSearchString,
    });
  }, [getMessages, messagesSearchString]);

  const formatDateForSeparator = useCallback(
    (date) => dayjs.utc(date).local().format(DAY_NAME_MONTH_NAME_DAY_NUMBER_YEAR).toString(),
    [],
  );

  const separatedMessagesPacks = useMemo(
    () =>
      messagesIds?.reduce((accumulator: ISeparatedMessagesPack[], currentMessageId, index) => {
        if (!accumulator.length) {
          return [
            ...accumulator,
            {
              date: formatDateForSeparator(messages[currentMessageId]?.creationDateTime),
              messages: [currentMessageId],
            },
          ];
        }
        if (
          checkIfDatesAreDifferentDate(
            messages[messagesIds[index - 1]]?.creationDateTime,
            messages[currentMessageId]?.creationDateTime,
          )
        ) {
          return [
            ...accumulator,
            {
              date: formatDateForSeparator(messages[currentMessageId]?.creationDateTime),
              messages: [currentMessageId],
            },
          ];
        }

        accumulator[accumulator.length - 1]?.messages.push(currentMessageId);

        return accumulator;
      }, []),
    [messages, messagesIds, formatDateForSeparator],
  );

  useEffect(loadMore, [loadMore, selectedChatId]);

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
              <p>{t('chat.empty')}</p>
            </div>
          )}

        {selectedMessageIds.length > 0 && <SelectedMessagesData />}
        {!areMessagesLoading || messagesIds?.length
          ? Boolean(messagesIds?.length) && (
              <InfiniteScroll
                containerRef={rootRef}
                onReachBottom={loadMore}
                hasMore={hasMoreMessages}
                className={`${BLOCK_NAME}__messages-list__scroll`}
                isLoading={areMessagesLoading}>
                {separatedMessagesPacks.map((pack) => (
                  <div key={pack.date} className={`${BLOCK_NAME}__messages-group`}>
                    {pack.messages.map((messageId, index) => (
                      <MessageItem
                        observeIntersection={observeIntersectionForMedia}
                        selectedChatId={selectedChatId}
                        isSelected={selectedMessageIds.includes(messageId)}
                        messageId={messageId}
                        key={messages[messageId]?.clientId || messages[messageId].id}
                        needToShowCreator={
                          messages &&
                          (messages[messageId]?.userCreatorId !==
                            messages[pack.messages[index + 1]]?.userCreatorId ||
                            messages[pack.messages[index + 1]]?.systemMessageType !==
                              SystemMessageType.None)
                        }
                      />
                    ))}
                    {pack.messages.length > 0 && (
                      <div className={`${BLOCK_NAME}__separator`}>
                        <span className={`${BLOCK_NAME}__separator-date`}>{pack.date}</span>
                      </div>
                    )}
                  </div>
                ))}
              </InfiniteScroll>
            )
          : areMessagesLoading &&
            hasMoreMessages && (
              <>
                <CenteredLoader size={LoaderSize.LARGE} />
              </>
            )}
      </div>
    </div>
  );
};

MessageList.displayName = 'MessageList';

export { MessageList };
