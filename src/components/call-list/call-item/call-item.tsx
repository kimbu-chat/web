import React, { useCallback, useState } from 'react';

import classnames from 'classnames';
import { CallStatus } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CallSvg } from '@icons/call.svg';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as DeleteSVG } from '@icons/delete.svg';
import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { deleteCallAction, outgoingCallAction } from '@store/calls/actions';
import { getCallSelector } from '@store/calls/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import { checkIfDatesAreDifferentDate, getHourMinuteSecond, getShortTimeAmPm, getDayMonthYear } from '@utils/date-utils';
import { stopPropagation } from '@utils/stop-propagation';
import { getUserName } from '@utils/user-utils';

import './call-item.scss';

interface ICallItemProps {
  callId: number;
}

const BLOCK_NAME = 'call-from-list';

const CallItem: React.FC<ICallItemProps> = ({ callId }) => {
  const { t } = useTranslation();

  const call = useSelector(getCallSelector(callId));
  const callInterlocutor = useActionWithDispatch(outgoingCallAction);
  const deleteCall = useActionWithDeferred(deleteCallAction);
  const userInterlocutor = useSelector(getUserSelector(call?.userInterlocutorId));

  const myId = useSelector(myIdSelector);

  const [isVisibleActions, setIsVisibleActions] = useState(false);
  const showActions = useCallback(() => setIsVisibleActions(true), []);
  const hideActions = useCallback(() => setIsVisibleActions(false), []);

  const isOutgoing = myId === call?.userCallerId;
  const missedByMe = !isOutgoing && call?.status === CallStatus.NotAnswered;

  const makeCall = useCallback(() => {
    callInterlocutor({
      callingUserId: call?.userInterlocutorId,
      constraints: {
        videoEnabled: true,
        audioEnabled: true,
      },
    });
  }, [call?.userInterlocutorId, callInterlocutor]);

  const deleteThisCall = useCallback(
    (e: React.MouseEvent) => {
      stopPropagation(e);
      deleteCall({ id: call.id });
    },
    [deleteCall, call.id],
  );

  return (
    <div className={BLOCK_NAME} onMouseEnter={showActions} onMouseLeave={hideActions}>
      <Avatar className={`${BLOCK_NAME}__interlocutor-avatar`} size={48} user={userInterlocutor} />

      <div className={`${BLOCK_NAME}__data`}>
        <div
          className={classnames(`${BLOCK_NAME}__name`, {
            [`${BLOCK_NAME}__name--missed`]: missedByMe,
          })}>
          {userInterlocutor && getUserName(userInterlocutor, t)}
        </div>
        <div className={`${BLOCK_NAME}__info`}>
          <div
            className={classnames(`${BLOCK_NAME}__type-icon`, {
              [`${BLOCK_NAME}__type-icon--missed`]: missedByMe,
            })}>
            {call?.status === CallStatus.Ended && (isOutgoing ? <OutgoingCallSvg /> : <IncomingCallSvg />)}
            {(call?.status === CallStatus.Declined || call?.status === CallStatus.Cancelled) && <DeclinedCallSvg />}
            {(call?.status === CallStatus.NotAnswered || call?.status === CallStatus.Interrupted) && <MissedCallSvg />}
          </div>
          <div className={`${BLOCK_NAME}__type`}>
            {call?.status === CallStatus.Cancelled && t('callFromList.canceled')}

            {call?.status === CallStatus.Declined && t('callFromList.declined')}

            {call?.status === CallStatus.Ended &&
              call?.endDateTime &&
              (isOutgoing
                ? t('callFromList.outgoing', {
                    duration: getHourMinuteSecond(new Date(call?.endDateTime).getTime() - new Date(call?.startDateTime).getTime()),
                  })
                : t('callFromList.incoming', {
                    duration: getHourMinuteSecond(new Date(call?.endDateTime).getTime() - new Date(call?.startDateTime).getTime()),
                  }))}

            {call?.status === CallStatus.NotAnswered && (isOutgoing ? t('callFromList.missed') : t('callFromList.notAnswered'))}
          </div>
        </div>
      </div>
      {isVisibleActions ? (
        <div className={`${BLOCK_NAME}__actions`}>
          <CallSvg className={classnames(`${BLOCK_NAME}__actions-action`, `${BLOCK_NAME}__actions-action-call`)} onClick={makeCall} />
          <DeleteSVG className={classnames(`${BLOCK_NAME}__actions-action`, `${BLOCK_NAME}__actions-action-delete`)} onClick={deleteThisCall} />
        </div>
      ) : (
        <div className={`${BLOCK_NAME}__date`}>
          {checkIfDatesAreDifferentDate(new Date(call?.creationDateTime), new Date())
            ? getDayMonthYear(call?.creationDateTime)
            : getShortTimeAmPm(call?.creationDateTime).toLowerCase()}
        </div>
      )}
    </div>
  );
};
CallItem.displayName = 'CallItem';

export { CallItem };
