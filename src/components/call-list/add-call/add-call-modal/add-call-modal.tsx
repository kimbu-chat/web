import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { IPaginationParams } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { Modal } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';
import { ReactComponent as CallSvg } from '@icons/call.svg';
import { outgoingCallAction } from '@store/calls/actions';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';

import './add-call-modal.scss';

interface IAddCallModalProps {
  onClose: () => void;
}

export const AddCallModal: React.FC<IAddCallModalProps> = ({ onClose }) => {
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
    const page: IPaginationParams = {
      offset: name.length ? searchFriendIds?.length || 0 : friendIds.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name, initializedByScroll: true });
  }, [searchFriendIds?.length, friendIds.length, loadFriends, name]);

  const call = useCallback(
    (userId: number) => {
      onClose();
      callInterlocutor({
        callingUserId: userId,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      });
    },
    [callInterlocutor, onClose],
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      loadFriends({
        page: { offset: 0, limit: FRIENDS_LIMIT },
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
    <Modal closeModal={onClose}>
      <div ref={containerRef}>
        <Modal.Header>
          <AddCallSvg viewBox="0 0 65 64" className="add-call-modal__icon" />
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
    </Modal>
  );
};
