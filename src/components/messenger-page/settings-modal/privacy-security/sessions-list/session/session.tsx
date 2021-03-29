import React, { useCallback, useContext } from 'react';
import './session.scss';
import WindowsSvg from '@icons/windows.svg';
import MacSvg from '@icons/mac.svg';
import Linux from '@icons/linux.svg';
import { LocalizationContext } from '@app/contexts';
import moment from 'moment';
import { ISession } from '@app/store/settings/comon/models/session';
import { useActionWithDeferred } from '@app/hooks/use-action-with-deferred';
import { RevokeSession } from '@app/store/settings/features/revoke-session/revoke-session';
import { deviceIdSelector } from '@app/store/auth/selectors';
import { useSelector } from 'react-redux';

interface ISessionProps {
  session: ISession;
}

export const Session: React.FC<ISessionProps> = ({ session }) => {
  const { t } = useContext(LocalizationContext);

  const currentDeviceId = useSelector(deviceIdSelector);

  const revokeSession = useActionWithDeferred(RevokeSession.action);

  const revokeThisSession = useCallback(() => {
    revokeSession(session.id);
  }, [session.id]);

  return (
    <div className='session'>
      {session.os.includes('Windows') && <WindowsSvg className='session__icon' viewBox='0 0 108 108' />}
      {(session.os.includes('Mac') || session.os.includes('iOS')) && <MacSvg className='session__icon' viewBox='0 0 108 108' />}
      {session.os.includes('Linux') && <Linux className='session__icon' viewBox='0 0 108 108' />}

      <div className='session__data'>
        <div className='session__data__ordinary'>{session.ipAddress}</div>

        <div className='session__data__row'>
          <div className='session__data__highlighted'>{session.clientApp}</div>
          <div className='session__data__ordinary'>{session.os}</div>
        </div>

        <div className='session__data__row'>
          <div className='session__data__highlighted'>{t('session.last-acessed')}</div>
          <div className='session__data__ordinary'>{moment.utc(session.lastAccessedDateTime).local().format('MMM DD,YYYY').toString()}</div>
        </div>

        <div className='session__data__row'>
          <div className='session__data__highlighted'>{t('session.signed-in')}</div>
          <div className='session__data__ordinary'>{moment.utc(session.signedInDateTime).local().format('MMM DD,YYYY').toString()}</div>
        </div>
      </div>

      {Number(currentDeviceId) === session.id ? (
        <div className='session__current-session'>{t('session.current-session')}</div>
      ) : (
        <button onClick={revokeThisSession} className='session__revoke-btn' type='button'>
          {t('session.revoke')}
        </button>
      )}
    </div>
  );
};
