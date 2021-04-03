import { Modal, WithBackground } from '@components/shared';
import React from 'react';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import './delete-account-modal.scss';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';

interface IDeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<IDeleteAccountModalProps> = React.memo(({ onClose }) => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

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
