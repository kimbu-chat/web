import React, { useEffect, useCallback, useState, useMemo } from 'react';
import './chat-list.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { IChat } from '@store/chats/models';
import {
  getChatsAction,
  changeSelectedChatAction,
  resetSearchChatsAction,
} from '@store/chats/actions';
import {
  CreateGroupChat,
  InfiniteScroll,
  NewChatModal,
  SearchBox,
} from '@components/messenger-page';
import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';
import { getChatsListSelector, getSearchChatsListSelector } from '@store/chats/selectors';
import { useParams } from 'react-router';
import { FadeAnimationWrapper } from '@components/shared';
import { ChatFromList } from './chat-item/chat-item';

const ChatList = () => {
  const chatsList = useSelector(getChatsListSelector);
  const searchChatsList = useSelector(getSearchChatsListSelector);

  const getChatsRequest = useActionWithDispatch(getChatsAction);
  const changeSelectedChat = useActionWithDispatch(changeSelectedChatAction);
  const resetSearchChats = useActionWithDispatch(resetSearchChatsAction);

  useEffect(
    () => () => {
      resetSearchChats();
    },
    [resetSearchChats],
  );

  const { chatId } = useParams<{ chatId: string }>();

  useEffect(() => {
    if (chatId) {
      const newChatId = Number(chatId);
      changeSelectedChat({ newChatId });
    }
  }, [changeSelectedChat, chatId]);

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

  const renderChats = useCallback((chat: IChat) => <ChatFromList chat={chat} key={chat.id} />, []);

  const renderedChats = useMemo(() => {
    if (searchString.length) {
      return searchChatsList.chats.map(renderChats);
    }
    return chatsList.chats.map(renderChats);
  }, [searchString.length, searchChatsList, chatsList, renderChats]);

  return (
    <>
      <div className="messenger__chats">
        <div className="chat-list__search-top">
          <SearchBox
            containerClassName="chat-list__search-top__search-container"
            inputClassName="chat-list__search-top__search-input"
            iconClassName="chat-list__search-top__search-icon"
            onChange={changeSearchString}
          />
          <button
            type="button"
            onClick={changeNewChatDisplayedState}
            className="chat-list__search-top__create-chat-btn">
            <CreateChatSvg />
          </button>
        </div>
        <div className="chat-list">
          <InfiniteScroll
            onReachExtreme={loadMore}
            hasMore={searchString.length ? searchChatsList.hasMore : chatsList.hasMore}
            isLoading={searchString.length ? searchChatsList.loading : chatsList.loading}>
            {renderedChats}
          </InfiniteScroll>
        </div>
      </div>
      <FadeAnimationWrapper isDisplayed={newChatDisplayed}>
        <NewChatModal
          displayCreateGroupChat={changeCreateGroupChatDisplayedState}
          onClose={changeNewChatDisplayedState}
        />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={createGroupChatDisplayed}>
        <CreateGroupChat onClose={changeCreateGroupChatDisplayedState} />
      </FadeAnimationWrapper>
    </>
  );
};

ChatList.displayName = 'ChatList';

export { ChatList };
