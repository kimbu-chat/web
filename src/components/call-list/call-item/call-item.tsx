import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';
import { myIdSelector } from '@store/my-profile/selectors';
import { Avatar } from '@components/avatar';
import { getUserName } from '@utils/user-utils';
import { getUserSelector } from '@store/users/selectors';
import { getCallSelector } from '@store/calls/selectors';
import { CallStatus } from '@store/common/models/call-status';

import './call-item.scss';

interface ICallItemProps {
  callId: number;
}

const BLOCK_NAME = 'call-from-list';

const CallItem: React.FC<ICallItemProps> = ({ callId }) => {
  const { t } = useTranslation();

  const call = useSelector(getCallSelector(callId));
  const userInterlocutor = useSelector(getUserSelector(call?.userInterlocutorId));

  const myId = useSelector(myIdSelector);

  const isOutgoing = myId === call?.userCallerId;
  const missedByMe = !isOutgoing && call?.status === CallStatus.NotAnswered;

  return (
    <div className={BLOCK_NAME}>
      <Avatar className={`${BLOCK_NAME}__interlocutor-avatar`} size={48} user={userInterlocutor} />

      <div className={`${BLOCK_NAME}__data`}>
        <div
          className={classnames(`${BLOCK_NAME}__name`, {
            [`${BLOCK_NAME}__name--missed`]: missedByMe,
          })}>
          {userInterlocutor && getUserName(userInterlocutor, t)}
        </div>
        <div className={`${BLOCK_NAME}__type`}>
          {call?.status === CallStatus.Cancelled && t('callFromList.canceled')}

          {call?.status === CallStatus.Declined && t('callFromList.declined')}

          {call?.status === CallStatus.Ended &&
            call?.endDateTime &&
            (isOutgoing
              ? t('callFromList.outgoing', {
                  duration: dayjs
                    .utc(
                      new Date(call?.endDateTime).getTime() -
                        new Date(call?.startDateTime).getTime(),
                    )
                    .format('HH:mm:ss'),
                })
              : t('callFromList.incoming', {
                  duration: dayjs
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
      <div className={`${BLOCK_NAME}__aside-data`}>
        <div className={`${BLOCK_NAME}__date`}>
          {dayjs.utc(call?.creationDateTime).local().format('l LT')}
        </div>
        <div
          className={classnames(`${BLOCK_NAME}__type-icon`, {
            [`${BLOCK_NAME}__type-icon--missed`]: missedByMe,
          })}>
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
