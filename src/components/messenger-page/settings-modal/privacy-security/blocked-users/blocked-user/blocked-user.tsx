import { Avatar } from '@components/shared';
import { LocalizationContext } from '@contexts';
import { IUser } from '@store/common/models';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import React, { useContext } from 'react';
import './blocked-user.scss';

interface IBlockedUserProps {
  user: IUser;
}

export const BlockedUser: React.FC<IBlockedUserProps> = ({ user }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className="blocked-user">
      <Avatar className="blocked-user__avatar" src={user?.avatar?.previewUrl}>
        {getUserInitials(user)}
      </Avatar>

      <span className="blocked-user__name">{`${user.firstName} ${user.lastName}`}</span>

      <button type="button" className="blocked-user__unblock">
        {t('blockedUser.unblock')}
      </button>
    </div>
  );
};
