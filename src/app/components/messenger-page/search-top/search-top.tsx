import React, { useCallback, useState } from 'react';
import './search-top.scss';

import CreateChatSvg from '@icons/create-chat.svg';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import * as ChatActions from '@store/chats/actions';

import { FadeAnimationWrapper, CreateGroupChat, NewChatModal, SearchBox } from '@components';

interface ISearchTopProps {
  searchFor: 'friends' | 'chats' | 'calls';
}

export const SearchTop: React.FC<ISearchTopProps> = React.memo(({ searchFor }) => {
  const getChats = useActionWithDispatch(ChatActions.getChats);
  const [newChatDisplayed, setNewChatDisplayed] = useState(false);
  const changeNewChatDisplayedState = useCallback(() => {
    setNewChatDisplayed((oldState) => !oldState);
  }, [setNewChatDisplayed]);

  const [createGroupChatDisplayed, setCreateGroupChatDisplayed] = useState(false);
  const changeCreateGroupChatDisplayedState = useCallback(() => {
    setCreateGroupChatDisplayed((oldState) => !oldState);
  }, [setNewChatDisplayed]);

  const handleChatSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      getChats({
        name: e.target.value,
        initializedByScroll: false,
        showOnlyHidden: false,
        showAll: true,
      });
    },
    [getChats],
  );

  return (
    <div className='search-top'>
      <SearchBox
        containerClassName='search-top__search-container'
        inputClassName='search-top__search-input'
        iconClassName='search-top__search-icon'
        onChange={handleChatSearchChange}
      />
      {searchFor === 'chats' && (
        <button type='button' onClick={changeNewChatDisplayedState} className='search-top__create-chat-btn'>
          <CreateChatSvg />
        </button>
      )}
      <FadeAnimationWrapper isDisplayed={newChatDisplayed}>
        <NewChatModal displayCreateGroupChat={changeCreateGroupChatDisplayedState} onClose={changeNewChatDisplayedState} />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={createGroupChatDisplayed}>
        <CreateGroupChat onClose={changeCreateGroupChatDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
});
