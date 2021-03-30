import { Modal, WithBackground } from '@components/shared';
import React, { useContext } from 'react';
import { LocalizationContext } from '@contexts';
import './delete-account-modal.scss';
import DeleteSvg from '@icons/delete.svg';

interface IDeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<IDeleteAccountModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <WithBackground onBackgroundClick={onClose}>
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
          <button
            key={1}
            type="button"
            onClick={onClose}
            className="delete-account-modal__btn delete-account-modal__btn--cancel">
            {t('deleteAccountModal.cancel')}
          </button>,
          <button
            key={2}
            type="button"
            className="delete-account-modal__btn delete-account-modal__btn--confirm">
            {t('deleteAccountModal.confirm')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
