import React, { useEffect, useCallback } from 'react';
import './chat-list.scss';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { Chat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { useParams } from 'react-router';
import { getChats, getChatsLoading, getHasMoreChats, getSearchString } from 'app/store/chats/selectors';
import { ChatFromList } from './chat-from-list/chat-from-list';

export const DIALOGS_LIMIT = 25;

export const ChatList = React.memo(() => {
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);
  const getChatsRequest = useActionWithDispatch(ChatActions.getChats);

  const { chatId } = useParams<{ chatId: string }>();

  const chats = useSelector(getChats);
  const hasMoreChats = useSelector(getHasMoreChats);
  const areChatsLoading = useSelector(getChatsLoading);
  const searchString = useSelector(getSearchString);

  useEffect(() => {
    if (chatId) changeSelectedChat(Number(chatId));
    else changeSelectedChat(-1);
  }, [chatId]);

  useEffect(() => {
    getChatsRequest({
      page: { offset: 0, limit: DIALOGS_LIMIT },
      initializedBySearch: true,

      name: searchString,
      showOnlyHidden: false,
      showAll: true,
    });
  }, [searchString]);

  const loadMore = useCallback(() => {
    const pageData = {
      limit: 25,
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
      <InfiniteScroll
        onReachExtreme={loadMore}
        hasMore={hasMoreChats}
        isLoading={areChatsLoading}
        threshold={0.3}
        loader={
          <div className='loader ' key={0}>
            <div className=''>
              <div className='lds-ellipsis'>
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        }
      >
        {chats?.map((chat: Chat) => (
          <ChatFromList chat={chat} key={chat.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
