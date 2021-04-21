import { IPage, IUser } from '@store/common/models';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { InfiniteScroll, SearchBox } from '@components/messenger-page';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import './friend-list.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { Friend } from './friend-from-list/friend';

export const FriendList = () => {
  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friends, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friends: searchFriends,
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
      offset: searchString.length ? searchFriends?.length || 0 : friends.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name: searchString, initializedByScroll: true });
  }, [friends.length, searchFriends?.length, loadFriends, searchString]);

  const renderFriend = useCallback((friend: IUser) => <Friend key={friend.id} {...friend} />, []);

  const renderedFriends = useMemo(() => {
    if (searchString.length) {
      return searchFriends?.map(renderFriend);
    }
    return friends.map(renderFriend);
  }, [searchString.length, searchFriends, friends, renderFriend]);

  return (
    <div className="messenger__friends">
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
          onReachExtreme={loadMore}
          hasMore={searchString.length ? hasMoreSearchFriends : hasMoreFriends}
          isLoading={searchString.length ? searchFriendsLoading : friendsLoading}>
          {renderedFriends}
        </InfiniteScroll>
      </div>
    </div>
  );
};
