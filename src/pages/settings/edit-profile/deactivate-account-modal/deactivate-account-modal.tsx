import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { Button } from '@shared-components/button';
import { deactivateAccountAction } from '@store/my-profile/actions';

import './deactivate-account-modal.scss';

interface IDeactivateAccountModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'deactivate-account-modal';

export const InitialDeactivateAccountModal: React.FC<IModalChildrenProps> = ({ animatedClose }) => {
  const { t } = useTranslation();

  const deactivateAccount = useActionWithDeferred(deactivateAccountAction);

  const [deactivating, setDeactivating] = useState(false);

  const submitDeactivating = useCallback(() => {
    setDeactivating(true);
    deactivateAccount();
  }, [setDeactivating, deactivateAccount]);

  return (
    <>
      <Modal.Header>
        <>
          <DeleteSvg className={`${BLOCK_NAME}__icon`} />
          <span> {t('deactivateAccountModal.title')} </span>
        </>
      </Modal.Header>
      <div className={`${BLOCK_NAME}`}>
        <div className={`${BLOCK_NAME}__сontent`}>
          {t('deactivateAccountModal.confirm-content')}
        </div>

        <div className={`${BLOCK_NAME}__btn-block`}>
          <Button
            type="button"
            onClick={animatedClose}
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}--cancel`)}>
            {t('deactivateAccountModal.cancel')}
          </Button>
          <Button
            type="button"
            loading={deactivating}
            onClick={submitDeactivating}
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
            {t('deactivateAccountModal.confirm')}
          </Button>
        </div>
      </div>
    </>
  );
};

const DeactivateAccountModal: React.FC<IDeactivateAccountModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialDeactivateAccountModal {...props} animatedClose={animatedClose} />
    )}
  </Modal>
);

DeactivateAccountModal.displayName = 'DeactivateAccountModal';

export { DeactivateAccountModal };
