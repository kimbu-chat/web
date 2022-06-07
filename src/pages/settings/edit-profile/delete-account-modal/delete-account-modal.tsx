import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { Button } from '@shared-components/button';
import { deleteAccountAction } from '@store/my-profile/actions';
import './delete-account-modal.scss';

interface IDeleteAccountModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'delete-account-modal';

export const InitialDeleteAccountModal: React.FC<IDeleteAccountModalProps & IModalChildrenProps> =
  ({ animatedClose }) => {
    const { t } = useTranslation();

    const deactivateAccount = useActionWithDeferred(deleteAccountAction);

    const [deleting, setDeleting] = useState(false);

    const submitDeleteing = useCallback(() => {
      setDeleting(true);
      deactivateAccount();
    }, [setDeleting, deactivateAccount]);

    return (
      <>
        <Modal.Header>
          <>
            <DeleteSvg className={`${BLOCK_NAME}__icon`} />
            <span> {t('deleteAccountModal.title')} </span>
          </>
        </Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__сontent`}>{t('deleteAccountModal.confirm-content')}</div>

          <div className={`${BLOCK_NAME}__btn-block`}>
            <Button
              type='button'
              onClick={animatedClose}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}>
              {t('deleteAccountModal.cancel')}
            </Button>
            <Button
              type='button'
              loading={deleting}
              onClick={submitDeleteing}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
              {t('deleteAccountModal.confirm')}
            </Button>
          </div>
        </div>
      </>
    );
  };

const DeleteAccountModal: React.FC<IDeleteAccountModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialDeleteAccountModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

DeleteAccountModal.displayName = 'DeleteAccountModal';

export { DeleteAccountModal };
