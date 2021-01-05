import React from 'react';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { IUserPreview, UserStatus } from 'app/store/models';

import { Avatar } from 'app/components';

import './status-badge.scss';

interface IStatusBadgeProps {
  user: IUserPreview;
  additionalClassNames?: string;
  containerClassName?: string;
}

export const StatusBadge: React.FC<IStatusBadgeProps> = React.memo(({ user, additionalClassNames, containerClassName }) => {
  if (user?.status === UserStatus.Online) {
    return (
      <div className={`status-badge ${containerClassName}`}>
        <span className='status-badge__indicator status-badge__indicator--online' />
        <Avatar className={additionalClassNames} src={user.avatar?.previewUrl}>
          {getUserInitials(user)}
        </Avatar>
      </div>
    );
  }
  return (
    <div className={`status-badge ${containerClassName}`}>
      <span className='status-badge__indicator status-badge__indicator--offline' />
      <Avatar className={additionalClassNames} src={user.avatar?.previewUrl}>
        {getUserInitials(user)}
      </Avatar>
    </div>
  );
});
