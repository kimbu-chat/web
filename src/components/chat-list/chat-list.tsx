import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { CreateGroupChat } from '@components/create-group-chat-modal';
import { InfiniteScroll } from '@components/infinite-scroll';
import { NewMessageModal } from '@components/new-message-modal';
import { SearchBox } from '@components/search-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';
import { AnimationMode } from '@shared-components/with-background/with-background';
import {
  getChatsAction,
  changeSelectedChatAction,
  resetSearchChatsAction,
} from '@store/chats/actions';
import { getChatsListSelector, getSearchChatsListSelector } from '@store/chats/selectors';

import { ChatFromList } from './chat-item/chat-item';

import './chat-list.scss';

const BLOCK_NAME = 'chat-list';

const ChatList = React.memo(() => {
  const chatsList = useSelector(getChatsListSelector);
  const searchChatsList = useSelector(getSearchChatsListSelector);

  const containerRef = useRef<HTMLDivElement>(null);

  const getChatsRequest = useActionWithDispatch(getChatsAction);
  const changeSelectedChat = useActionWithDispatch(changeSelectedChatAction);
  const resetSearchChats = useActionWithDispatch(resetSearchChatsAction);

  useEffect(
    () => () => {
      resetSearchChats();
    },
    [resetSearchChats],
  );

  const { id: selectedChatId } = useParams<{ id: string }>();

  useEffect(() => {
    if (selectedChatId) {
      const newChatId = Number(selectedChatId);
      changeSelectedChat({ newChatId });
    }
  }, [changeSelectedChat, selectedChatId]);

  const [newChatDisplayed, setNewChatDisplayed] = useState(false);
  const changeNewChatDisplayedState = useCallback(() => {
    setNewChatDisplayed((oldState) => !oldState);
  }, [setNewChatDisplayed]);

  const [createGroupChatDisplayed, setCreateGroupChatDisplayed] = useState(false);
  const changeCreateGroupChatDisplayedState = useCallback(() => {
    setCreateGroupChatDisplayed((oldState) => !oldState);
  }, []);

  const [searchString, setSearchString] = useState('');
  const changeSearchString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
      getChatsRequest({
        name: e.target.value,
        initializedByScroll: false,
        showOnlyHidden: false,
        showAll: true,
      });
    },
    [setSearchString, getChatsRequest],
  );

  const loadMore = useCallback(() => {
    if (!(searchString.length ? searchChatsList.loading : chatsList.loading)) {
      getChatsRequest({
        initializedByScroll: true,
        name: searchString,
        showOnlyHidden: false,
        showAll: true,
      });
    }
  }, [getChatsRequest, searchString, searchChatsList.loading, chatsList.loading]);

  const renderChats = useCallback(
    (chatId: number) => <ChatFromList chatId={chatId} key={chatId} />,
    [],
  );

  const renderedChats = useMemo(() => {
    if (searchString.length) {
      return searchChatsList.chatIds.map(renderChats);
    }
    return chatsList.chatIds.map(renderChats);
  }, [searchString.length, searchChatsList, chatsList, renderChats]);

  return (
    <>
      <div ref={containerRef}>
        <div className={`${BLOCK_NAME}__search-top`}>
          <SearchBox
            containerClassName={`${BLOCK_NAME}__search-top__search-container`}
            inputClassName={`${BLOCK_NAME}__search-top__search-input`}
            iconClassName={`${BLOCK_NAME}__search-top__search-icon`}
            onChange={changeSearchString}
          />
          <button
            type="button"
            onClick={changeNewChatDisplayedState}
            className={`${BLOCK_NAME}__search-top__create-chat-btn`}>
            <CreateChatSvg />
          </button>
        </div>
        <div className={BLOCK_NAME}>
          <InfiniteScroll
            containerRef={containerRef}
            onReachBottom={loadMore}
            hasMore={searchString.length ? searchChatsList.hasMore : chatsList.hasMore}
            isLoading={searchString.length ? searchChatsList.loading : chatsList.loading}>
            {renderedChats}
          </InfiniteScroll>
        </div>
      </div>
      {newChatDisplayed && (
        <NewMessageModal
          displayCreateGroupChat={changeCreateGroupChatDisplayedState}
          onClose={changeNewChatDisplayedState}
        />
      )}

      {createGroupChatDisplayed && (
        <CreateGroupChat
          animationMode={AnimationMode.CLOSE}
          onClose={changeCreateGroupChatDisplayedState}
        />
      )}
    </>
  );
});

ChatList.displayName = 'ChatList';

export { ChatList };
