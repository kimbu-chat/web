import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext, useState } from 'react';

import CheckedSvg from 'icons/checked.svg';
import UncheckedSvg from 'icons/unchecked.svg';
import DeleteSvg from 'icons/delete.svg';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import './delete-message-modal.scss';
import { DeleteMessage } from 'app/store/chats/features/delete-message/delete-message';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

export const DeleteMessageModal: React.FC<IDeleteMessageModalProps> = React.memo(({ onClose, selectedMessages }) => {
  const { t } = useContext(LocalizationContext);

  const deleteMessage = useActionWithDispatch(DeleteMessage.action);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const deleteTheseMessages = useCallback(() => {
    deleteMessage({ messageIds: selectedMessages, forEveryone: deleteForInterlocutor });
    onClose();
  }, [selectedMessages, deleteForInterlocutor]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <DeleteSvg viewBox='0 0 15 16' className='delete-message-modal__icon' />
            <span> {t('deleteMessageModal.title', { count: selectedMessages.length })} </span>
          </>
        }
        content={
          <div className='delete-message-modal'>
            <div className='delete-message-modal__delete-all'>
              <button type='button' className='delete-message-modal__btn' onClick={changeDeleteForInterlocutorState}>
                {deleteForInterlocutor ? <CheckedSvg /> : <UncheckedSvg />}
              </button>
              <span className='delete-message-modal__btn-description'>{t('deleteMessageModal.delete-confirmation')}</span>
            </div>
          </div>
        }
        closeModal={onClose}
        buttons={[
          <button key={1} type='button' onClick={onClose} className='delete-message-modal__cancel-btn'>
            {t('deleteMessageModal.cancel')}
          </button>,
          <button key={2} type='button' onClick={deleteTheseMessages} className='delete-message-modal__confirm-btn'>
            {t('deleteMessageModal.delete-confirm')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
