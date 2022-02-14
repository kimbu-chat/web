import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { CenteredLoader, LoaderSize } from '@components/loader';
import { SearchBox } from '@components/search-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';

import { Friend } from './friend-from-list/friend';

import './friend-list.scss';

export const FriendList = () => {
  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const containerRef = useRef<HTMLDivElement>(null);

  const { hasMore: hasMoreFriends, friendIds, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friendIds: searchFriendIds,
    loading: searchFriendsLoading,
  } = searchFriendsList;

  const loadFriends = useActionWithDispatch(getFriendsAction);
  const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

  useEffect(
    () => () => {
      resetSearchFriends();
    },
    [resetSearchFriends],
  );

  const [searchString, setSearchString] = useState('');

  const changeSearchString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
      loadFriends({
        name: e.target.value,
        initializedByScroll: false,
      });
    },
    [setSearchString, loadFriends],
  );

  const loadMore = useCallback(() => {
    loadFriends({ name: searchString, initializedByScroll: true });
  }, [loadFriends, searchString]);

  const renderFriend = useCallback(
    (friendId: number) => <Friend key={friendId} friendId={friendId} />,
    [],
  );

  const renderedFriends = useMemo(() => {
    if (searchString.length) {
      return searchFriendIds?.map(renderFriend);
    }
    return friendIds.map(renderFriend);
  }, [searchString.length, searchFriendIds, friendIds, renderFriend]);

  return (
    <div>
      <div className="friend-list__search-top">
        <SearchBox
          containerClassName="friend-list__search-top__search-container"
          inputClassName="friend-list__search-top__search-input"
          iconClassName="friend-list__search-top__search-icon"
          onChange={changeSearchString}
        />
      </div>
      <div className="friend-list" ref={containerRef}>
        {friendsLoading && !friendIds.length ? (
          <CenteredLoader size={LoaderSize.LARGE} />
        ) : (
          <InfiniteScroll
            containerRef={containerRef}
            onReachBottom={loadMore}
            hasMore={searchString.length ? hasMoreSearchFriends : hasMoreFriends}
            isLoading={searchString.length ? searchFriendsLoading : friendsLoading}>
            {renderedFriends}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
