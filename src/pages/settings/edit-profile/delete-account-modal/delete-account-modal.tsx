import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import './delete-account-modal.scss';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { deleteAccountAction } from '@store/my-profile/actions';

interface IDeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<IDeleteAccountModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const deactivateAccount = useEmptyActionWithDeferred(deleteAccountAction);

  const [deleting, setDeleting] = useState(false);

  const submitDeleteing = useCallback(() => {
    setDeleting(true);
    deactivateAccount().then(() => {
      setDeleting(false);
    });
  }, [setDeleting, deactivateAccount]);

  return (
    <Modal
      title={
        <>
          <DeleteSvg viewBox="0 0 15 16" className="delete-account-modal__icon" />
          <span> {t('deleteAccountModal.title')} </span>
        </>
      }
      closeModal={onClose}
      content={
        <div className="delete-account-modal__сontent">
          {t('deleteAccountModal.confirm-content')}
        </div>
      }
      buttons={[
        <Button
          key={1}
          type="button"
          onClick={onClose}
          className="delete-account-modal__btn delete-account-modal__btn--cancel">
          {t('deleteAccountModal.cancel')}
        </Button>,
        <Button
          key={2}
          type="button"
          loading={deleting}
          onClick={submitDeleteing}
          className="delete-account-modal__btn delete-account-modal__btn--confirm">
          {t('deleteAccountModal.confirm')}
        </Button>,
      ]}
    />
  );
};
