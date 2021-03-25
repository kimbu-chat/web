import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { LocalizationContext } from '@contexts';
import { InfiniteScroll, SelectEntity, SearchBox, WithBackground, Modal } from '@components';
import './add-call-modal.scss';
import AddCallSvg from '@icons/add-call.svg';
import CallSvg from '@icons/call.svg';
import { IPage } from '@store/common/models';
import { GetFriends } from '@store/friends/features/get-friends/get-friends';
import { getMyFriendsSelector, getHasMoreFriendsSelector, getFriendsLoadingSelector } from '@store/friends/selectors';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import * as CallActions from '@store/calls/actions';

interface IAddCallModalProps {
  onClose: () => void;
}

export const AddCallModal: React.FC<IAddCallModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const friends = useSelector(getMyFriendsSelector);
  const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
  const friendsLoading = useSelector(getFriendsLoadingSelector);

  const loadFriends = useActionWithDispatch(GetFriends.action);
  const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: friends.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page });
  }, [friends, loadFriends]);

  const searchFriends = useCallback((name: string) => {
    loadFriends({ page: { offset: 0, limit: FRIENDS_LIMIT }, name, initializedBySearch: true });
  }, []);

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

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <AddCallSvg viewBox='0 0 65 64' className='add-call-modal__icon' />

            <span> {t('addCallModal.title')} </span>
          </>
        }
        closeModal={onClose}
        content={
          <div className='add-call-modal'>
            <SearchBox
              containerClassName='add-call-modal__search-container'
              iconClassName='add-call-modal__search__icon'
              inputClassName='add-call-modal__search__input'
              onChange={(e) => searchFriends(e.target.value)}
            />
            <InfiniteScroll className='add-call-modal__friends-block' onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading}>
              {friends?.map((user) => (
                <SelectEntity
                  icon={
                    <button onClick={() => call(user)} type='button' className='add-call-modal__call'>
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
