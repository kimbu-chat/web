import { Modal, WithBackground, InfiniteScroll, SearchBox } from '@components';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import './new-chat-modal.scss';
import * as FriendActions from '@store/friends/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { LocalizationContext } from '@contexts';
import { IUser, IPage } from '@store/common/models';
import { useHistory } from 'react-router';

import ArrowSvg from '@icons/arrow-v.svg';
import GroupSvg from '@icons/group.svg';
import NewMessageSvg from '@icons/create-chat.svg';

import { getFriendsLoadingSelector, getHasMoreFriendsSelector, getMyFriendsSelector } from '@store/friends/selectors';

import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import { ChatId } from '@store/chats/chat-id';

import { IChat } from '@store/chats/models';
import { SelectEntity } from '../shared/select-entity/select-entity';

interface INewChatModalProps {
  onClose: () => void;
  displayCreateGroupChat: () => void;
}

export const NewChatModal: React.FC<INewChatModalProps> = React.memo(({ onClose, displayCreateGroupChat }) => {
  const { t } = useContext(LocalizationContext);

  const friends = useSelector(getMyFriendsSelector);
  const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
  const friendsLoading = useSelector(getFriendsLoadingSelector);

  const loadFriends = useActionWithDispatch(FriendActions.getFriends);

  const history = useHistory();

  const createEmptyChat = useCallback((user: IChat | IUser) => {
    const chatId = ChatId.from((user as IUser).id).id;
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
        title={
          <>
            <NewMessageSvg viewBox='0 0 24 24' className='new-chat__icon' />
            <span> {t('newChat.new_message')} </span>
          </>
        }
        closeModal={onClose}
        content={
          <div className='new-chat'>
            <SearchBox containerClassName='new-chat__search' onChange={(e) => searchFriends(e.target.value)} />
            <div className='new-chat__friends-block'>
              <div onClick={createGroupChat} className='new-chat__new-group'>
                <div className='new-chat__new-group__img'>
                  <GroupSvg viewBox='0 0 24 24' />
                </div>
                <span className='new-chat__new-group__title'>{t('newChat.new_group')}</span>
                <div className='new-chat__new-group__go'>
                  <ArrowSvg viewBox='0 0 8 14' />
                </div>
              </div>
              <InfiniteScroll className='create-group-chat__friends-block' onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading}>
                {friends.map((friend) => (
                  <SelectEntity key={friend.id} chatOrUser={friend} onClick={createEmptyChat} />
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
