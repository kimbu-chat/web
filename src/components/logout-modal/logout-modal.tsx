import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { WithBackground } from '@components/with-background';
import { Modal } from '@components/modal';
import './logout-modal.scss';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { logoutAction } from '@store/auth/actions';

interface ILogoutModalProps {
  onClose: () => void;
}

export const LogoutModal: React.FC<ILogoutModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const logoutRequest = useEmptyActionWithDeferred(logoutAction);

  const logout = useCallback(
    () =>
      logoutRequest().then(() => {
        window.location.replace('login');
      }),
    [logoutRequest],
  );

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
