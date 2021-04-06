import { Avatar, Button } from '@components/shared';

import { useTranslation } from 'react-i18next';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { IUser } from '@store/common/models';
import { UnblockUser } from '@store/settings/features/unblock-user/unblock-user';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import React, { useCallback, useState } from 'react';
import './blocked-user.scss';

interface IBlockedUserProps {
  user: IUser;
}

export const BlockedUser: React.FC<IBlockedUserProps> = ({ user }) => {
  const { t } = useTranslation();

  const unblockUser = useActionWithDeferred(UnblockUser.action);

  const [isUnblocking, setIsUnblocking] = useState(false);

  const unblockThisUser = useCallback(() => {
    setIsUnblocking(true);
    unblockUser(user.id).then(() => {
      setIsUnblocking(false);
    });
  }, [user.id, unblockUser]);

  return (
    <div className="blocked-user">
      <Avatar className="blocked-user__avatar" src={user?.avatar?.previewUrl}>
        {getUserInitials(user)}
      </Avatar>

      <span className="blocked-user__name">{`${user.firstName} ${user.lastName}`}</span>

      <Button
        themed
        loading={isUnblocking}
        onClick={unblockThisUser}
        type="button"
        className="blocked-user__unblock">
        {t('blockedUser.unblock')}
      </Button>
    </div>
  );
};
