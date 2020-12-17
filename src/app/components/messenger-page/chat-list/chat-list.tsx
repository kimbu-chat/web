import React, { useEffect, useCallback } from 'react';
import './chat-list.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { Chat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { useParams } from 'react-router';
import { getChats, getChatsLoading, getHasMoreChats, getSearchString, getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { CHATS_LIMIT } from 'app/utils/pagination-limits';
import { ChatFromList } from './chat-from-list/chat-from-list';

export const ChatList = React.memo(() => {
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);
  const getChatsRequest = useActionWithDispatch(ChatActions.getChats);

  const { chatId } = useParams<{ chatId: string }>();

  const chats = useSelector(getChats);
  const hasMoreChats = useSelector(getHasMoreChats);
  const areChatsLoading = useSelector(getChatsLoading);
  const searchString = useSelector(getSearchString);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  useEffect(() => {
    if (chatId) {
      changeSelectedChat({ newChatId: Number(chatId), oldChatId: selectedChatId });
    } else {
      changeSelectedChat({ newChatId: null, oldChatId: selectedChatId });
    }
  }, [chatId]);

  useEffect(() => {
    getChatsRequest({
      page: { offset: 0, limit: CHATS_LIMIT },
      initializedBySearch: true,

      name: searchString,
      showOnlyHidden: false,
      showAll: true,
    });
  }, [searchString]);

  const loadMore = useCallback(() => {
    const pageData = {
      limit: CHATS_LIMIT,
      offset: chats.length,
    };

    getChatsRequest({
      page: pageData,
      initializedBySearch: false,
      name: searchString,
      showOnlyHidden: false,
      showAll: true,
    });
  }, [searchString, chats]);

  return (
    <div className='chat-list'>
      <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreChats} isLoading={areChatsLoading}>
        {chats?.map((chat: Chat) => (
          <ChatFromList chat={chat} key={chat.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
