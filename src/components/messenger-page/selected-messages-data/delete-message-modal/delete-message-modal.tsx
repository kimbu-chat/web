import { Modal, WithBackground } from '@components/shared';
import React, { useCallback, useContext, useState } from 'react';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { LocalizationContext } from '@contexts';
import './delete-message-modal.scss';
import { DeleteMessage } from '@store/chats/features/delete-message/delete-message';
import { CheckBox } from '../../settings-modal/shared/check-box/check-box';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

export const DeleteMessageModal: React.FC<IDeleteMessageModalProps> = React.memo(
  ({ onClose, selectedMessages }) => {
    const { t } = useContext(LocalizationContext);

    const deleteMessage = useActionWithDispatch(DeleteMessage.action);

    const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
    const changeDeleteForInterlocutorState = useCallback(() => {
      setDeleteForInterlocutor((oldState) => !oldState);
    }, [setDeleteForInterlocutor]);

    const deleteTheseMessages = useCallback(() => {
      deleteMessage({ messageIds: selectedMessages, forEveryone: deleteForInterlocutor });
      onClose();
    }, [deleteMessage, selectedMessages, deleteForInterlocutor, onClose]);

    return (
      <WithBackground onBackgroundClick={onClose}>
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
            <button
              key={2}
              type="button"
              onClick={deleteTheseMessages}
              className="delete-message-modal__confirm-btn">
              {t('deleteMessageModal.delete-confirm')}
            </button>,
          ]}
        />
      </WithBackground>
    );
  },
);
