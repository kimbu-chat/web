import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { InfiniteScroll } from '@components/infinite-scroll';
import { Modal } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { ReactComponent as NewMessageSvg } from '@icons/create-chat.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ChatId } from '@store/chats/chat-id';
import { INormalizedChat } from '@store/chats/models';
import { IUser, IPage } from '@store/common/models';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';

import './new-chat-modal.scss';

interface INewChatModalProps {
  onClose: () => void;
  displayCreateGroupChat: () => void;
}

const BLOCK_NAME = 'new-chat';

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
      history.push(`/im/${chatId}`);
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
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <NewMessageSvg viewBox="0 0 24 24" className={`${BLOCK_NAME}__icon`} />
            <span>{t('newChat.new_message')}</span>
          </>
        </Modal.Header>
        <div className={BLOCK_NAME}>
          <SearchBox
            containerClassName={`${BLOCK_NAME}__search`}
            onChange={handleSearchInputChange}
          />

          <div onClick={createGroupChat} className={`${BLOCK_NAME}__new-group`}>
            <div className={`${BLOCK_NAME}__new-group__img`}>
              <GroupSvg viewBox="0 0 24 24" />
            </div>
            <span className={`${BLOCK_NAME}__new-group__title`}>{t('newChat.new_group')}</span>
            <div className={`${BLOCK_NAME}__new-group__go`}>
              <ArrowSvg viewBox="0 0 8 14" />
            </div>
          </div>
          <InfiniteScroll
            className={`${BLOCK_NAME}__friends-block`}
            onReachBottom={loadMore}
            hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
            isLoading={name.length ? searchFriendsLoading : friendsLoading}>
            {selectEntities}
          </InfiniteScroll>
        </div>
      </>
    </Modal>
  );
};

NewChatModal.displayName = 'NewChatModal';

export { NewChatModal };
