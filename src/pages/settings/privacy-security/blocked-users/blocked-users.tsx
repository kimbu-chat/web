import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { Button } from '@shared-components/button';
import { getBlackListAction } from '@store/settings/actions';
import { getBlockedUsersLoadingSelector, getBlockedUsersSelector } from '@store/settings/selectors';

import { BlockedUser } from './blocked-user/blocked-user';

import './blocked-users.scss';

export const BlockedUsers = () => {
  const { t } = useTranslation();

  const getBlockedUsers = useActionWithDispatch(getBlackListAction);

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
      <div onClick={loadBlockedUsers} className="blocked-users__header">
        <span>
          {t('blockedUsers.title', {
            count: blockedUsers.length === 0 ? undefined : blockedUsers.length,
          })}
        </span>

        <Button
          type="button"
          themed
          loading={loading}
          className={`blocked-users__header__open ${
            opened ? 'blocked-users__header__open--opened' : ''
          }`}>
          <span>{opened ? t('blockedUsers.hide-all') : t('blockedUsers.show-all')}</span>
          <ArrowSvg />
        </Button>
      </div>
      <div className="blocked-users__details">{t('blockedUsers.details')}</div>
      {opened && (
        <div className="blocked-users__content">
          {blockedUsers.map((user) => (
            <BlockedUser key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};
