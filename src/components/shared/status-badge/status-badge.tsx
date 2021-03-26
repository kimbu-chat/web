import React from 'react';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import { IUser, UserStatus } from '@store/common/models';

import { Avatar } from '@components';

import './status-badge.scss';

interface IStatusBadgeProps {
  user: IUser;
  additionalClassNames?: string;
  containerClassName?: string;
}

export const StatusBadge: React.FC<IStatusBadgeProps> = React.memo(
  ({ user, additionalClassNames, containerClassName }) => (
    <div className={`status-badge ${containerClassName}`}>
      <span
        className={`status-badge__indicator ${
          user?.status === UserStatus.Online
            ? 'status-badge__indicator--online'
            : 'status-badge__indicator--offline'
        }`}
      />

      <Avatar className={additionalClassNames} src={user.avatar?.previewUrl}>
        {getUserInitials(user)}
      </Avatar>
    </div>
  ),
);
