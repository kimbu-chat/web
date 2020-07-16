import React from 'react';
import './_ContactItem.scss';
import { UserPreview } from '../../../../store/contacts/types';
import { Avatar } from '@material-ui/core';
import { getUserInitials } from 'app/utils/get-interlocutor';
import { OnlineBadge, OfflineBadge } from 'app/utils/statusBadge';

namespace ContactItem {
  export interface Props {
    user: UserPreview;
  }
}

const ContactItem = ({ user }: ContactItem.Props) => {
  return (
    <div className="messenger__friend-item">
      {user?.status === 1 ? (
        <OnlineBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          variant="dot"
        >
          <Avatar className="messenger__friend-item__avatar" src={user.avatarUrl}>
            {getUserInitials(user)}
          </Avatar>
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
          <Avatar className="messenger__friend-item__avatar" src={user.avatarUrl}>
            {getUserInitials(user)}
          </Avatar>
        </OfflineBadge>
      )}
      <div className="messenger__friend-item__name">{`${user.firstName} ${user.lastName}`}</div>
    </div>
  );
};

export default ContactItem;
