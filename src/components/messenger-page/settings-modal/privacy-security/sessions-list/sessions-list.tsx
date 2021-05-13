import React, { useCallback, useState } from 'react';
import './sessions-list.scss';
import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';

import { useTranslation } from 'react-i18next';
import { InfiniteScrollLoader } from '@components/messenger-page/shared/infinite-scroll/infinite-scroll-loader/infinite-scroll-loader';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSessionsLoadingSelector, getSessionsSelector } from '@store/settings/selectors';
import { useSelector } from 'react-redux';
import { getSessionListAction } from '@store/settings/actions';
import { Session } from './session/session';

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
    <div className="sessions-list">
      <div onClick={loadSessionsList} className="sessions-list__header">
        <span>
          {t('sessionaList.title', { count: sessions.length === 0 ? undefined : sessions.length })}
        </span>

        <button
          type="button"
          className={`sessions-list__header__open ${
            opened ? 'sessions-list__header__open--opened' : ''
          }`}>
          <span>{opened ? t('sessionaList.hide-all') : t('sessionaList.show-all')}</span>
          <ArrowSvg />
        </button>
      </div>
      <div className="sessions-list__details">{t('sessionaList.details')}</div>

      {opened && (
        <div className="sessions-list__content">
          {sessions.map((session) => (
            <Session key={session.id} session={session} />
          ))}
        </div>
      )}

      {opened && loading && <InfiniteScrollLoader />}
    </div>
  );
};
