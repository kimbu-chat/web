import React, { useCallback, useState } from 'react';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button } from '@components/button';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { deviceIdSelector } from '@store/auth/selectors';
import { revokeSessionAction } from '@store/settings/actions';
import { ISession } from '@store/settings/comon/models/session';
import { MONTH_DAY_YEAR } from '@utils/constants';

import './session.scss';

interface ISessionProps {
  session: ISession;
}

export const Session: React.FC<ISessionProps> = ({ session }) => {
  const { t } = useTranslation();

  const [revoking, setRevoking] = useState(false);

  const currentDeviceId = useSelector(deviceIdSelector);

  const revokeSession = useActionWithDeferred(revokeSessionAction);

  const revokeThisSession = useCallback(() => {
    setRevoking(true);
    revokeSession(session.id).then(() => {
      setRevoking(false);
    });
  }, [session.id, revokeSession]);

  const formatSessionTime = useCallback(
    (dateTime: string) => dayjs.utc(dateTime).local().format(MONTH_DAY_YEAR).toString(),
    [],
  );

  return (
    <div className="session">
      <div className="session__data">
        <div className="session__data__row">
          <div className="session__data__highlighted">IP</div>
          <div className="session__data__ordinary">{session.ipAddress}</div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{session.clientApp}</div>
          <div className="session__data__ordinary">{session.os}</div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{t('session.last-acessed')}</div>
          <div className="session__data__ordinary">
            {formatSessionTime(session.lastAccessedDateTime)}
          </div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{t('session.signed-in')}</div>
          <div className="session__data__ordinary">
            {formatSessionTime(session.signedInDateTime)}
          </div>
        </div>
      </div>

      {Number(currentDeviceId) === session.id ? (
        <div className="session__current-session">{t('session.current-session')}</div>
      ) : (
        <Button
          loading={revoking}
          onClick={revokeThisSession}
          className="session__revoke-btn"
          type="button">
          {t('session.revoke')}
        </Button>
      )}
    </div>
  );
};
