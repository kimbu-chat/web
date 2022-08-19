import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';

import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { CreateGroupChatModal } from '@components/create-group-chat-modal';
import { AddFriendModal } from '@components/friend-list/add-friend/add-friend-modal/add-friend-modal';
import { InfiniteScroll } from '@components/infinite-scroll';
import { CenteredLoader, LoaderSize } from '@components/loader';
import { NewChatModal } from '@components/new-chat-modal';
import { SearchBox } from '@components/search-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';
import { AnimationMode } from '@shared-components/with-background/with-background';
import {
  getChatsAction,
  changeSelectedChatAction,
  resetSearchChatsAction,
} from '@store/chats/actions';
import { getChatsListSelector, getSearchChatsListSelector } from '@store/chats/selectors';

import { ChatControlPanel } from './chat-control-panel/chat-control-panel';
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
      changeSelectedChat({ newChatId: +selectedChatId });
    }
  }, [changeSelectedChat, selectedChatId]);

  const [chatControlPanelIsOpen, setChatControlPanelIsOpen] = useState(false);
  const changeChatControlPanelIsOpen = useCallback(() => {
    setChatControlPanelIsOpen((oldState) => !oldState);
  }, [setChatControlPanelIsOpen]);

  const [createGroupChatDisplayed, displayGroupChat, hideGroupChat] = useToggledState(false);
  const [createNewMessageDisplayed, displayNewMessage, hideNewMessage] = useToggledState(false);
  const [createAddFriendDisplayed, displayAddFriend, hideAddFriend] = useToggledState(false);

  const [searchString, setSearchString] = useState('');
  const changeSearchString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
      getChatsRequest({
        name: e.target.value,
        initializedByScroll: false,
        showOnlyHidden: false,
      });
    },
    [setSearchString, getChatsRequest],
  );

  const loadMore = useCallback(() => {
    getChatsRequest({
      initializedByScroll: true,
      name: searchString,
      showOnlyHidden: false,
    });
  }, [getChatsRequest, searchString]);

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
      <div>
        <div className={`${BLOCK_NAME}__search-top`}>
          <SearchBox
            containerClassName={`${BLOCK_NAME}__search-top__search-container`}
            inputClassName={`${BLOCK_NAME}__search-top__search-input`}
            iconClassName={`${BLOCK_NAME}__search-top__search-icon`}
            onChange={changeSearchString}
          />
          <button
            type="button"
            onClick={changeChatControlPanelIsOpen}
            className={`${BLOCK_NAME}__search-top__create-chat-btn`}>
            <CreateChatSvg />
          </button>
          {chatControlPanelIsOpen && (
            <ChatControlPanel
              height={containerRef.current?.scrollHeight}
              onClose={changeChatControlPanelIsOpen}
              onCreateGroupChat={displayGroupChat}
              onCreateAddFriend={displayAddFriend}
              onCreateNewChat={displayNewMessage}
            />
          )}
        </div>
        <div
          className={classNames(BLOCK_NAME, {
            [`${BLOCK_NAME}__panel-visible`]: chatControlPanelIsOpen,
          })}
          ref={containerRef}>
          {searchChatsList.loading || (chatsList.loading && !chatsList.chatIds.length) ? (
            <CenteredLoader size={LoaderSize.LARGE} />
          ) : (
            <InfiniteScroll
              containerRef={containerRef}
              onReachBottom={loadMore}
              hasMore={searchString.length ? searchChatsList.hasMore : chatsList.hasMore}
              isLoading={searchString.length ? searchChatsList.loading : chatsList.loading}>
              {renderedChats}
            </InfiniteScroll>
          )}
        </div>
      </div>

      {createGroupChatDisplayed && (
        <CreateGroupChatModal animationMode={AnimationMode.ENABLED} onClose={hideGroupChat} />
      )}

      {createAddFriendDisplayed && <AddFriendModal onClose={hideAddFriend} />}

      {createNewMessageDisplayed && <NewChatModal onClose={hideNewMessage} />}
    </>
  );
});

ChatList.displayName = 'ChatList';

export { ChatList };
