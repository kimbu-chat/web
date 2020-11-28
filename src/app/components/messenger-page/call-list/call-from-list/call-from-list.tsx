import { Call, CallStatus } from 'store/calls/models';
import './call-from-list.scss';
import React, { useContext } from 'react';

import OutgoingCallSvg from 'icons/ic-outgoing-call.svg';
import { Avatar } from 'components';
import { getUserInitials } from 'utils/functions/interlocutor-name-utils';
import { LocalizationContext } from 'app/app';
import moment from 'moment';

namespace CallFromListNS {
  export interface Props {
    call: Call;
  }
}

export const CallFromList: React.FC<CallFromListNS.Props> = ({ call }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className='call-from-list'>
      <div className='call-from-list__type-icon'>{call.status === CallStatus.Successfull && <OutgoingCallSvg />}</div>
      <Avatar className='call-from-list__interlocutor-avatar' src={call.userInterlocutor.avatar?.previewUrl}>
        {getUserInitials(call.userInterlocutor)}
      </Avatar>
      <div className='call-from-list__data'>
        <div className={`call-from-list__name ${call.status === CallStatus.Missed ? 'call-from-list__name--missed' : ''}`}>
          {`${call.userInterlocutor.firstName} ${call.userInterlocutor.lastName}`}
        </div>
        <div className='call-from-list__type'>
          {call.status === CallStatus.Cancelled && t('callFromList.canceled')}
          {call.status === CallStatus.Declined && t('callFromList.declined')}
          {call.status === CallStatus.Successfull && t('callFromList.incoming')}
          {call.status === CallStatus.Successfull && t('callFromList.outgoing')}
          {call.status === CallStatus.Missed && t('callFromList.missed')}
          {call.status === CallStatus.NotAnswered && t('callFromList.notAnswered')}
        </div>
      </div>
      <div className='call-from-list__day'>{moment(call.callDateTime).format('DD.MM.YYYY')}</div>
    </div>
  );
};
