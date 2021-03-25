import { Modal, WithBackground } from '@components';
import React, { useCallback, useContext } from 'react';
import { LocalizationContext } from '@contexts';
import './logout-modal.scss';
import LogoutSvg from '@icons/logout.svg';

interface ILogoutModalProps {
  onClose: () => void;
}

export const LogoutModal: React.FC<ILogoutModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const logout = useCallback(() => window.location.replace('logout'), []);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <LogoutSvg viewBox='0 0 30 28' className='logout-modal__icon' />
            <span> {t('logoutModal.title')} </span>
          </>
        }
        closeModal={onClose}
        content={<div className='logout-modal__сontent'>{t('logoutModal.confirm-content')}</div>}
        buttons={[
          <button key={1} type='button' onClick={onClose} className='logout-modal__btn logout-modal__btn--cancel'>
            {t('logoutModal.cancel')}
          </button>,
          <button key={2} type='button' onClick={logout} className='logout-modal__btn logout-modal__btn--confirm'>
            {t('logoutModal.logout')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
