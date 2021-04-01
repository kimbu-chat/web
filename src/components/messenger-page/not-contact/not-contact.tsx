import React, { useContext } from 'react';
import './not-contact.scss';

import { ReactComponent as ContactSvg } from '@icons/user-o.svg';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { LocalizationContext } from '@contexts';

export const NotContact = () => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className="not-contact">
      <ContactSvg className="not-contact__contact-icon" viewBox="0 0 24 24" />

      <div className="not-contact__description">
        {t('notContact.description', { fullName: 'Julie Key' })}
      </div>

      <div className="not-contact__btn-group">
        <button type="button" className="not-contact__btn not-contact__btn--add">
          {t('notContact.add')}
        </button>
        <button type="button" className="not-contact__btn not-contact__btn--block">
          {t('notContact.block')}
        </button>
        <button type="button" className="not-contact__close-btn">
          <CloseSvg viewBox="0 0 24 24" />
        </button>
      </div>
    </div>
  );
};
