import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

import { useTranslation } from 'react-i18next';
import { WithBackground, Modal } from '@components/shared';
import { InfiniteScroll, SelectEntity, SearchBox } from '@components/messenger-page';
import './add-call-modal.scss';
import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';
import { ReactComponent as CallSvg } from '@icons/call.svg';
import { IPage } from '@store/common/models';
import * as FriendActions from '@store/friends/actions';
import {
  getMyFriendsSelector,
  getMySearchFriendsSelector,
  getHasMoreFriendsSelector,
  getFriendsLoadingSelector,
} from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import * as CallActions from '@store/calls/actions';

interface IAddCallModalProps {
  onClose: () => void;
}

export const AddCallModal: React.FC<IAddCallModalProps> = React.memo(({ onClose }) => {
  const { t } = useTranslation();

  const friends = useSelector(getMyFriendsSelector);
  const searchFriends = useSelector(getMySearchFriendsSelector);
  const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
  const friendsLoading = useSelector(getFriendsLoadingSelector);

  const loadFriends = useActionWithDispatch(FriendActions.getFriends);
  const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);

  const [name, setName] = useState('');

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

  const call = useCallback(
    (user) => {
      onClose();
      callInterlocutor({
        calling: user,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      });
    },
    [callInterlocutor, onClose],
  );

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
            <AddCallSvg viewBox="0 0 65 64" className="add-call-modal__icon" />

            <span> {t('addCallModal.title')} </span>
          </>
        }
        closeModal={onClose}
        content={
          <div className="add-call-modal">
            <SearchBox
              containerClassName="add-call-modal__search-container"
              iconClassName="add-call-modal__search__icon"
              inputClassName="add-call-modal__search__input"
              onChange={(e) => searchFriendsList(e.target.value)}
            />
            <InfiniteScroll
              className="add-call-modal__friends-block"
              onReachExtreme={loadMore}
              hasMore={hasMoreFriends}
              isLoading={friendsLoading}>
              {name.length > 0
                ? searchFriends.map((user) => (
                    <SelectEntity
                      icon={
                        <button
                          onClick={() => call(user)}
                          type="button"
                          className="add-call-modal__call">
                          <CallSvg />
                        </button>
                      }
                      key={user.id}
                      chatOrUser={user}
                    />
                  ))
                : friends.map((user) => (
                    <SelectEntity
                      icon={
                        <button
                          onClick={() => call(user)}
                          type="button"
                          className="add-call-modal__call">
                          <CallSvg />
                        </button>
                      }
                      key={user.id}
                      chatOrUser={user}
                    />
                  ))}
            </InfiniteScroll>
          </div>
        }
        buttons={[]}
      />
    </WithBackground>
  );
});
