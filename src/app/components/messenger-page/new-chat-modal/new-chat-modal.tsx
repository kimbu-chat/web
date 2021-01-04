import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import './new-chat-modal.scss';
import { FriendActions } from 'store/friends/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { IUserPreview } from 'store/my-profile/models';
import { useHistory } from 'react-router';

import PeopleSvg from 'icons/ic-group.svg';
import { ChatActions } from 'app/store/chats/actions';
import { getFriendsLoading, getHasMoreFriends, getMyFriends } from 'app/store/friends/selectors';
import { IPage } from 'app/store/common/models';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { FRIENDS_LIMIT } from 'app/utils/pagination-limits';
import { ChatId } from 'app/store/chats/chat-id';
import { FriendFromList, SearchBox } from 'app/components';

interface INewChatModalProps {
  onClose: () => void;
  displayCreateGroupChat: () => void;
}

export const NewChatModal: React.FC<INewChatModalProps> = React.memo(({ onClose, displayCreateGroupChat }) => {
  const { t } = useContext(LocalizationContext);

  const friends = useSelector(getMyFriends);
  const hasMoreFriends = useSelector(getHasMoreFriends);
  const friendsLoading = useSelector(getFriendsLoading);

  const createChat = useActionWithDispatch(ChatActions.createChat);
  const loadFriends = useActionWithDispatch(FriendActions.getFriends);

  const history = useHistory();

  const createEmptyChat = useCallback((user: IUserPreview) => {
    createChat(user);
    const chatId = ChatId.from(user.id).id;
    history.push(`/chats/${chatId}`);
    onClose();
  }, []);

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

  const createGroupChat = useCallback(() => {
    displayCreateGroupChat();
    onClose();
  }, [displayCreateGroupChat]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('newChat.new_message')}
        closeModal={onClose}
        contents={
          <div className='new-chat'>
            <SearchBox onChange={(e) => searchFriends(e.target.value)} />
            <div className='new-chat__friends-block'>
              <div onClick={createGroupChat} className='new-chat__new-group'>
                <div className='new-chat__new-group__img'>
                  <PeopleSvg viewBox='0 0 25 25' />
                </div>
                <span className='new-chat__new-group__title'>{t('newChat.new_group')}</span>
              </div>
              <InfiniteScroll className='create-group-chat__friends-block' onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading}>
                {friends.map((friend) => (
                  <FriendFromList key={friend.id} friend={friend} onClick={createEmptyChat} />
                ))}
              </InfiniteScroll>
            </div>
          </div>
        }
        buttons={[]}
      />
    </WithBackground>
  );
});
