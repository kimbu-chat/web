import React, { useCallback, useContext, useState } from 'react';
import './blocked-users.scss';
import ArrowSvg from '@icons/arrow.svg';
import { LocalizationContext } from '@app/contexts';
import { InfiniteScrollLoader } from '@app/components/messenger-page/shared/infinite-scroll/infinite-scroll-loader/infinite-scroll-loader';
import { useActionWithDispatch } from '@app/hooks/use-action-with-dispatch';
import { getBlockedUsersSelector, getBlockedUsersLoadingSelector } from '@app/store/settings/selectors';
import { useSelector } from 'react-redux';
import { GetBlackList } from '@app/store/settings/features/get-black-list/get-black-list';
import { BlockedUser } from './blocked-user/blocked-user';

export const BlockedUsers = () => {
  const { t } = useContext(LocalizationContext);

  const getBlockedUsers = useActionWithDispatch(GetBlackList.action);

  const blockedUsers = useSelector(getBlockedUsersSelector);
  const loading = useSelector(getBlockedUsersLoadingSelector);

  const [opened, setOpened] = useState(false);

  const loadBlockedUsers = useCallback(() => {
    if (opened) {
      setOpened(false);
    } else {
      setOpened(true);

      if (blockedUsers.length === 0) {
        getBlockedUsers();
      }
    }
  }, [opened, setOpened]);

  return (
    <div className='blocked-users'>
      <div className='blocked-users__header'>
        <span>{t('blockedUsers.title', { count: 2 })}</span>

        <button onClick={loadBlockedUsers} type='button' className={`blocked-users__header__open ${opened ? 'blocked-users__header__open--opened' : ''}`}>
          <ArrowSvg viewBox='0 0 48 48' />
        </button>
      </div>

      {opened && loading && <InfiniteScrollLoader />}

      {opened && (
        <div className='blocked-users__content'>
          {blockedUsers.map((user) => (
            <BlockedUser key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};
