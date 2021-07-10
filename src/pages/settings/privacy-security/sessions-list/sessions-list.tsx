import React, { useCallback, useState } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button } from '@components/button';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { getSessionListAction } from '@store/settings/actions';
import { getSessionsLoadingSelector, getSessionsSelector } from '@store/settings/selectors';

import { Session } from './session/session';

import './sessions-list.scss';

const BLOCK_NAME = 'sessions-list';

export const SessionsList = () => {
  const { t } = useTranslation();

  const getSessions = useActionWithDispatch(getSessionListAction);

  const sessions = useSelector(getSessionsSelector);
  const loading = useSelector(getSessionsLoadingSelector);

  const [opened, setOpened] = useState(false);

  const loadSessionsList = useCallback(() => {
    if (opened) {
      setOpened(false);
    } else {
      setOpened(true);
      getSessions();
    }
  }, [opened, setOpened, getSessions]);

  return (
    <div className={BLOCK_NAME}>
      <div onClick={loadSessionsList} className={`${BLOCK_NAME}__header`}>
        <span>
          {t('sessionaList.title', { count: sessions.length === 0 ? undefined : sessions.length })}
        </span>

        <Button
          loading={loading}
          type="button"
          themed
          className={classnames(`${BLOCK_NAME}__header__open`, {
            [`${BLOCK_NAME}__header__open--opened`]: opened,
          })}>
          <span>{opened ? t('sessionaList.hide-all') : t('sessionaList.show-all')}</span>
          <ArrowSvg />
        </Button>
      </div>
      <div className={`${BLOCK_NAME}__details`}>{t('sessionaList.details')}</div>

      {opened && (
        <div className={`${BLOCK_NAME}__content`}>
          {sessions.map((session) => (
            <Session key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};
