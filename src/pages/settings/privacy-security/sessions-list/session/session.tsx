import React, { useCallback, useState } from 'react';

import dayjs from 'dayjs';
import { ISession } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { MONTH_DAY_YEAR } from '@common/constants';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { Button } from '@shared-components/button';
import { deviceIdSelector } from '@store/auth/selectors';
import { terminateSessionAction } from '@store/settings/actions';

import './session.scss';

interface ISessionProps {
  session: ISession;
}

export const Session: React.FC<ISessionProps> = ({ session }) => {
  const { t } = useTranslation();

  const [revoking, setRevoking] = useState(false);

  const currentDeviceId = useSelector(deviceIdSelector);

  const terminateSession = useActionWithDeferred(terminateSessionAction);

  const revokeThisSession = useCallback(() => {
    setRevoking(true);

    terminateSession(session.id);
  }, [session.id, terminateSession]);

  const formatSessionTime = useCallback(
    (dateTime: string) => dayjs.utc(dateTime).local().format(MONTH_DAY_YEAR).toString(),
    [],
  );

  return (
    <div className='session'>
      <div className='session__data'>
        <div className='session__data__row'>
          <div className='session__data__highlighted'>IP</div>
          <div className='session__data__ordinary'>{session.ipAddress}</div>
        </div>

        <div className='session__data__row'>
          <div className='session__data__highlighted'>{session.clientApp}</div>
          <div className='session__data__ordinary'>{session.os}</div>
        </div>

        <div className='session__data__row'>
          <div className='session__data__highlighted'>{t('session.last-acessed')}</div>
          <div className='session__data__ordinary'>{formatSessionTime(session.lastAccessedAt)}</div>
        </div>

        <div className='session__data__row'>
          <div className='session__data__highlighted'>{t('session.signed-in')}</div>
          <div className='session__data__ordinary'>{formatSessionTime(session.signedInAt)}</div>
        </div>
      </div>

      {Number(currentDeviceId) === session.id ? (
        <div className='session__current-session'>{t('session.current-session')}</div>
      ) : (
        <Button
          loading={revoking}
          onClick={revokeThisSession}
          className='session__revoke-btn'
          type='button'>
          {t('session.revoke')}
        </Button>
      )}
    </div>
  );
};
