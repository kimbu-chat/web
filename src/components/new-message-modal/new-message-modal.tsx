import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';

import { IUser } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { InfiniteScroll } from '@components/infinite-scroll';
import { Modal, IModalChildrenProps } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { ReactComponent as NewMessageSvg } from '@icons/create-chat.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { ChatId } from '@store/chats/chat-id';
import { INormalizedChat } from '@store/chats/models';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { replaceInUrl } from '@utils/replace-in-url';

import './new-message-modal.scss';

interface IInitialNewMessageModalProps {
  displayCreateGroupChat: () => void;
}

interface INewMessageModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'new-message-modal';

const InitialNewMessageModal: React.FC<IInitialNewMessageModalProps & IModalChildrenProps> = ({ animatedClose, displayCreateGroupChat }) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');

  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const { hasMore: hasMoreFriends, friendIds } = friendsList;
  const { hasMore: hasMoreSearchFriends, friendIds: searchFriendIds } = searchFriendsList;

  const loadFriends = useActionWithDispatch(getFriendsAction);
  const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

  useEffect(
    () => () => {
      resetSearchFriends();
    },
    [resetSearchFriends],
  );

  const navigate = useNavigate();

  const createEmptyChat = useCallback(
    (user: INormalizedChat | IUser) => {
      const chatId = ChatId.from((user as IUser).id).id;
      navigate(replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', chatId]));
      animatedClose();
    },
    [navigate, animatedClose],
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

  const createGroupChat = useCallback(() => {
    displayCreateGroupChat();
    animatedClose();
  }, [displayCreateGroupChat, animatedClose]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => queryFriends(e.target.value), [queryFriends]);

  const renderSelectEntity = useCallback(
    (friendId: number) => <SelectEntity key={friendId} userId={friendId} onClick={createEmptyChat} />,
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
          <span>{t('newMessage.new_message')}</span>
        </>
      </Modal.Header>
      <div className={BLOCK_NAME}>
        <SearchBox containerClassName={`${BLOCK_NAME}__search`} onChange={handleSearchInputChange} />

        <div onClick={createGroupChat} className={`${BLOCK_NAME}__new-group`}>
          <div className={`${BLOCK_NAME}__new-group__img`}>
            <GroupSvg />
          </div>
          <span className={`${BLOCK_NAME}__new-group__title`}>{t('newMessage.new_group')}</span>
          <div className={`${BLOCK_NAME}__new-group__go`}>
            <ArrowSvg />
          </div>
        </div>
        <InfiniteScroll
          containerRef={containerRef}
          className={`${BLOCK_NAME}__friends-block`}
          onReachBottom={loadMore}
          hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}>
          {selectEntities}
        </InfiniteScroll>
      </div>
    </div>
  );
};

const NewMessageModal: React.FC<INewMessageModalProps & IInitialNewMessageModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>{(animatedClose: () => void) => <InitialNewMessageModal {...props} animatedClose={animatedClose} />}</Modal>
);

NewMessageModal.displayName = 'NewMessageModal';

export { NewMessageModal };
