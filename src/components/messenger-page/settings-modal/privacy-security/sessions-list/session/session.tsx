import React, { useCallback, useState } from 'react';
import './session.scss';
import { ReactComponent as WindowsSvg } from '@icons/windows.svg';
import { ReactComponent as MacSvg } from '@icons/mac.svg';
import { ReactComponent as Linux } from '@icons/linux.svg';

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { ISession } from '@store/settings/comon/models/session';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { RevokeSession } from '@store/settings/features/revoke-session/revoke-session';
import { deviceIdSelector } from '@store/auth/selectors';
import { useSelector } from 'react-redux';

import { Button } from '@components/shared';

interface ISessionProps {
  session: ISession;
}

export const Session: React.FC<ISessionProps> = ({ session }) => {
  const { t } = useTranslation();

  const [revoking, setRevoking] = useState(false);

  const currentDeviceId = useSelector(deviceIdSelector);

  const revokeSession = useActionWithDeferred(RevokeSession.action);

  const revokeThisSession = useCallback(() => {
    setRevoking(true);
    revokeSession(session.id).then(() => {
      setRevoking(false);
    });
  }, [session.id, revokeSession]);

  return (
    <div className="session">
      {session.os.includes('Windows') && (
        <WindowsSvg className="session__icon" viewBox="0 0 108 108" />
      )}
      {(session.os.includes('Mac') || session.os.includes('iOS')) && (
        <MacSvg className="session__icon" viewBox="0 0 108 108" />
      )}
      {session.os.includes('Linux') && <Linux className="session__icon" viewBox="0 0 108 108" />}

      <div className="session__data">
        <div className="session__data__ordinary">{session.ipAddress}</div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{session.clientApp}</div>
          <div className="session__data__ordinary">{session.os}</div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{t('session.last-acessed')}</div>
          <div className="session__data__ordinary">
            {moment.utc(session.lastAccessedDateTime).local().format('MMM DD,YYYY').toString()}
          </div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{t('session.signed-in')}</div>
          <div className="session__data__ordinary">
            {moment.utc(session.signedInDateTime).local().format('MMM DD,YYYY').toString()}
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
