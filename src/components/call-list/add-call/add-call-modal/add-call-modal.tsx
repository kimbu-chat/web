import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { IModalChildrenProps, Modal } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';
import { ReactComponent as CallSvg } from '@icons/call.svg';
import { outgoingCallAction } from '@store/calls/actions';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';

import './add-call-modal.scss';

interface IAddCallModalProps {
  onClose: () => void;
}

const InitialAddCallModal: React.FC<IAddCallModalProps & IModalChildrenProps> = ({
  animatedClose,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const friendsList = useSelector(getMyFriendsListSelector);
  const searchFriendsList = useSelector(getMySearchFriendsListSelector);

  const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

  useEffect(
    () => () => {
      resetSearchFriends();
    },
    [resetSearchFriends],
  );

  const { hasMore: hasMoreFriends, friendIds, loading: friendsLoading } = friendsList;
  const {
    hasMore: hasMoreSearchFriends,
    friendIds: searchFriendIds,
    loading: searchFriendsLoading,
  } = searchFriendsList;

  const loadFriends = useActionWithDispatch(getFriendsAction);
  const callInterlocutor = useActionWithDispatch(outgoingCallAction);

  const [name, setName] = useState('');

  const loadMore = useCallback(() => {
    loadFriends({ name, initializedByScroll: true });
  }, [loadFriends, name]);

  const call = useCallback(
    (userId: number) => {
      animatedClose();
      callInterlocutor({
        callingUserId: userId,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      });
    },
    [callInterlocutor, animatedClose],
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      loadFriends({
        name: e.target.value,
        initializedByScroll: false,
      });
    },
    [setName, loadFriends],
  );

  const renderSelectEntity = useCallback(
    (userId: number) => (
      <SelectEntity
        icon={
          <button onClick={() => call(userId)} type="button" className="add-call-modal__call">
            <CallSvg />
          </button>
        }
        key={userId}
        userId={userId}
      />
    ),
    [call],
  );

  const selectEntities = useMemo(() => {
    if (name.length) {
      return searchFriendIds?.map(renderSelectEntity);
    }
    return friendIds.map(renderSelectEntity);
  }, [name.length, searchFriendIds, friendIds, renderSelectEntity]);

  return (
    <div ref={containerRef}>
      <Modal.Header>
        <AddCallSvg className="add-call-modal__icon" />
        <span> {t('addCallModal.title')} </span>
      </Modal.Header>
      <div className="add-call-modal">
        <SearchBox
          containerClassName="add-call-modal__search-container"
          iconClassName="add-call-modal__search__icon"
          inputClassName="add-call-modal__search__input"
          onChange={handleSearchInputChange}
        />
        <InfiniteScroll
          containerRef={containerRef}
          className="add-call-modal__friends-block 1"
          onReachBottom={loadMore}
          hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
          isLoading={name.length ? searchFriendsLoading : friendsLoading}>
          {selectEntities}
        </InfiniteScroll>
      </div>
    </div>
  );
};

const AddCallModal: React.FC<IAddCallModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialAddCallModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

AddCallModal.displayName = 'AddCallModal';

export { AddCallModal };
