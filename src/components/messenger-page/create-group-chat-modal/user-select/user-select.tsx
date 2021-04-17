import { SearchBox, InfiniteScroll, SelectEntity } from '@components/messenger-page';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { IPage, IUser } from '@store/common/models';
import { getFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface IUserSelectProps {
  changeSelectedState: (id: number) => void;
  isSelected: (id: number) => boolean;
}

const UserSelect: React.FC<IUserSelectProps> = React.memo(({ changeSelectedState, isSelected }) => {
  const loadFriends = useActionWithDeferred(getFriendsAction);

  const [name, setName] = useState('');

  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friends, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friends: searchFriends,
    loading: searchFriendsLoading,
  } = searchFriendsList;

  const queryFriends = useCallback(
    (searchName: string) => {
      setName(searchName);
      loadFriends({
        page: { offset: 0, limit: FRIENDS_LIMIT },
        name: searchName,
        initializedByScroll: false,
      });
    },
    [loadFriends, setName],
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => queryFriends(e.target.value),
    [queryFriends],
  );

  const renderSelectEntity = useCallback(
    (friend: IUser) => (
      <SelectEntity
        key={friend.id}
        chatOrUser={friend}
        isSelected={isSelected(friend.id)}
        changeSelectedState={changeSelectedState}
      />
    ),
    [changeSelectedState, isSelected],
  );

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: name.length ? searchFriends?.length || 0 || 0 : friends.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name, initializedByScroll: true });
  }, [searchFriends?.length, friends.length, loadFriends, name]);

  const selectEntities = useMemo(() => {
    if (name.length) {
      return searchFriends?.map(renderSelectEntity);
    }
    return friends.map(renderSelectEntity);
  }, [name.length, searchFriends, friends, renderSelectEntity]);

  return (
    <div className="create-group-chat__select-friends">
      <SearchBox
        containerClassName="create-group-chat__select-friends__search"
        onChange={handleSearchInputChange}
      />
      <InfiniteScroll
        className="create-group-chat__friends-block"
        onReachExtreme={loadMore}
        hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
        isLoading={name.length ? searchFriendsLoading : friendsLoading}>
        {selectEntities}
      </InfiniteScroll>
    </div>
  );
});

UserSelect.displayName = 'UserSelect';

export { UserSelect };
