import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { CheckBox } from '@components/check-box';
import { Modal, IModalChildrenProps } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { Button } from '@shared-components/button';
import { deleteMessageAction } from '@store/chats/actions';

import './delete-message-modal.scss';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

const BLOCK_NAME = 'delete-message-modal';

export const InitialDeleteMessageModal: React.FC<IDeleteMessageModalProps & IModalChildrenProps> =
  ({ animatedClose, selectedMessages }) => {
    const { t } = useTranslation();

    const deleteMessage = useActionWithDeferred(deleteMessageAction);

    const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
    const [loading, setLoading] = useState(false);
    const changeDeleteForInterlocutorState = useCallback(() => {
      setDeleteForInterlocutor((oldState) => !oldState);
    }, [setDeleteForInterlocutor]);

    const deleteTheseMessages = useCallback(() => {
      setLoading(true);
      deleteMessage({ messageIds: selectedMessages, forEveryone: deleteForInterlocutor }).then(
        () => {
          setLoading(false);
          animatedClose();
        },
      );
    }, [deleteMessage, selectedMessages, deleteForInterlocutor, animatedClose, setLoading]);

    return (
      <>
        <Modal.Header>
          <>
            <DeleteSvg className={`${BLOCK_NAME}__icon`} />
            <span> {t('deleteMessageModal.title', { count: selectedMessages.length })} </span>
          </>
        </Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__delete-all`}>
            <CheckBox
              className={`${BLOCK_NAME}__check-box`}
              onClick={changeDeleteForInterlocutorState}
              isChecked={deleteForInterlocutor}
              title={t('deleteMessageModal.delete-confirmation')}
            />
          </div>
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button type="button" onClick={animatedClose} className={`${BLOCK_NAME}__cancel-btn`}>
              {t('deleteMessageModal.cancel')}
            </button>
            <Button
              type="button"
              loading={loading}
              onClick={deleteTheseMessages}
              className={`${BLOCK_NAME}__confirm-btn`}>
              {t('deleteMessageModal.delete-confirm')}
            </Button>
          </div>
        </div>
      </>
    );
  };

const DeleteMessageModal: React.FC<IDeleteMessageModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialDeleteMessageModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

DeleteMessageModal.displayName = 'DeleteMessageModal';

export { DeleteMessageModal };
