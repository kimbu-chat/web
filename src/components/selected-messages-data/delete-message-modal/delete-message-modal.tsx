import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { deleteMessageAction } from '@store/chats/actions';

import { CheckBox } from '../../check-box/check-box';

import './delete-message-modal.scss';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

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
    <Modal
      title={
        <>
          <DeleteSvg viewBox="0 0 15 16" className="delete-message-modal__icon" />
          <span> {t('deleteMessageModal.title', { count: selectedMessages.length })} </span>
        </>
      }
      content={
        <div className="delete-message-modal">
          <div className="delete-message-modal__delete-all">
            <CheckBox
              className="delete-message-modal__check-box"
              onClick={changeDeleteForInterlocutorState}
              isChecked={deleteForInterlocutor}
              title={t('deleteMessageModal.delete-confirmation')}
            />
          </div>
        </div>
      }
      closeModal={onClose}
      buttons={[
        <button
          key={1}
          type="button"
          onClick={onClose}
          className="delete-message-modal__cancel-btn">
          {t('deleteMessageModal.cancel')}
        </button>,
        <Button
          key={2}
          type="button"
          loading={loading}
          onClick={deleteTheseMessages}
          className="delete-message-modal__confirm-btn">
          {t('deleteMessageModal.delete-confirm')}
        </Button>,
      ]}
    />
  );
};
