import { ISession } from '@store/my-profile/comon/models';
import React, { useContext } from 'react';
import './session.scss';
import WindowsSvg from '@icons/windows.svg';
import MacSvg from '@icons/mac.svg';
import Linux from '@icons/linux.svg';
import { LocalizationContext } from '@contexts';
import moment from 'moment';

interface ISessionProps {
  session: ISession;
}

export const Session: React.FC<ISessionProps> = ({ session }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className="session">
      {session.os.includes('Windows') && <WindowsSvg className="session__icon" viewBox="0 0 108 108" />}
      {(session.os.includes('Mac') || session.os.includes('iOS')) && <MacSvg className="session__icon" viewBox="0 0 108 108" />}
      {(session.os.includes('Linux') || session.os.includes('iOS')) && <Linux className="session__icon" viewBox="0 0 108 108" />}

      <div className="session__data">
        <div className="session__data__ordinary">{session.ipAddress}</div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{session.clientApp}</div>
          <div className="session__data__ordinary">{session.os}</div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{t('session.last-acessed')}</div>
          <div className="session__data__ordinary">{moment.utc(session.lastAccessedDateTime).local().format('MMM DD,YYYY').toString()}</div>
        </div>

        <div className="session__data__row">
          <div className="session__data__highlighted">{t('session.signed-in')}</div>
          <div className="session__data__ordinary">{moment.utc(session.signedInDateTime).local().format('MMM DD,YYYY').toString()}</div>
        </div>
      </div>

      {false ? (
        <div className="session__current-session">{t('session.current-session')}</div>
      ) : (
        <button className="session__revoke-btn" type="button">
          {t('session.revoke')}
        </button>
      )}
    </div>
  );
};
