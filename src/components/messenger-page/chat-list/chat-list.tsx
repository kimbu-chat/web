import React, { useEffect, useCallback, useState } from 'react';
import './chat-list.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { IChat } from '@store/chats/models';
import * as ChatActions from '@store/chats/actions';
import { InfiniteScroll, SearchTop } from '@components/messenger-page';
import {
  getChatsSelector,
  getSearchChatsSelector,
  getChatsLoadingSelector,
  getHasMoreChatsSelector,
  getSelectedChatIdSelector,
} from '@store/chats/selectors';
import { useParams } from 'react-router';
import { ChatFromList } from './chat-item/chat-item';

const ChatList = React.memo(() => {
  const chats = useSelector(getChatsSelector);
  const searchChats = useSelector(getSearchChatsSelector);
  const hasMoreChats = useSelector(getHasMoreChatsSelector);
  const areChatsLoading = useSelector(getChatsLoadingSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const getChatsRequest = useActionWithDispatch(ChatActions.getChats);
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);

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
      changeSelectedChat({ newChatId: Number(chatId), oldChatId: selectedChatId });
    }
  }, [changeSelectedChat, chatId, selectedChatId]);

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

  return (
    <div className="messenger__chats">
      <SearchTop onChange={changeSearchString} searchFor="chats" />
      <div className="chat-list">
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreChats}
          isLoading={areChatsLoading}>
          {searchString.length > 0
            ? searchChats?.map((chat: IChat) => <ChatFromList chat={chat} key={chat.id} />)
            : chats?.map((chat: IChat) => <ChatFromList chat={chat} key={chat.id} />)}
        </InfiniteScroll>
      </div>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export { ChatList };
