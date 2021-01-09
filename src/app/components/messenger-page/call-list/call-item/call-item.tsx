import { ICall } from 'store/calls/models';
import './call-item.scss';
import React, { useContext } from 'react';

import OutgoingCallSvg from 'icons/ic-outgoing-call.svg';
import { Avatar } from 'components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { LocalizationContext } from 'app/app';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { CallStatus } from 'app/store/models';

interface ICallItem {
  call: ICall;
}

export const CallItem: React.FC<ICallItem> = ({ call }) => {
  const { t } = useContext(LocalizationContext);

  const myId = useSelector(getMyIdSelector);

  return (
    <div className='call-from-list'>
      <div className='call-from-list__type-icon'>{call.status === CallStatus.Ended && myId === call.userCallerId && <OutgoingCallSvg />}</div>
      <Avatar className='call-from-list__interlocutor-avatar' src={call.userInterlocutor.avatar?.previewUrl}>
        {getUserInitials(call.userInterlocutor)}
      </Avatar>
      <div className='call-from-list__data'>
        <div className={`call-from-list__name ${call.status === CallStatus.NotAnswered && myId === call.userCallerId ? 'call-from-list__name--missed' : ''}`}>
          {`${call.userInterlocutor.firstName} ${call.userInterlocutor.lastName}`}
        </div>
        <div className='call-from-list__type'>
          {call.status === CallStatus.Cancelled && t('callFromList.canceled')}
          {call.status === CallStatus.Declined && t('callFromList.declined')}
          {call.status === CallStatus.Ended && myId !== call.userCallerId && t('callFromList.incoming')}
          {call.status === CallStatus.Ended && myId === call.userCallerId && t('callFromList.outgoing')}
          {call.status === CallStatus.NotAnswered && myId === call.userCallerId && t('callFromList.missed')}
          {call.status === CallStatus.NotAnswered && myId !== call.userCallerId && t('callFromList.notAnswered')}
        </div>
      </div>
      <div className='call-from-list__day'>{moment.utc(call.duration * 1000).format('HH:mm:ss')}</div>
    </div>
  );
};
