import React from 'react';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { IUserPreview } from 'store/my-profile/models';
import { UserStatus } from 'app/store/common/models';
import { Avatar } from 'app/components';

import './status-badge.scss';

namespace StatusBadgeNS {
  export interface IProps {
    user: IUserPreview;
    additionalClassNames?: string;
    containerClassName?: string;
  }
}

export const StatusBadge = React.memo(({ user, additionalClassNames, containerClassName }: StatusBadgeNS.IProps) => {
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
