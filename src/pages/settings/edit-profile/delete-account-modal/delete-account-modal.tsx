import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { deleteAccountAction } from '@store/my-profile/actions';

import './delete-account-modal.scss';

interface IDeleteAccountModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'delete-account-modal';

export const DeleteAccountModal: React.FC<IDeleteAccountModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const deactivateAccount = useEmptyActionWithDeferred(deleteAccountAction);

  const [deleting, setDeleting] = useState(false);

  const submitDeleteing = useCallback(() => {
    setDeleting(true);
    deactivateAccount();
  }, [setDeleting, deactivateAccount]);

  return (
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <DeleteSvg viewBox="0 0 15 16" className={`${BLOCK_NAME}__icon`} />
            <span> {t('deleteAccountModal.title')} </span>
          </>
        </Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__сontent`}>{t('deleteAccountModal.confirm-content')}</div>

          <div className={`${BLOCK_NAME}__btn-block`}>
            <Button
              type="button"
              onClick={onClose}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}>
              {t('deleteAccountModal.cancel')}
            </Button>
            <Button
              type="button"
              loading={deleting}
              onClick={submitDeleteing}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
              {t('deleteAccountModal.confirm')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
