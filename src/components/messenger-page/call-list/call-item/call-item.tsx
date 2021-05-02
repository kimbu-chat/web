import './call-item.scss';
import React from 'react';

import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { myIdSelector } from '@store/my-profile/selectors';
import { CallStatus } from '@store/common/models';
import { Avatar } from '@components/shared';
import { getUserName } from '@utils/user-utils';
import { getUserSelector } from '@store/users/selectors';
import { getCallSelector } from '@store/calls/selectors';

interface ICallItemProps {
  callId: number;
}

const CallItem: React.FC<ICallItemProps> = ({ callId }) => {
  const { t } = useTranslation();

  const call = useSelector(getCallSelector(callId));
  const userInterlocutor = useSelector(getUserSelector(call?.userInterlocutor));

  const myId = useSelector(myIdSelector);

  const isOutgoing = myId === call?.userCallerId;
  const missedByMe = !isOutgoing && call?.status === CallStatus.NotAnswered;

  return (
    <div className="call-from-list">
      <Avatar className="call-from-list__interlocutor-avatar" user={userInterlocutor} />
      <div className="call-from-list__data">
        <div className={`call-from-list__name ${missedByMe ? 'call-from-list__name--missed' : ''}`}>
          {userInterlocutor && getUserName(userInterlocutor, t)}
        </div>
        <div className="call-from-list__type">
          {call?.status === CallStatus.Cancelled && t('callFromList.canceled')}

          {call?.status === CallStatus.Declined && t('callFromList.declined')}

          {call?.status === CallStatus.Ended &&
            call?.endDateTime &&
            (isOutgoing
              ? t('callFromList.outgoing', {
                  duration: moment
                    .utc(
                      new Date(call?.endDateTime).getTime() -
                        new Date(call?.startDateTime).getTime(),
                    )
                    .format('HH:mm:ss'),
                })
              : t('callFromList.incoming', {
                  duration: moment
                    .utc(
                      new Date(call?.endDateTime).getTime() -
                        new Date(call?.startDateTime).getTime(),
                    )
                    .format('HH:mm:ss'),
                }))}

          {call?.status === CallStatus.NotAnswered &&
            (isOutgoing ? t('callFromList.missed') : t('callFromList.notAnswered'))}
        </div>
      </div>
      <div className="call-from-list__aside-data">
        <div className="call-from-list__date">
          {moment.utc(call?.creationDateTime).local().format('l LT')}
        </div>
        <div
          className={`call-from-list__type-icon ${
            missedByMe ? 'call-from-list__type-icon--missed' : ''
          }`}>
          {call?.status === CallStatus.Ended &&
            (isOutgoing ? (
              <OutgoingCallSvg viewBox="0 0 11 12" />
            ) : (
              <IncomingCallSvg viewBox="0 0 12 12" />
            ))}
          {(call?.status === CallStatus.Declined || call?.status === CallStatus.Cancelled) && (
            <DeclinedCallSvg viewBox="0 0 13 14" />
          )}
          {(call?.status === CallStatus.NotAnswered || call?.status === CallStatus.Interrupted) && (
            <MissedCallSvg viewBox="0 0 12 12" />
          )}
        </div>
      </div>
    </div>
  );
};
CallItem.displayName = 'CallItem';

export { CallItem };
