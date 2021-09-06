import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { Modal, IModalChildrenProps } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { Button } from '@shared-components/button';
import { addUsersToGroupChatAction } from '@store/chats/actions';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';

import './group-chat-add-friend-modal.scss';

interface IGroupChatAddFriendModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'group-chat-add-friend-modal';

const InitialGroupChatAddFriendModal: React.FC<
  IGroupChatAddFriendModalProps & IModalChildrenProps
> = ({ animatedClose }) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedUserIds, setselectedUserIds] = useState<string[]>([]);
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

  const isSelected = useCallback((id: string) => selectedUserIds.includes(id), [selectedUserIds]);

  const changeSelectedState = useCallback(
    (id: string) => {
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
        animatedClose();
      });
    }
  }, [addUsersToGroupChat, selectedUserIds, animatedClose]);

  const loadMore = useCallback(() => {
    loadFriends({ name, initializedByScroll: true });
  }, [loadFriends, name]);

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
    (friendId: string) => (
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
    <div ref={containerRef}>
      <Modal.Header>
        <>
          <GroupSvg className={`${BLOCK_NAME}__icon`} />
          <span>{t('groupChatAddFriendModal.add_members')}</span>
        </>
      </Modal.Header>
      <div className={`${BLOCK_NAME}__select-friends`}>
        <SearchBox
          containerClassName={`${BLOCK_NAME}__select-friends__search`}
          onChange={handleSearchInputChange}
        />
        <InfiniteScroll
          containerRef={containerRef}
          className={`${BLOCK_NAME}__friends-block`}
          onReachBottom={loadMore}
          hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
          isLoading={name.length ? searchFriendsLoading : friendsLoading}>
          {selectEntities}
        </InfiniteScroll>

        <div className={`${BLOCK_NAME}__btn-block`}>
          <button
            type="button"
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
            onClick={animatedClose}>
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
    </div>
  );
};

const GroupChatAddFriendModal: React.FC<IGroupChatAddFriendModalProps> = ({
  onClose,
  ...props
}) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialGroupChatAddFriendModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

GroupChatAddFriendModal.displayName = 'GroupChatAddFriendModal';

export { GroupChatAddFriendModal };
