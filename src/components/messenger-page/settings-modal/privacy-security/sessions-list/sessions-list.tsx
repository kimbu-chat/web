import React, { useCallback, useContext, useState } from 'react';
import './sessions-list.scss';
import { ReactComponent as ArrowSvg } from '@icons/arrow.svg';
import { LocalizationContext } from '@contexts';
import { InfiniteScrollLoader } from '@components/messenger-page/shared/infinite-scroll/infinite-scroll-loader/infinite-scroll-loader';
import { ISession } from '@store/my-profile/comon/models';
import { Session } from './session/session';

const mockedSessionsList: ISession[] = [
  {
    id: 10226,
    ipAddress: '46.55.34.158',
    signedInDateTime: new Date('2021-03-18T15:06:47.9123432'),
    lastAccessedDateTime: new Date('2021-03-22T19:45:47.5338699'),
    os: 'Windows 10',
    clientApp: 'Chrome 89.0.4389',
  },
  {
    id: 10220,
    ipAddress: '46.55.34.158',
    signedInDateTime: new Date('2021-03-13T18:28:04.9433634'),
    lastAccessedDateTime: new Date('2021-03-13T19:41:19.0351381'),
    os: 'Windows 10',
    clientApp: 'Chrome 89.0.4389',
  },
];

export const SessionsList = () => {
  const { t } = useContext(LocalizationContext);

  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSessionsList = useCallback(() => {
    if (opened) {
      setOpened(false);
    } else {
      setLoading(true);
      setOpened(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [opened, setOpened, setLoading]);

  return (
    <div className="sessions-list">
      <div className="sessions-list__header">
        <span>{t('sessionaList.title', { count: 2 })}</span>

        <button
          onClick={loadSessionsList}
          type="button"
          className={`sessions-list__header__open ${
            opened ? 'sessions-list__header__open--opened' : ''
          }`}>
          <ArrowSvg viewBox="0 0 48 48" />
        </button>
      </div>

      {opened && loading && <InfiniteScrollLoader />}

      {opened && (
        <div className="sessions-list__content">
          {mockedSessionsList.map((session) => (
            <Session key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};
