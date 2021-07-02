import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import './deactivate-account-modal.scss';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { deactivateAccountAction } from '@store/my-profile/actions';

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
    deactivateAccount().then(() => {
      setDeactivating(false);
    });
  }, [setDeactivating, deactivateAccount]);

  return (
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <DeleteSvg viewBox="0 0 15 16" className={`${BLOCK_NAME}__icon`} />
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
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}--confirm`)}>
              {t('deactivateAccountModal.confirm')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
