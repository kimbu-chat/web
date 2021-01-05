import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext, useState } from 'react';

import { useSelector } from 'react-redux';
import './group-chat-add-friend-modal.scss';
import { getMemberIdsForSelectedGroupChatSelector } from 'store/chats/selectors';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { getFriendsLoading, getHasMoreFriends, getMyFriends } from 'app/store/friends/selectors';
import { IPage } from 'app/store/models';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { FRIENDS_LIMIT } from 'app/utils/pagination-limits';
import { FriendFromList, SearchBox } from 'app/components';
import { AddUsersToGroupChat } from 'app/store/chats/features/add-users-to-group-chat/add-users-to-group-chat';
import { GetFriends } from 'app/store/friends/features/get-friends/get-friends';

interface IGroupChatAddFriendModalProps {
  onClose: () => void;
}

export const GroupChatAddFriendModal: React.FC<IGroupChatAddFriendModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const [selectedUserIds, setselectedUserIds] = useState<number[]>([]);

  const friends = useSelector(getMyFriends);
  const hasMoreFriends = useSelector(getHasMoreFriends);
  const friendsLoading = useSelector(getFriendsLoading);
  const idsToExclude = useSelector(getMemberIdsForSelectedGroupChatSelector);

  const addUsersToGroupChat = useActionWithDispatch(AddUsersToGroupChat.action);
  const loadFriends = useActionWithDispatch(GetFriends.action);

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
    onClose();

    if (selectedUserIds.length > 0) {
      addUsersToGroupChat({
        users: friends.filter((friend) => selectedUserIds.includes(friend.id)),
      });
    }
  }, [addUsersToGroupChat, selectedUserIds, onClose, friends]);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: friends.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page });
  }, [friends, loadFriends]);

  const searchFriends = useCallback((name: string) => {
    loadFriends({ page: { offset: 0, limit: FRIENDS_LIMIT }, name, initializedBySearch: true });
  }, []);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('groupChatAddFriendModal.add_members')}
        closeModal={onClose}
        contents={
          <div className='group-chat-add-friend-modal'>
            <SearchBox onChange={(e) => searchFriends(e.target.value)} />
            <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading} className='group-chat-add-friend-modal__friend-block'>
              {friends.map(
                (friend) =>
                  !idsToExclude.includes(friend.id) && (
                    <FriendFromList key={friend.id} friend={friend} isSelected={isSelected(friend.id)} changeSelectedState={changeSelectedState} />
                  ),
              )}
            </InfiniteScroll>
          </div>
        }
        buttons={[
          {
            children: t('groupChatAddFriendModal.add_members'),
            onClick: addUsers,
            disabled: selectedUserIds.length === 0,
            position: 'left',
            width: 'contained',
            variant: 'contained',
            color: 'primary',
          },
        ]}
      />
    </WithBackground>
  );
});
