import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';

import { IUser } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { InfiniteScroll } from '@components/infinite-scroll';
import { Modal, IModalChildrenProps } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as NewMessageSvg } from '@icons/create-chat.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { ChatId } from '@store/chats/chat-id';
import { INormalizedChat } from '@store/chats/models';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { replaceInUrl } from '@utils/replace-in-url';

import './new-chat-modal.scss';

interface INewChatModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'new-chat-modal';

const InitialNewChatModal: React.FC<INewChatModalProps & IModalChildrenProps> = ({
  animatedClose,
}) => {
  const { t } = useTranslation();

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
      history.push(replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', chatId]));
      animatedClose();
    },
    [history, animatedClose],
  );

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
    <div ref={containerRef}>
      <Modal.Header>
        <>
          <NewMessageSvg className={`${BLOCK_NAME}__icon`} />
          <span>{t('newChat.new_chat')}</span>
        </>
      </Modal.Header>
      <div className={BLOCK_NAME}>
        <SearchBox
          containerClassName={`${BLOCK_NAME}__search`}
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
      </div>
    </div>
  );
};

const NewChatModal: React.FC<INewChatModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialNewChatModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

NewChatModal.displayName = 'NewChatModal';

export { NewChatModal };
