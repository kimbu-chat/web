import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Modal } from '@components/modal';
import './logout-modal.scss';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { logoutAction } from '@store/auth/actions';

interface ILogoutModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'logout-modal';

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
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <LogoutSvg viewBox="0 0 30 28" className={`${BLOCK_NAME}__icon`} />
            <span> {t('logoutModal.title')} </span>
          </>
        </Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__сontent`}>{t('logoutModal.confirm-content')}</div>
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button
              type="button"
              onClick={onClose}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}>
              {t('logoutModal.cancel')}
            </button>
            <button
              type="button"
              onClick={logout}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
              {t('logoutModal.logout')}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};
