import { Modal, WithBackground } from '@components/shared';
import { InfiniteScroll, SearchBox } from '@components/messenger-page';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import './new-chat-modal.scss';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

import { useTranslation } from 'react-i18next';
import { IUser, IPage } from '@store/common/models';
import { useHistory } from 'react-router';

import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as NewMessageSvg } from '@icons/create-chat.svg';

import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';

import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import { ChatId } from '@store/chats/chat-id';

import { INormalizedChat } from '@store/chats/models';
import { SelectEntity } from '../shared/select-entity/select-entity';

interface INewChatModalProps {
  onClose: () => void;
  displayCreateGroupChat: () => void;
}

const NewChatModal: React.FC<INewChatModalProps> = ({ onClose, displayCreateGroupChat }) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');

  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friendIds, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friendIds: searchFriendIds,
    loading: searchFriendsLoading,
  } = searchFriendsList;

  const loadFriends = useActionWithDispatch(getFriendsAction);
  const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

  useEffect(
    () => () => {
      resetSearchFriends();
    },
    [resetSearchFriends],
  );

  const history = useHistory();

  const createEmptyChat = useCallback(
    (user: INormalizedChat | IUser) => {
      const chatId = ChatId.from((user as IUser).id).id;
      history.push(`/chats/${chatId}`);
      onClose();
    },
    [history, onClose],
  );

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: name.length ? searchFriendIds?.length || 0 : friendIds.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name, initializedByScroll: true });
  }, [searchFriendIds?.length, friendIds.length, loadFriends, name]);

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

  const createGroupChat = useCallback(() => {
    displayCreateGroupChat();
    onClose();
  }, [displayCreateGroupChat, onClose]);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => queryFriends(e.target.value),
    [queryFriends],
  );

  const renderSelectEntity = useCallback(
    (friendId: number) => (
      <SelectEntity key={friendId} userId={friendId} onClick={createEmptyChat} />
    ),
    [createEmptyChat],
  );

  const selectEntities = useMemo(() => {
    if (name.length) {
      return searchFriendIds.map(renderSelectEntity);
    }
    return friendIds.map(renderSelectEntity);
  }, [name.length, searchFriendIds, friendIds, renderSelectEntity]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <NewMessageSvg viewBox="0 0 24 24" className="new-chat__icon" />
            <span>{t('newChat.new_message')}</span>
          </>
        }
        closeModal={onClose}
        content={
          <div className="new-chat">
            <SearchBox containerClassName="new-chat__search" onChange={handleSearchInputChange} />

            <div onClick={createGroupChat} className="new-chat__new-group">
              <div className="new-chat__new-group__img">
                <GroupSvg viewBox="0 0 24 24" />
              </div>
              <span className="new-chat__new-group__title">{t('newChat.new_group')}</span>
              <div className="new-chat__new-group__go">
                <ArrowSvg viewBox="0 0 8 14" />
              </div>
            </div>
            <InfiniteScroll
              className="new-chat__friends-block"
              onReachExtreme={loadMore}
              hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
              isLoading={name.length ? searchFriendsLoading : friendsLoading}>
              {selectEntities}
            </InfiniteScroll>
          </div>
        }
        buttons={[]}
      />
    </WithBackground>
  );
};

NewChatModal.displayName = 'NewChatModal';

export { NewChatModal };
