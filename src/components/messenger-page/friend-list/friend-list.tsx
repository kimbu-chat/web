import { IPage, IUser } from '@store/common/models';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getFriendsAction } from '@store/friends/actions';
import {
  getMyFriendsSelector,
  getMySearchFriendsSelector,
  getHasMoreFriendsSelector,
  getFriendsLoadingSelector,
} from '@store/friends/selectors';
import { InfiniteScroll, SearchTop } from '@components/messenger-page';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import './friend-list.scss';
import { Friend } from './friend-from-list/friend';

export const FriendList = React.memo(() => {
  const friends = useSelector(getMyFriendsSelector);
  const searchFriends = useSelector(getMySearchFriendsSelector);
  const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
  const friendsLoading = useSelector(getFriendsLoadingSelector);

  const [searchString, setSearchString] = useState('');
  const changeSearchString = useCallback(
    (name: string) => {
      setSearchString(name);
    },
    [setSearchString],
  );

  const loadFriends = useActionWithDeferred(getFriendsAction);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: searchString.length ? searchFriends.length : friends.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name: searchString, initializedByScroll: true });
  }, [friends.length, searchFriends.length, loadFriends, searchString]);

  const renderFriend = useCallback(
    (friend: IUser) => <Friend key={friend.id} friend={friend} />,
    [],
  );

  const renderedFriends = useMemo(() => {
    if (searchString.length) {
      return searchFriends.map(renderFriend);
    }
    return friends.map(renderFriend);
  }, [searchString.length, searchFriends, friends, renderFriend]);

  return (
    <div className="messenger__friends">
      <SearchTop onChange={changeSearchString} searchFor="friends" />
      <div className="friend-list">
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreFriends}
          isLoading={friendsLoading}>
          {renderedFriends}
        </InfiniteScroll>
      </div>
    </div>
  );
});
