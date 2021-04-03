import React, { useCallback, useState } from 'react';
import './blocked-users.scss';
import { ReactComponent as ArrowSvg } from '@icons/arrow.svg';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import { InfiniteScrollLoader } from '@components/messenger-page/shared/infinite-scroll/infinite-scroll-loader/infinite-scroll-loader';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getBlockedUsersSelector, getBlockedUsersLoadingSelector } from '@store/settings/selectors';
import { useSelector } from 'react-redux';
import { GetBlackList } from '@store/settings/features/get-black-list/get-black-list';
import { BlockedUser } from './blocked-user/blocked-user';

export const BlockedUsers = () => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

  const getBlockedUsers = useActionWithDispatch(GetBlackList.action);

  const blockedUsers = useSelector(getBlockedUsersSelector);
  const loading = useSelector(getBlockedUsersLoadingSelector);

  const [opened, setOpened] = useState(false);

  const loadBlockedUsers = useCallback(() => {
    if (opened) {
      setOpened(false);
    } else {
      setOpened(true);

      getBlockedUsers();
    }
  }, [opened, setOpened, getBlockedUsers]);

  return (
    <div className="blocked-users">
      <div className="blocked-users__header">
        <span>
          {t('blockedUsers.title', {
            count: blockedUsers.length === 0 ? undefined : blockedUsers.length,
          })}
        </span>

        <button
          onClick={loadBlockedUsers}
          type="button"
          className={`blocked-users__header__open ${
            opened ? 'blocked-users__header__open--opened' : ''
          }`}>
          <ArrowSvg viewBox="0 0 48 48" />
        </button>
      </div>

      {opened && (
        <div className="blocked-users__content">
          {blockedUsers.map((user) => (
            <BlockedUser key={user.id} user={user} />
          ))}
        </div>
      )}

      {opened && loading && <InfiniteScrollLoader />}
    </div>
  );
};
