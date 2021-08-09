import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { Button } from '@shared-components/button';
import { deactivateAccountAction } from '@store/my-profile/actions';

import './deactivate-account-modal.scss';

interface IDeactivateAccountModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'deactivate-account-modal';

export const DeactivateAccountModal: React.FC<IDeactivateAccountModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const deactivateAccount = useEmptyActionWithDeferred(deactivateAccountAction);

  const [deactivating, setDeactivating] = useState(false);

  const submitDeactivating = useCallback(() => {
    setDeactivating(true);
    deactivateAccount();
  }, [setDeactivating, deactivateAccount]);

  return (
    <Modal closeModal={onClose}>
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
              onClick={onClose}
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
    </Modal>
  );
};
