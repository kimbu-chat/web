import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

import { useTranslation } from 'react-i18next';
import { WithBackground, Modal } from '@components/shared';
import { InfiniteScroll, SelectEntity, SearchBox } from '@components/messenger-page';
import './add-call-modal.scss';
import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';
import { ReactComponent as CallSvg } from '@icons/call.svg';
import { IPage } from '@store/common/models';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import { outgoingCallAction } from '@store/calls/actions';

interface IAddCallModalProps {
  onClose: () => void;
}

export const AddCallModal: React.FC<IAddCallModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

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
    const page: IPage = {
      offset: name.length ? searchFriendIds?.length || 0 : friendIds.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page, name, initializedByScroll: true });
  }, [searchFriendIds?.length, friendIds.length, loadFriends, name]);

  const call = useCallback(
    (userId: number) => {
      onClose();
      callInterlocutor({
        callingId: userId,
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
              onChange={handleSearchInputChange}
            />
            <InfiniteScroll
              className="add-call-modal__friends-block"
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
