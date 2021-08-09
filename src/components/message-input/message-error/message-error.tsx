import React from 'react';

import { useTranslation } from 'react-i18next';

import { ReactComponent as BulbSvg } from '@icons/bulb.svg';

import './message-error.scss';

export const MessageError = () => {
  const { t } = useTranslation();

  return (
    <div className="message-error">
      <div className="message-error__icon">
        <BulbSvg />
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
