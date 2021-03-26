import React, { useContext } from 'react';
import BlockedSvg from '@icons/blocked.svg';
import './blocked-message-input.scss';
import { LocalizationContext } from '@contexts';

export const BlockedMessageInput = () => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className="blocked-message-input">
      <BlockedSvg className="blocked-message-input__icon" viewBox="0 0 22 22" />
      <div className="blocked-message-input__description">
        {t('blockedMessageInput.description')}
      </div>
      <button type="button" className="blocked-message-input__btn">
        {t('blockedMessageInput.unblock')}
      </button>
    </div>
  );
};
