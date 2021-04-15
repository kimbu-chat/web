import React, { useCallback, useState } from 'react';
import { ReactComponent as BlockedSvg } from '@icons/blocked.svg';
import './blocked-message-input.scss';

import { useTranslation } from 'react-i18next';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { getSelectedInterlocutorIdSelector } from '@store/chats/selectors';
import { UnblockUser } from '@store/settings/features/unblock-user/unblock-user';
import { useSelector } from 'react-redux';
import { Button } from '@components/shared';

interface IBlockedMessageInputProps {
  isCurrentChatBlackListed?: boolean;
  amIBlackListedByInterlocutor?: boolean;
  isCurrentChatUserDeactivated?: boolean;
}

export const BlockedMessageInput: React.FC<IBlockedMessageInputProps> = ({
  isCurrentChatBlackListed,
  amIBlackListedByInterlocutor,
  isCurrentChatUserDeactivated,
}) => {
  const { t } = useTranslation();

  const interlocutorId = useSelector(getSelectedInterlocutorIdSelector);

  const [unBlocking, setUnBlocking] = useState(false);

  const unBlockUser = useActionWithDeferred(UnblockUser.action);

  const unBlockSelectedUser = useCallback(() => {
    setUnBlocking(true);
    if (interlocutorId) {
      unBlockUser(interlocutorId).then(() => {
        setUnBlocking(false);
      });
    }
  }, [unBlockUser, interlocutorId]);

  return (
    <div className="blocked-message-input">
      <BlockedSvg className="blocked-message-input__icon" viewBox="0 0 22 22" />
      <div className="blocked-message-input__description">
        {isCurrentChatBlackListed && t('blockedMessageInput.blocked-by-me')}
        {!isCurrentChatBlackListed &&
          amIBlackListedByInterlocutor &&
          t('blockedMessageInput.I-am-blocked')}
        {!(isCurrentChatBlackListed || amIBlackListedByInterlocutor) &&
          isCurrentChatUserDeactivated &&
          t('blockedMessageInput.user-deactivated')}
      </div>

      {isCurrentChatBlackListed && (
        <Button
          loading={unBlocking}
          onClick={unBlockSelectedUser}
          type="button"
          className="blocked-message-input__btn">
          {t('blockedMessageInput.unblock')}
        </Button>
      )}
    </div>
  );
};
