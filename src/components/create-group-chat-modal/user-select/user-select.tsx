import React, { useCallback, useMemo, useState, useRef } from 'react';

import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { getFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';

interface IUserSelectProps {
  changeSelectedState: (id: number) => void;
  isSelected: (id: number) => boolean;
}

const UserSelect: React.FC<IUserSelectProps> = ({ changeSelectedState, isSelected }) => {
  const loadFriends = useActionWithDeferred(getFriendsAction);

  const [name, setName] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

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
    loadFriends({ name, initializedByScroll: true });
  }, [loadFriends, name]);

  const selectEntities = useMemo(() => {
    if (name.length) {
      return searchFriendIds?.map(renderSelectEntity);
    }
    return friendIds.map(renderSelectEntity);
  }, [name.length, searchFriendIds, friendIds, renderSelectEntity]);

  return (
    <div className="create-group-chat__select-friends" ref={containerRef}>
      <SearchBox
        containerClassName="create-group-chat__select-friends__search"
        onChange={handleSearchInputChange}
      />
      <InfiniteScroll
        containerRef={containerRef}
        className="create-group-chat__friends-block"
        onReachBottom={loadMore}
        hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
        isLoading={name.length ? searchFriendsLoading : friendsLoading}>
        {selectEntities}
      </InfiniteScroll>
    </div>
  );
};

UserSelect.displayName = 'UserSelect';

export { UserSelect };
