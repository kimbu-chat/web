import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { WithBackground } from '@components/with-background';
import { Modal } from '@components/modal';
import './logout-modal.scss';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';

interface ILogoutModalProps {
  onClose: () => void;
}

export const LogoutModal: React.FC<ILogoutModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const logout = useCallback(() => window.location.replace('logout'), []);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <LogoutSvg viewBox="0 0 30 28" className="logout-modal__icon" />
            <span> {t('logoutModal.title')} </span>
          </>
        }
        closeModal={onClose}
        content={<div className="logout-modal__сontent">{t('logoutModal.confirm-content')}</div>}
        buttons={[
          <button
            key={1}
            type="button"
            onClick={onClose}
            className="logout-modal__btn logout-modal__btn--cancel">
            {t('logoutModal.cancel')}
          </button>,
          <button
            key={2}
            type="button"
            onClick={logout}
            className="logout-modal__btn logout-modal__btn--confirm">
            {t('logoutModal.logout')}
          </button>,
        ]}
      />
    </WithBackground>
  );
};
