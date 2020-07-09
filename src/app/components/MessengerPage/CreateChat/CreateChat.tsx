import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { getFriendsAction, unsetSelectedUserIdsForNewConferenceAction } from '../../../store/friends/actions';
import { createConferenceAction } from '../../../store/conferences/actions';
import FriendItem from './FriendItem/FriendItem';
import './_CreateChat.scss';

namespace CreateChat {
  export interface Props {
    hide: () => void;
  }
}

const CreateChat = React.forwardRef(({ hide }: CreateChat.Props, ref: React.Ref<HTMLDivElement>) => {
  const loadFriends = useActionWithDispatch(getFriendsAction);
  const unsetFriends = useActionWithDispatch(unsetSelectedUserIdsForNewConferenceAction);
  const submitConferenceCreation = useActionWithDeferred(createConferenceAction);

  const friends = useSelector((state) => state.friends.friends);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const selectedUserIds = useSelector((state) => state.friends.userIdsToAddIntoConference);

  const [chatName, setChatName] = useState<string>('');
  const [searchFriendStr, setSearchFriendStr] = useState<string>('');

  const searchFriends = (name: string) => {
    setSearchFriendStr(name);
    loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
  };

  useEffect(() => {
    searchFriends('');
  }, []);

  const onRejectConferenceCreation = () => {
    unsetFriends();
    hide();
  };

  const createConference = () => {
    submitConferenceCreation({
      name: chatName,
      currentUser: currentUser,
      userIds: selectedUserIds
    }).then(hide);
  };

  return (
    <div ref={ref} className="messenger__create-chat">
      <div className="messenger__create-chat__header">
        <button onClick={onRejectConferenceCreation} className="messenger__create-chat__back flat">
          <div className="svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M10.634 3.634a.9.9 0 1 0-1.278-1.268l-4.995 5.03a.9.9 0 0 0 0 1.268l4.936 4.97a.9.9 0 0 0 1.278-1.268L6.268 8.03l4.366-4.396z"></path>
            </svg>
          </div>
          <span>Назад</span>
        </button>
        <div className="messenger__create-chat__title">Создание нового чата</div>
        <div className=""></div>
      </div>
      <div className="messenger__create-chat__chat-data">
        <div className="messenger__create-chat__img-select">
          <div className="svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M6.72 4.36l.2-.35A4 4 0 0110.38 2h3.23a4 4 0 013.46 1.99l.21.37 2.32.35A4 4 0 0123 8.67V17a5 5 0 01-5 5H6a5 5 0 01-5-5V8.67A4 4 0 014.4 4.7l2.32-.35zm.78 1.9l-2.8.43A2 2 0 003 8.67V17a3 3 0 003 3h12a3 3 0 003-3V8.67a2 2 0 00-1.7-1.98l-2.78-.43a1 1 0 01-.72-.48l-.45-.79A2 2 0 0013.62 4h-3.23a2 2 0 00-1.74 1l-.44.77a1 1 0 01-.71.5zM12 8a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
        <input
          onChange={(e) => setChatName(e.target.value)}
          value={chatName}
          type="text"
          placeholder="Название чата"
          className="messenger__create-chat__chat-title"
        />
      </div>
      <div className="messenger__create-chat__contacts-select">
        <input
          placeholder="Поиск по контактам"
          type="text"
          className="messenger__create-chat__contact-name"
          onChange={(e) => searchFriends(e.target.value)}
          value={searchFriendStr}
        />
        <div className="messenger__create-chat__contacts-list">
          {friends.map((friend) => (
            <FriendItem user={friend} key={friend.id} />
          ))}
        </div>
      </div>
      <div className="messenger__create-chat__confirm-chat">
        <button onClick={createConference} className="messenger__create-chat__confirm-chat-btn">
          Создать чат
        </button>
        <button onClick={onRejectConferenceCreation} className="messenger__create-chat__dismiss-chat-btn">
          Отменить
        </button>
      </div>
    </div>
  );
});

export default CreateChat;
