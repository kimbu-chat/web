import React, { useEffect, useCallback, useState, useMemo } from 'react';
import './chat-list.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { IChat } from '@store/chats/models';
import { getChatsAction, changeSelectedChatAction } from '@store/chats/actions';
import { InfiniteScroll, SearchTop } from '@components/messenger-page';
import {
  getChatsSelector,
  getSearchChatsSelector,
  getChatsLoadingSelector,
  getHasMoreChatsSelector,
} from '@store/chats/selectors';
import { useParams } from 'react-router';
import { ChatFromList } from './chat-item/chat-item';

const ChatList = React.memo(() => {
  const chats = useSelector(getChatsSelector);
  const searchChats = useSelector(getSearchChatsSelector);
  const hasMoreChats = useSelector(getHasMoreChatsSelector);
  const areChatsLoading = useSelector(getChatsLoadingSelector);

  const getChatsRequest = useActionWithDispatch(getChatsAction);
  const changeSelectedChat = useActionWithDispatch(changeSelectedChatAction);

  const { chatId } = useParams<{ chatId: string }>();

  const [searchString, setSearchString] = useState('');
  const changeSearchString = useCallback(
    (name: string) => {
      setSearchString(name);
    },
    [setSearchString],
  );

  useEffect(() => {
    if (chatId) {
      const newChatId = Number(chatId);
      changeSelectedChat({ newChatId });
    }
  }, [changeSelectedChat, chatId]);

  const loadMore = useCallback(() => {
    if (!areChatsLoading) {
      getChatsRequest({
        initializedByScroll: true,
        name: searchString,
        showOnlyHidden: false,
        showAll: true,
      });
    }
  }, [areChatsLoading, getChatsRequest, searchString]);

  const renderChats = useCallback((chat: IChat) => <ChatFromList chat={chat} key={chat.id} />, []);

  const renderedChats = useMemo(() => {
    if (searchString.length) {
      return searchChats.map(renderChats);
    }
    return chats.map(renderChats);
  }, [searchString.length, searchChats, chats, renderChats]);

  return (
    <div className="messenger__chats">
      <SearchTop onChange={changeSearchString} searchFor="chats" />
      <div className="chat-list">
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreChats}
          isLoading={areChatsLoading}>
          {renderedChats}
        </InfiniteScroll>
      </div>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export { ChatList };
