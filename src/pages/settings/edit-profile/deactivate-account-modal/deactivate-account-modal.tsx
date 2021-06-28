import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import './deactivate-account-modal.scss';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { deactivateAccountAction } from '@store/my-profile/actions';

interface IDeactivateAccountModalProps {
  onClose: () => void;
}

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
    <Modal
      title={
        <>
          <DeleteSvg viewBox="0 0 15 16" className="deactivate-account-modal__icon" />
          <span> {t('deactivateAccountModal.title')} </span>
        </>
      }
      closeModal={onClose}
      content={
        <div className="deactivate-account-modal__сontent">
          {t('deactivateAccountModal.confirm-content')}
        </div>
      }
      buttons={[
        <Button
          key={1}
          type="button"
          onClick={onClose}
          className="deactivate-account-modal__btn deactivate-account-modal__btn--cancel">
          {t('deactivateAccountModal.cancel')}
        </Button>,
        <Button
          key={2}
          type="button"
          loading={deactivating}
          onClick={submitDeactivating}
          className="deactivate-account-modal__btn deactivate-account-modal__btn--confirm">
          {t('deactivateAccountModal.confirm')}
        </Button>,
      ]}
    />
  );
};
