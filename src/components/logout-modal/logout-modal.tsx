import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { Button } from '@shared-components/button';
import './logout-modal.scss';
import { logoutAction } from '@store/auth/actions';


interface ILogoutModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'logout-modal';

const InitialLogoutModal: React.FC<ILogoutModalProps & IModalChildrenProps> = ({
  animatedClose,
}) => {
  const { t } = useTranslation();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutRequest = useActionWithDeferred(logoutAction);

  const logout = useCallback(async ()  => {
    setIsLoggingOut(true);
    await logoutRequest();
  }, [logoutRequest]);

  return (
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
            onClick={animatedClose}
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
  );
};

const LogoutModal: React.FC<ILogoutModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialLogoutModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

LogoutModal.displayName = 'LogoutModal';

export { LogoutModal };
