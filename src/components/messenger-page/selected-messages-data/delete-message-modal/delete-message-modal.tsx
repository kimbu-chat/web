import { Button, Modal, WithBackground } from '@components/shared';
import React, { useCallback, useState } from 'react';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

import { useTranslation } from 'react-i18next';
import './delete-message-modal.scss';
import { DeleteMessage } from '@store/chats/features/delete-message/delete-message';
import { deleteMessageAction } from '@store/chats/actions';
import { CheckBox } from '../../settings-modal/shared/check-box/check-box';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

export const DeleteMessageModal: React.FC<IDeleteMessageModalProps> = React.memo(
  ({ onClose, selectedMessages }) => {
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
          onClose();
        },
      );
    }, [deleteMessage, selectedMessages, deleteForInterlocutor, onClose, setLoading]);

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
      </WithBackground>
    );
  },
);
