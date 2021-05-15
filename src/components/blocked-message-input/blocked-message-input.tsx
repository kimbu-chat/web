import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ReactComponent as BlockedSvg } from '@icons/blocked.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { getSelectedInterlocutorIdSelector } from '@store/chats/selectors';
import { Button } from '@components/button';
import { unblockUserAction } from '@store/settings/actions';

import './blocked-message-input.scss';

interface IBlockedMessageInputProps {
  isCurrentChatBlackListed?: boolean;
  amIBlackListedByInterlocutor?: boolean;
  isCurrentChatUserDeactivated?: boolean;
  isCurrentChatUserDeleted?: boolean;
}

export const BlockedMessageInput: React.FC<IBlockedMessageInputProps> = ({
  isCurrentChatBlackListed,
  amIBlackListedByInterlocutor,
  isCurrentChatUserDeactivated,
  isCurrentChatUserDeleted,
}) => {
  const { t } = useTranslation();

  const interlocutorId = useSelector(getSelectedInterlocutorIdSelector);

  const [unBlocking, setUnBlocking] = useState(false);

  const unBlockUser = useActionWithDeferred(unblockUserAction);

  const unBlockSelectedUser = useCallback(() => {
    setUnBlocking(true);
    if (interlocutorId) {
      unBlockUser(interlocutorId).then(() => {
        setUnBlocking(false);
      });
    }
  }, [unBlockUser, interlocutorId]);

  const text = useMemo(() => {
    let processedText = '';

    if (isCurrentChatBlackListed) {
      processedText = t('blockedMessageInput.blocked-by-me');
    }

    if (amIBlackListedByInterlocutor) {
      processedText = t('blockedMessageInput.I-am-blocked');
    }

    if (isCurrentChatUserDeactivated) {
      processedText = t('blockedMessageInput.user-deactivated');
    }

    if (isCurrentChatUserDeleted) {
      processedText = t('blockedMessageInput.user-deleted');
    }

    return processedText;
  }, [
    isCurrentChatBlackListed,
    amIBlackListedByInterlocutor,
    isCurrentChatUserDeactivated,
    isCurrentChatUserDeleted,
    t,
  ]);

  return (
    <div className="blocked-message-input">
      <BlockedSvg className="blocked-message-input__icon" viewBox="0 0 22 22" />
      <div className="blocked-message-input__description">{text}</div>

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
