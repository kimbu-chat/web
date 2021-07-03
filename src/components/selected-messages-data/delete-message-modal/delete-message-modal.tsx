import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Button } from '@components/button';
import { CheckBox } from '@components/check-box';
import { Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { deleteMessageAction } from '@store/chats/actions';

import './delete-message-modal.scss';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

const BLOCK_NAME = 'delete-message-modal';

export const DeleteMessageModal: React.FC<IDeleteMessageModalProps> = ({
  onClose,
  selectedMessages,
}) => {
  const { t } = useTranslation();

  const deleteMessage = useActionWithDeferred(deleteMessageAction);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const deleteTheseMessages = useCallback(() => {
    setLoading(true);
    deleteMessage({ messageIds: selectedMessages, forEveryone: deleteForInterlocutor }).then(() => {
      setLoading(false);
      onClose();
    });
  }, [deleteMessage, selectedMessages, deleteForInterlocutor, onClose, setLoading]);

  return (
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <DeleteSvg viewBox="0 0 15 16" className="delete-message-modal__icon" />
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
            <button type="button" onClick={onClose} className={`${BLOCK_NAME}__cancel-btn`}>
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
    </Modal>
  );
};
