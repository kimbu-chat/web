import React, { useCallback, useEffect, useState } from 'react';
import './search-top.scss';

import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getChatsAction } from '@store/chats/actions';
import { getCallsAction } from '@store/calls/actions';
import { getFriendsAction } from '@store/friends/actions';

import { CreateGroupChat, NewChatModal, SearchBox } from '@components/messenger-page';
import { FadeAnimationWrapper } from '@components/shared';
import { CALL_LIMIT, FRIENDS_LIMIT } from '@utils/pagination-limits';

interface ISearchTopProps {
  searchFor: 'friends' | 'chats' | 'calls';
  onChange?: (name: string) => void;
}

export const SearchTop: React.FC<ISearchTopProps> = React.memo(({ searchFor, onChange }) => {
  const getChats = useActionWithDispatch(getChatsAction);
  const getCalls = useActionWithDispatch(getCallsAction);
  const loadFriends = useActionWithDispatch(getFriendsAction);
  const [newChatDisplayed, setNewChatDisplayed] = useState(false);
  const changeNewChatDisplayedState = useCallback(() => {
    setNewChatDisplayed((oldState) => !oldState);
  }, [setNewChatDisplayed]);

  const [createGroupChatDisplayed, setCreateGroupChatDisplayed] = useState(false);
  const changeCreateGroupChatDisplayedState = useCallback(() => {
    setCreateGroupChatDisplayed((oldState) => !oldState);
  }, []);

  const handleSearchChange = useCallback(
    (name: string): void => {
      if (onChange) {
        onChange(name);
      }

      switch (searchFor) {
        case 'chats':
          getChats({
            name,
            initializedByScroll: false,
            showOnlyHidden: false,
            showAll: true,
          });
          break;
        case 'calls':
          getCalls({
            page: {
              offset: 0,
              limit: CALL_LIMIT,
            },
            initializedByScroll: false,
            name,
          });
          break;
        case 'friends':
          loadFriends({
            page: { offset: 0, limit: FRIENDS_LIMIT },
            name,
            initializedByScroll: false,
          });
          break;
        default:
          break;
      }
    },
    [getChats, onChange, getCalls, searchFor, loadFriends],
  );

  const handleInputChange = useCallback((e) => handleSearchChange(e.target.value), [
    handleSearchChange,
  ]);

  useEffect(() => () => handleSearchChange(''), [handleSearchChange]);

  return (
    <div className="search-top">
      <SearchBox
        containerClassName="search-top__search-container"
        inputClassName="search-top__search-input"
        iconClassName="search-top__search-icon"
        onChange={handleInputChange}
      />
      {searchFor === 'chats' && (
        <button
          type="button"
          onClick={changeNewChatDisplayedState}
          className="search-top__create-chat-btn">
          <CreateChatSvg />
        </button>
      )}
      <FadeAnimationWrapper isDisplayed={newChatDisplayed}>
        <NewChatModal
          displayCreateGroupChat={changeCreateGroupChatDisplayedState}
          onClose={changeNewChatDisplayedState}
        />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={createGroupChatDisplayed}>
        <CreateGroupChat onClose={changeCreateGroupChatDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
});
