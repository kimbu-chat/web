import { Avatar } from '@components/shared';
import { LocalizationContext } from '@contexts';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { IUser } from '@store/common/models';
import { UnblockUser } from '@store/settings/features/unblock-user/unblock-user';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import React, { useCallback, useContext } from 'react';
import './blocked-user.scss';

interface IBlockedUserProps {
  user: IUser;
}

export const BlockedUser: React.FC<IBlockedUserProps> = ({ user }) => {
  const { t } = useContext(LocalizationContext);

  const unblockUser = useActionWithDeferred(UnblockUser.action);

  const unblockThisUser = useCallback(() => {
    unblockUser(user.id);
  }, [user.id]);

  return (
    <div className="blocked-user">
      <Avatar className="blocked-user__avatar" src={user?.avatar?.previewUrl}>
        {getUserInitials(user)}
      </Avatar>

      <span className="blocked-user__name">{`${user.firstName} ${user.lastName}`}</span>

      <button onClick={unblockThisUser} type="button" className="blocked-user__unblock">
        {t('blockedUser.unblock')}
      </button>
    </div>
  );
};
