import React, { useEffect, useCallback, useRef } from 'react';
import './chat-list.scss';

import InfiniteScroll from 'react-infinite-scroller';

import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { Chat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { useParams } from 'react-router';
import { getChats, getHasMoreChats, getSearchString } from 'app/store/chats/selectors';
import { ChatFromList } from './chat-from-list/chat-from-list';

export const DIALOGS_LIMIT = 25;

export const ChatList = React.memo(() => {
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);
  const getChatsRequest = useActionWithDispatch(ChatActions.getChats);

  const { chatId } = useParams<{ chatId: string }>();

  const chats = useSelector(getChats);
  const hasMoreChats = useSelector(getHasMoreChats);
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

  const loadPage = useCallback(() => {
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

  const chatListRef = useRef(null);

  return (
    <div ref={chatListRef} className='chat-list'>
      {false && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadPage}
          hasMore={hasMoreChats}
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
          useWindow={false}
          getScrollParent={() => chatListRef.current}
          isReverse={false}
        >
          {chats?.map((chat: Chat) => (
            <ChatFromList chat={chat} key={chat.id} />
          ))}
        </InfiniteScroll>
      )}

      {chats?.map((chat: Chat) => (
        <ChatFromList chat={chat} key={chat.id} />
      ))}
    </div>
  );
});
