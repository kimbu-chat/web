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

const UserSelect: React.FC<IUserSelectProps> = ({ changeSelectedState, isSelected }) => {
  const loadFriends = useActionWithDeferred(getFriendsAction);

  const [name, setName] = useState('');

  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friendIds, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friendIds: searchFriendIds,
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
    (friendId: number) => (
      <SelectEntity
        key={friendId}
        userId={friendId}
        isSelected={isSelected(friendId)}
        changeSelectedState={changeSelectedState}
      />
    ),
    [changeSelectedState, isSelected],
  );

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: name.length ? searchFriendIds?.length || 0 || 0 : friendIds.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name, initializedByScroll: true });
  }, [searchFriendIds?.length, friendIds.length, loadFriends, name]);

  const selectEntities = useMemo(() => {
    if (name.length) {
      return searchFriendIds?.map(renderSelectEntity);
    }
    return friendIds.map(renderSelectEntity);
  }, [name.length, searchFriendIds, friendIds, renderSelectEntity]);

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
};

UserSelect.displayName = 'UserSelect';

export { UserSelect };
