import React, { useState, useEffect } from 'react';
import { AppState } from 'app/store';
import { UserPreview } from 'app/store/contacts/types';
import { getFriendsAction, unsetSelectedUserIdsForNewConferenceAction } from 'app/store/friends/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import ContactItem from './ContactItem/ContactItem';
import { useSelector } from 'react-redux';
import './_ContactSearch.scss';

namespace ContactSearch {
  export interface Props {
    hide: () => void;
    isSelectable?: boolean;
    onSubmit?: (userIds: number[]) => void;
    displayMyself?: boolean;
    excludeIds?: (number | undefined)[];
  }
}

const ContactSearch = React.forwardRef(
  (
    { hide, isSelectable, displayMyself, excludeIds, onSubmit }: ContactSearch.Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const loadFriends = useActionWithDispatch(getFriendsAction);
    const unsetFriends = useActionWithDispatch(unsetSelectedUserIdsForNewConferenceAction);

    const [searchFriendStr, setSearchFriendStr] = useState<string>('');

    const friends = useSelector<AppState, UserPreview[]>((state) => state.friends.friends);
    const userIdsToAddIntoConference = useSelector<AppState, number[]>(
      (state) => state.friends.userIdsToAddIntoConference
    );

    const searchFriends = (name: string) => {
      setSearchFriendStr(name);
      loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
    };

    const reject = () => {
      hide();
      unsetFriends();
    };

    useEffect(() => {
      searchFriends('');

      return () => {
        loadFriends({ page: { offset: 0, limit: 100 }, name, initializedBySearch: true });
      };
    }, []);

    const submit = (): void => {
      onSubmit && onSubmit(userIdsToAddIntoConference);
    };

    return (
      <div ref={ref} className="contact-search">
        <div className="contact-search__header">
          <button onClick={hide} className="contact-search__back flat">
            <div className="svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M10.634 3.634a.9.9 0 1 0-1.278-1.268l-4.995 5.03a.9.9 0 0 0 0 1.268l4.936 4.97a.9.9 0 0 0 1.278-1.268L6.268 8.03l4.366-4.396z"></path>
              </svg>
            </div>
            <span>Назад</span>
          </button>
          <div className="contact-search__title">Поиск по контактам</div>
          <div className=""></div>
        </div>
        <div className="contact-search__contacts-select">
          <input
            placeholder="Поиск по контактам"
            type="text"
            className="contact-search__contact-name"
            onChange={(e) => searchFriends(e.target.value)}
            value={searchFriendStr}
          />
          <div className="contact-search__contacts-list">
            {friends.map(
              (friend) =>
                excludeIds?.includes(friend.id) || (
                  <ContactItem
                    displayMyself={displayMyself}
                    isSelectable={isSelectable}
                    user={friend}
                    key={friend.id}
                  />
                )
            )}
          </div>
        </div>
        {isSelectable && (
          <div className="messenger__create-chat__confirm-chat">
            <button onClick={submit} className="messenger__create-chat__confirm-chat-btn">
              Создать чат
            </button>
            <button onClick={reject} className="messenger__create-chat__dismiss-chat-btn">
              Отменить
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default ContactSearch;
