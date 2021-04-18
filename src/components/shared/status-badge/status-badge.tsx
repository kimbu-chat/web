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

export const StatusBadge: React.FC<IStatusBadgeProps> = React.memo(
  ({ user, additionalClassNames, containerClassName }) => (
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
  ),
  (prevProps, nextProps) =>
    prevProps.additionalClassNames === nextProps.additionalClassNames &&
    prevProps.containerClassName === nextProps.containerClassName &&
    prevProps.user.avatar?.id === nextProps.user.avatar?.id &&
    prevProps.user.firstName === nextProps.user.firstName &&
    prevProps.user.lastName === nextProps.user.lastName &&
    prevProps.user.online === nextProps.user.online,
);
