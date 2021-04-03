import React, { useCallback, useContext, useState } from 'react';
import './sessions-list.scss';
import { ReactComponent as ArrowSvg } from '@icons/arrow.svg';
import { LocalizationContext } from '@contexts';
import { InfiniteScrollLoader } from '@components/messenger-page/shared/infinite-scroll/infinite-scroll-loader/infinite-scroll-loader';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSessionsLoadingSelector, getSessionsSelector } from '@store/settings/selectors';
import { useSelector } from 'react-redux';
import { GetSessionList } from '@store/settings/features/get-sesion-list/get-sesion-list';
import { Session } from './session/session';

export const SessionsList = () => {
  const { t } = useContext(LocalizationContext);

  const getSessions = useActionWithDispatch(GetSessionList.action);

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
      <div className="sessions-list__header">
        <span>
          {t('sessionaList.title', { count: sessions.length === 0 ? undefined : sessions.length })}
        </span>

        <button
          onClick={loadSessionsList}
          type="button"
          className={`sessions-list__header__open ${
            opened ? 'sessions-list__header__open--opened' : ''
          }`}>
          <ArrowSvg viewBox="0 0 48 48" />
        </button>
      </div>

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
