import React from 'react';
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
    {user.deleted ? (
      <Avatar className={additionalClassNames} user={user} />
    ) : (
      <>
        <span
          className={`status-badge__indicator ${
            user?.online ? 'status-badge__indicator--online' : 'status-badge__indicator--offline'
          }`}
        />

        <Avatar className={additionalClassNames} user={user} />
      </>
    )}
  </div>
);
