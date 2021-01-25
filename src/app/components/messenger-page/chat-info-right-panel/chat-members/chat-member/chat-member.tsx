import React, { useContext } from 'react';

import './chat-member.scss';

import { IUserPreview, UserStatus } from 'app/store/models';
import { LocalizationContext } from 'app/app';

import DeleteSvg from 'icons/ic-delete.svg';
import { TimeUpdateable } from 'app/components/shared/time-updateable/time-updateable';
import { StatusBadge } from 'app/components/shared';

interface IMemberProps {
  member: IUserPreview;
}

export const Member: React.FC<IMemberProps> = React.memo(({ member }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className='chat-member'>
      <StatusBadge additionalClassNames='chat-member__avatar' user={member} />

      <div className='chat-member__data'>
        <h3 className='chat-member__name'>{`${member?.firstName} ${member?.lastName}`}</h3>

        {member?.status === UserStatus.Offline ? (
          <span className='chat-member__status'>{t('chatData.online')}</span>
        ) : (
          <span className='chat-member__status'>
            <TimeUpdateable timeStamp={member?.lastOnlineTime} />
          </span>
        )}
      </div>
      <h3 className='chat-member__groupChat-status'>
        {member.firstName.includes('77') ? (
          'Owner'
        ) : (
          <button type='button' className='chat-member__delete-user'>
            <DeleteSvg viewBox='0 0 25 25' />
          </button>
        )}
      </h3>
    </div>
  );
});
