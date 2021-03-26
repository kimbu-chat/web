import { ICall } from '@store/calls/common/models';
import './call-item.scss';
import React, { useContext } from 'react';

import IncomingCallSvg from '@icons/incoming-call.svg';
import OutgoingCallSvg from '@icons/outgoing-call.svg';
import DeclinedCallSvg from '@icons/declined-call.svg';
import MissedCallSvg from '@icons/missed-call.svg';
import { LocalizationContext } from '@contexts';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { myIdSelector } from '@store/my-profile/selectors';
import { CallStatus } from '@store/common/models';
import { StatusBadge } from '@components';

interface ICallItem {
  call: ICall;
}

export const CallItem: React.FC<ICallItem> = ({ call }) => {
  const { t } = useContext(LocalizationContext);

  const myId = useSelector(myIdSelector);

  const isOutgoing = myId === call.userCallerId;
  const missedByMe = !isOutgoing && call.status === CallStatus.NotAnswered;

  return (
    <div className="call-from-list">
      <StatusBadge
        containerClassName="call-from-list__interlocutor-avatar"
        user={call.userInterlocutor}
      />
      <div className="call-from-list__data">
        <div className={`call-from-list__name ${missedByMe ? 'call-from-list__name--missed' : ''}`}>
          {`${call.userInterlocutor.firstName} ${call.userInterlocutor.lastName}`}
        </div>
        <div className="call-from-list__type">
          {call.status === CallStatus.Cancelled && t('callFromList.canceled')}

          {call.status === CallStatus.Declined && t('callFromList.declined')}

          {call.status === CallStatus.Ended &&
            !isOutgoing &&
            t('callFromList.incoming', {
              duration: moment.utc(call.duration! * 1000).format('HH:mm:ss'),
            })}

          {call.status === CallStatus.Ended &&
            isOutgoing &&
            t('callFromList.outgoing', {
              duration: moment.utc(call.duration! * 1000).format('HH:mm:ss'),
            })}

          {call.status === CallStatus.NotAnswered &&
            (isOutgoing ? t('callFromList.missed') : t('callFromList.notAnswered'))}
        </div>
      </div>
      <div className="call-from-list__aside-data">
        <div className="call-from-list__date">02:34 am</div>
        <div
          className={`call-from-list__type-icon ${
            missedByMe ? 'call-from-list__type-icon--missed' : ''
          }`}>
          {call.status === CallStatus.Ended &&
            (isOutgoing ? (
              <OutgoingCallSvg viewBox="0 0 11 12" />
            ) : (
              <IncomingCallSvg viewBox="0 0 12 12" />
            ))}
          {(call.status === CallStatus.Declined || call.status === CallStatus.Cancelled) && (
            <DeclinedCallSvg viewBox="0 0 13 14" />
          )}
          {(call.status === CallStatus.NotAnswered || call.status === CallStatus.Interrupted) && (
            <MissedCallSvg viewBox="0 0 12 12" />
          )}
        </div>
      </div>
    </div>
  );
};
