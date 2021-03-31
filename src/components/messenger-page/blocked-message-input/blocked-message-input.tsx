import React, { useCallback, useContext } from 'react';
import BlockedSvg from '@icons/blocked.svg';
import './blocked-message-input.scss';
import { LocalizationContext } from '@contexts';
import { useActionWithDeferred } from '@app/hooks/use-action-with-deferred';
import { getSelectedInterlocutorIdSelector } from '@app/store/chats/selectors';
import { UnblockUser } from '@app/store/settings/features/unblock-user/unblock-user';
import { useSelector } from 'react-redux';

interface IBlockedMessageInputProps {
  isCurrentChatBlackListed?: boolean;
}

export const BlockedMessageInput: React.FC<IBlockedMessageInputProps> = ({ isCurrentChatBlackListed }) => {
  const { t } = useContext(LocalizationContext);

  const interlocutorId = useSelector(getSelectedInterlocutorIdSelector);

  const unBlockUser = useActionWithDeferred(UnblockUser.action);

  const unBlockSelectedUser = useCallback(() => {
    if (interlocutorId) {
      unBlockUser(interlocutorId);
    }
  }, [unBlockUser, interlocutorId]);

  return (
    <div className='blocked-message-input'>
      <BlockedSvg className='blocked-message-input__icon' viewBox='0 0 22 22' />
      <div className='blocked-message-input__description'>
        {isCurrentChatBlackListed ? t('blockedMessageInput.blocked-by-me') : t('blockedMessageInput.I-am-blocked')}
      </div>

      {isCurrentChatBlackListed && (
        <button onClick={unBlockSelectedUser} type='button' className='blocked-message-input__btn'>
          {t('blockedMessageInput.unblock')}
        </button>
      )}
    </div>
  );
};
