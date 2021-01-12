import React, { useEffect, useCallback } from 'react';
import './chat-list.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { IChat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import {
  getChatsSelector,
  getSearchChatsSelector,
  getChatsLoadingSelector,
  getHasMoreChatsSelector,
  getSearchStringSelector,
  getSelectedChatIdSelector,
} from 'app/store/chats/selectors';
import { CHATS_LIMIT } from 'app/utils/pagination-limits';
import { useParams } from 'react-router';
import { ChatFromList } from './chat-from-list/chat-from-list';

const ChatList = React.memo(() => {
  const chats = useSelector(getChatsSelector);
  const searchChats = useSelector(getSearchChatsSelector);
  const hasMoreChats = useSelector(getHasMoreChatsSelector);
  const areChatsLoading = useSelector(getChatsLoadingSelector);
  const searchString = useSelector(getSearchStringSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const getChatsRequest = useActionWithDispatch(ChatActions.getChats);
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);

  const { chatId } = useParams<{ chatId: string }>();

  useEffect(() => {
    if (chatId) {
      changeSelectedChat({ newChatId: Number(chatId), oldChatId: selectedChatId });
    }
  }, [chatId]);

  const loadMore = useCallback(() => {
    if (!areChatsLoading) {
      const pageData = {
        limit: CHATS_LIMIT,
        offset: chats.length,
      };

      getChatsRequest({
        page: pageData,
        initializedByScroll: true,
        name: searchString,
        showOnlyHidden: false,
        showAll: true,
      });
    }
  }, [searchString, chats.length, areChatsLoading]);

  return (
    <div className='chat-list'>
      <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreChats} isLoading={areChatsLoading}>
        {searchString.length > 0
          ? searchChats?.map((chat: IChat) => <ChatFromList chat={chat} key={chat.id} />)
          : chats?.map((chat: IChat) => <ChatFromList chat={chat} key={chat.id} />)}
      </InfiniteScroll>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export { ChatList };
