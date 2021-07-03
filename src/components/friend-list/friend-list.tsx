import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { IPage } from '@store/common/models';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';

import { Friend } from './friend-from-list/friend';

import './friend-list.scss';

export const FriendList = () => {
  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friendIds, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friendIds: searchFriendIds,
    loading: searchFriendsLoading,
  } = searchFriendsList;

  const loadFriends = useActionWithDeferred(getFriendsAction);
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
        page: { offset: 0, limit: FRIENDS_LIMIT },
        name: e.target.value,
        initializedByScroll: false,
      });
    },
    [setSearchString, loadFriends],
  );

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: searchString.length ? searchFriendIds?.length || 0 : friendIds.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name: searchString, initializedByScroll: true });
  }, [friendIds.length, searchFriendIds?.length, loadFriends, searchString]);

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
      <div className="friend-list">
        <InfiniteScroll
          onReachBottom={loadMore}
          hasMore={searchString.length ? hasMoreSearchFriends : hasMoreFriends}
          isLoading={searchString.length ? searchFriendsLoading : friendsLoading}>
          {renderedFriends}
        </InfiniteScroll>
      </div>
    </div>
  );
};
