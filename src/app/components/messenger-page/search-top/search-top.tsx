import React, { useCallback, useState } from 'react';
import './search-top.scss';

import CreateChatSvg from 'icons/ic-write-message.svg';

import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { ChatActions } from 'store/chats/actions';

import { FadeAnimationWrapper, CreateGroupChat, NewChatModal, SearchBox } from 'components';
import { CHATS_LIMIT } from 'app/utils/pagination-limits';

export const SearchTop = React.memo(() => {
  const getChats = useActionWithDispatch(ChatActions.getChats);
  const [newChatDisplayed, setNewChatDisplayed] = useState(false);
  const changeNewChatDisplayedState = useCallback(() => {
    setNewChatDisplayed((oldState) => !oldState);
  }, [setNewChatDisplayed]);

  const [createGroupChatDisplayed, setCreateGroupChatDisplayed] = useState(false);
  const changeCreateGroupChatDisplayedState = useCallback(() => {
    setCreateGroupChatDisplayed((oldState) => !oldState);
  }, [setNewChatDisplayed]);

  const handleChatSearchChange = (name: string): void => {
    getChats({
      name,
      page: { offset: 0, limit: CHATS_LIMIT },
      initializedByScroll: false,
      showOnlyHidden: false,
      showAll: true,
    });
  };

  return (
    <div className='search-top'>
      <div className='search-top__search'>
        <SearchBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChatSearchChange(e.target.value)} />
      </div>
      <button type='button' onClick={changeNewChatDisplayedState} className='search-top__create-chat-btn'>
        <CreateChatSvg />
      </button>
      <FadeAnimationWrapper isDisplayed={newChatDisplayed}>
        <NewChatModal displayCreateGroupChat={changeCreateGroupChatDisplayedState} onClose={changeNewChatDisplayedState} />
      </FadeAnimationWrapper>
      <FadeAnimationWrapper isDisplayed={createGroupChatDisplayed}>
        <CreateGroupChat onClose={changeCreateGroupChatDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
});
