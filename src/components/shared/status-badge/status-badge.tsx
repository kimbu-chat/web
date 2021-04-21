import React from 'react';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import { IUser } from '@store/common/models';

import { Avatar } from '@components/shared';

import './status-badge.scss';

interface IStatusBadgeProps {
  user: IUser;
  additionalClassNames?: string;
  containerClassName?: string;
}

export const StatusBadge: React.FC<IStatusBadgeProps> = ({
  user,
  additionalClassNames,
  containerClassName,
}) => (
  <div className={`status-badge ${containerClassName}`}>
    <span
      className={`status-badge__indicator ${
        user?.online ? 'status-badge__indicator--online' : 'status-badge__indicator--offline'
      }`}
    />

    <Avatar className={additionalClassNames} src={user.avatar?.previewUrl}>
      {getUserInitials(user)}
    </Avatar>
  </div>
);
