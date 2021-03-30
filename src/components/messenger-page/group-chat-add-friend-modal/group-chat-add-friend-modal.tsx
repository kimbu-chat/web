import { Modal, WithBackground } from '@components/shared';
import { InfiniteScroll, SearchBox } from '@components/messenger-page';
import React, { useCallback, useContext, useState } from 'react';

import { useSelector } from 'react-redux';
import './group-chat-add-friend-modal.scss';
import { getMemberIdsForSelectedGroupChatSelector } from '@store/chats/selectors';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { LocalizationContext } from '@contexts';
import {
  getFriendsLoadingSelector,
  getHasMoreFriendsSelector,
  getMyFriendsSelector,
} from '@store/friends/selectors';
import { IPage } from '@store/common/models';

import { FRIENDS_LIMIT } from '@utils/pagination-limits';

import { AddUsersToGroupChat } from '@store/chats/features/add-users-to-group-chat/add-users-to-group-chat';
import { GetFriends } from '@store/friends/features/get-friends/get-friends';
import { SelectEntity } from '../shared/select-entity/select-entity';

interface IGroupChatAddFriendModalProps {
  onClose: () => void;
}

export const GroupChatAddFriendModal: React.FC<IGroupChatAddFriendModalProps> = React.memo(
  ({ onClose }) => {
    const { t } = useContext(LocalizationContext);

    const [selectedUserIds, setselectedUserIds] = useState<number[]>([]);

    const friends = useSelector(getMyFriendsSelector);
    const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
    const friendsLoading = useSelector(getFriendsLoadingSelector);
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

    const searchFriends = useCallback(
      (name: string) => {
        loadFriends({ page: { offset: 0, limit: FRIENDS_LIMIT }, name, initializedBySearch: true });
      },
      [loadFriends],
    );

    return (
      <WithBackground onBackgroundClick={onClose}>
        <Modal
          title={t('groupChatAddFriendModal.add_members')}
          closeModal={onClose}
          content={
            <div className="group-chat-add-friend-modal__select-friends">
              <SearchBox
                containerClassName="group-chat-add-friend-modal__select-friends__search"
                onChange={(e) => searchFriends(e.target.value)}
              />
              <InfiniteScroll
                className="group-chat-add-friend-modal__friends-block"
                onReachExtreme={loadMore}
                hasMore={hasMoreFriends}
                isLoading={friendsLoading}>
                {friends.map(
                  (friend) =>
                    !idsToExclude.includes(friend.id) && (
                      <SelectEntity
                        key={friend.id}
                        chatOrUser={friend}
                        isSelected={isSelected(friend.id)}
                        changeSelectedState={changeSelectedState}
                      />
                    ),
                )}
              </InfiniteScroll>
            </div>
          }
          buttons={[
            <button
              key={1}
              disabled={selectedUserIds.length === 0}
              type="button"
              className="group-chat-add-friend-modal__btn group-chat-add-friend-modal__btn--cancel"
              onClick={onClose}>
              {t('groupChatAddFriendModal.cancel')}
            </button>,
            <button
              key={2}
              disabled={selectedUserIds.length === 0}
              type="button"
              onClick={addUsers}
              className="group-chat-add-friend-modal__btn group-chat-add-friend-modal__btn--confirm">
              {t('groupChatAddFriendModal.add_members')}
            </button>,
          ]}
        />
      </WithBackground>
    );
  },
);
