import React, { useContext } from 'react';
import moment from 'moment';

import './chat-member.scss';

import { UserPreview } from 'store/my-profile/models';
import { LocalizationContext } from 'app/app';
import { Avatar } from 'components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';

import DeleteSvg from 'icons/ic-delete.svg';
import { UserStatus } from 'app/store/common/models';

namespace MemberNS {
  export interface Props {
    member: UserPreview;
  }
}

export const Member = React.memo(({ member }: MemberNS.Props) => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className='chat-member'>
      <Avatar className='chat-member__avatar' src={member.avatar?.previewUrl}>
        {getUserInitials(member)}
      </Avatar>
      <div className='chat-member__data'>
        <h3 className='chat-member__name'>{`${member?.firstName} ${member?.lastName}`}</h3>

        {member?.status === UserStatus.Offline ? (
          <span className='chat-member__status chat-member__status--offline'>{t('chatData.online')}</span>
        ) : (
          <span className='chat-member__status chat-member__status--online'> {moment.utc(member?.lastOnlineTime).local().startOf('minute').fromNow()}</span>
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
