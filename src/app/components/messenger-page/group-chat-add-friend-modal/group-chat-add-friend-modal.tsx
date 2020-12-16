import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext, useState } from 'react';

import { useSelector } from 'react-redux';
import './group-chat-add-friend-modal.scss';
import { Chat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { getMembersForSelectedGroupChat, getSelectedChatSelector } from 'store/chats/selectors';
import { FriendActions } from 'store/friends/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { getFriendsLoading, getHasMoreFriends, getMyFriends } from 'app/store/friends/selectors';
import { Page } from 'app/store/common/models';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { FriendFromList } from '../shared/friend-from-list/friend-from-list';
import { SearchBox } from '../search-box/search-box';

namespace GroupChatAddFriendModalNS {
  export interface Props {
    onClose: () => void;
  }
}

export const GroupChatAddFriendModal = React.memo(({ onClose }: GroupChatAddFriendModalNS.Props) => {
  const { t } = useContext(LocalizationContext);

  const [selectedUserIds, setselectedUserIds] = useState<number[]>([]);

  const friends = useSelector(getMyFriends);
  const hasMoreFriends = useSelector(getHasMoreFriends);
  const friendsLoading = useSelector(getFriendsLoading);
  const selectedChat = useSelector(getSelectedChatSelector) as Chat;
  const idsToExclude = useSelector(getMembersForSelectedGroupChat)?.map((user) => user.id) || [];

  const addUsersToGroupChat = useActionWithDeferred(ChatActions.addUsersToGroupChat);
  const loadFriends = useActionWithDispatch(FriendActions.getFriends);

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
        chat: selectedChat,
        users: friends.filter((friend) => selectedUserIds.includes(friend.id)),
      });
    }
  }, [addUsersToGroupChat, selectedChat, selectedUserIds, onClose, friends]);

  const loadMore = useCallback(() => {
    const page: Page = {
      offset: friends.length,
      limit: 25,
    };
    loadFriends({ page });
  }, [friends, loadFriends]);

  const searchFriends = useCallback((name: string) => {
    loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
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
