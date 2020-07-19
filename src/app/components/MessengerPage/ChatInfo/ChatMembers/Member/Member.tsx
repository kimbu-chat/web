import React from 'react';
import './_Member.scss';
import { UserPreview } from 'app/store/user/interfaces';
import { getUserInitials } from 'app/utils/get-interlocutor';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import { OnlineBadge, OfflineBadge } from 'app/utils/statusBadge';

namespace Member {
  export interface Props {
    member?: UserPreview;
  }
}

const Member = ({ member }: Member.Props) => {
  return (
    <div className="chat-members__member">
      {member?.status === 1 ? (
        <OnlineBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          variant="dot"
        >
          <Avatar src={member?.avatarUrl}>{member ? getUserInitials(member) : ''}</Avatar>
        </OnlineBadge>
      ) : (
        <OfflineBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          variant="dot"
        >
          <Avatar src={member?.avatarUrl}>{member ? getUserInitials(member) : ''}</Avatar>
        </OfflineBadge>
      )}
      <div className="chat-members__data">
        <h3>{`${member?.firstName} ${member?.lastName}`}</h3>
        <span>{member?.status === 1 ? 'Online' : moment.utc(member?.lastOnlineTime).startOf('hour').fromNow()}</span>
      </div>
    </div>
  );
};

export default Member;
