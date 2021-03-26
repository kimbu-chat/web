import React, { useContext } from 'react';
import './message-error.scss';
import BulbSvg from '@icons/bulb.svg';
import { LocalizationContext } from '@contexts';

export const MessageError = () => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className="message-error">
      <div className="message-error__icon">
        <BulbSvg viewBox="0 0 24 24" />
      </div>
      <div className="message-error__description">{t('messageError.description')}</div>

      <div className="message-error__btn-group">
        <button type="button" className="message-error__btn message-error__btn--retry">
          {t('messageError.retry')}
        </button>

        <div className="message-error__btn-separator" />

        <button type="button" className="message-error__btn message-error__btn--dismiss">
          {t('messageError.dismiss')}
        </button>
      </div>
    </div>
  );
};
