import React, { useCallback } from 'react';

import classnames from 'classnames';
import dayjs from 'dayjs';
import { CallStatus } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { getCallSelector } from '@store/calls/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import { FULL_DATE_TIME } from '@utils/constants';
import { getHourMinuteSecond } from '@utils/date-utils';
import { getUserName } from '@utils/user-utils';

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

  const getCallCreationDateTime = useCallback(
    (creationDateTime: string) => dayjs.utc(creationDateTime).local().format(FULL_DATE_TIME),
    [],
  );

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
                  duration: getHourMinuteSecond(
                    new Date(call?.endDateTime).getTime() - new Date(call?.startDateTime).getTime(),
                  ),
                })
              : t('callFromList.incoming', {
                  duration: getHourMinuteSecond(
                    new Date(call?.endDateTime).getTime() - new Date(call?.startDateTime).getTime(),
                  ),
                }))}

          {call?.status === CallStatus.NotAnswered &&
            (isOutgoing ? t('callFromList.missed') : t('callFromList.notAnswered'))}
        </div>
      </div>
      <div className={`${BLOCK_NAME}__aside-data`}>
        <div className={`${BLOCK_NAME}__date`}>
          {getCallCreationDateTime(call?.creationDateTime)}
        </div>
        <div
          className={classnames(`${BLOCK_NAME}__type-icon`, {
            [`${BLOCK_NAME}__type-icon--missed`]: missedByMe,
          })}>
          {call?.status === CallStatus.Ended &&
            (isOutgoing ? <OutgoingCallSvg /> : <IncomingCallSvg />)}
          {(call?.status === CallStatus.Declined || call?.status === CallStatus.Cancelled) && (
            <DeclinedCallSvg />
          )}
          {(call?.status === CallStatus.NotAnswered || call?.status === CallStatus.Interrupted) && (
            <MissedCallSvg />
          )}
        </div>
      </div>
    </div>
  );
};
CallItem.displayName = 'CallItem';

export { CallItem };
