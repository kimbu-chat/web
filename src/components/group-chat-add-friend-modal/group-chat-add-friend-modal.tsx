import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { IPage } from '@store/common/models';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { addUsersToGroupChatAction } from '@store/chats/actions';

import { SelectEntity } from '../select-entity/select-entity';
import './group-chat-add-friend-modal.scss';

interface IGroupChatAddFriendModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'group-chat-add-friend-modal';

const GroupChatAddFriendModal: React.FC<IGroupChatAddFriendModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const [selectedUserIds, setselectedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friendIds, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friendIds: searchFriendIds,
    loading: searchFriendsLoading,
  } = searchFriendsList;

  const addUsersToGroupChat = useActionWithDeferred(addUsersToGroupChatAction);
  const loadFriends = useActionWithDispatch(getFriendsAction);
  const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

  useEffect(
    () => () => {
      resetSearchFriends();
    },
    [resetSearchFriends],
  );

  const isSelected = useCallback((id: number) => selectedUserIds.includes(id), [selectedUserIds]);

  const changeSelectedState = useCallback(
    (id: number) => {
      if (isSelected(id)) {
        setselectedUserIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
      } else {
        setselectedUserIds((oldChatIds) => [...oldChatIds, id]);
      }
    },
    [setselectedUserIds, isSelected],
  );

  const addUsers = useCallback((): void => {
    setLoading(true);

    if (selectedUserIds.length > 0) {
      addUsersToGroupChat({
        userIds: selectedUserIds,
      }).then(() => {
        setLoading(false);
        onClose();
      });
    }
  }, [addUsersToGroupChat, selectedUserIds, onClose]);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: name.length ? searchFriendIds?.length || 0 : friendIds.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name, initializedByScroll: true });
  }, [searchFriendIds?.length, friendIds?.length, loadFriends, name]);

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

  useEffect(
    () => () => {
      queryFriends('');
    },
    [queryFriends],
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

  const selectEntities = useMemo(() => {
    if (name.length) {
      return searchFriendIds?.map(renderSelectEntity);
    }
    return friendIds.map(renderSelectEntity);
  }, [name.length, searchFriendIds, friendIds, renderSelectEntity]);

  return (
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <GroupSvg viewBox="0 0 24 24" className={`${BLOCK_NAME}__icon`} />
            <span>{t('groupChatAddFriendModal.add_members')}</span>
          </>
        </Modal.Header>
        <div className={`${BLOCK_NAME}__select-friends`}>
          <SearchBox
            containerClassName={`${BLOCK_NAME}__select-friends__search`}
            onChange={handleSearchInputChange}
          />
          <InfiniteScroll
            className={`${BLOCK_NAME}__friends-block`}
            onReachBottom={loadMore}
            hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
            isLoading={name.length ? searchFriendsLoading : friendsLoading}>
            {selectEntities}
          </InfiniteScroll>

          <div className={`${BLOCK_NAME}__btn-block`}>
            <button
              disabled={selectedUserIds.length === 0}
              type="button"
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
              onClick={onClose}>
              {t('groupChatAddFriendModal.cancel')}
            </button>
            <Button
              disabled={selectedUserIds.length === 0}
              loading={loading}
              type="button"
              onClick={addUsers}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
              {t('groupChatAddFriendModal.add_members')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
GroupChatAddFriendModal.displayName = 'GroupChatAddFriendModal';

export { GroupChatAddFriendModal };
