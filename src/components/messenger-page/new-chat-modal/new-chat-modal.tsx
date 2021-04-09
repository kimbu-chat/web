import { Modal, WithBackground } from '@components/shared';
import { InfiniteScroll, SearchBox } from '@components/messenger-page';
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './new-chat-modal.scss';
import * as FriendActions from '@store/friends/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

import { useTranslation } from 'react-i18next';
import { IUser, IPage } from '@store/common/models';
import { useHistory } from 'react-router';

import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as NewMessageSvg } from '@icons/create-chat.svg';

import {
  getFriendsLoadingSelector,
  getHasMoreFriendsSelector,
  getMyFriendsSelector,
  getMySearchFriendsSelector,
} from '@store/friends/selectors';

import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import { ChatId } from '@store/chats/chat-id';

import { IChat } from '@store/chats/models';
import { SelectEntity } from '../shared/select-entity/select-entity';

interface INewChatModalProps {
  onClose: () => void;
  displayCreateGroupChat: () => void;
}

export const NewChatModal: React.FC<INewChatModalProps> = React.memo(
  ({ onClose, displayCreateGroupChat }) => {
    const { t } = useTranslation();

    const [name, setName] = useState('');

    const friends = useSelector(getMyFriendsSelector);
    const searchFriends = useSelector(getMySearchFriendsSelector);
    const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
    const friendsLoading = useSelector(getFriendsLoadingSelector);

    const loadFriends = useActionWithDispatch(FriendActions.getFriends);

    const history = useHistory();

    const createEmptyChat = useCallback(
      (user: IChat | IUser) => {
        const chatId = ChatId.from((user as IUser).id).id;
        history.push(`/chats/${chatId}`);
        onClose();
      },
      [history, onClose],
    );

    const loadMore = useCallback(() => {
      const page: IPage = {
        offset: name.length > 0 ? searchFriends.length : friends.length,
        limit: FRIENDS_LIMIT,
      };
      loadFriends({ page, name, initializedByScroll: true });
    }, [searchFriends.length, friends.length, loadFriends, name]);

    const searchFriendsList = useCallback(
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

    useEffect(
      () => () => {
        searchFriendsList('');
      },
      [searchFriendsList],
    );

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
              <SearchBox
                containerClassName="new-chat__search"
                onChange={(e) => searchFriendsList(e.target.value)}
              />

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
                hasMore={hasMoreFriends}
                isLoading={friendsLoading}>
                {name.length > 0
                  ? searchFriends.map((friend) => (
                      <SelectEntity key={friend.id} chatOrUser={friend} onClick={createEmptyChat} />
                    ))
                  : friends.map((friend) => (
                      <SelectEntity key={friend.id} chatOrUser={friend} onClick={createEmptyChat} />
                    ))}
              </InfiniteScroll>
            </div>
          }
          buttons={[]}
        />
      </WithBackground>
    );
  },
);
