import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { Button } from '@shared-components/button';
import { logoutAction } from '@store/auth/actions';

import './logout-modal.scss';

interface ILogoutModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'logout-modal';

export const LogoutModal: React.FC<ILogoutModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutRequest = useEmptyActionWithDeferred(logoutAction);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    logoutRequest();
  }, [logoutRequest]);

  return (
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <LogoutSvg className={`${BLOCK_NAME}__icon`} />
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
            <Button
              loading={isLoggingOut}
              type="button"
              onClick={logout}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
              {t('logoutModal.logout')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
