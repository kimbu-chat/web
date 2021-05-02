import { Button, Modal, WithBackground } from '@components/shared';
import React, { useCallback, useState } from 'react';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

import { useTranslation } from 'react-i18next';
import './remove-chat-modal.scss';
import { CheckBox } from '@components/messenger-page/settings-modal/shared/check-box/check-box';
import { removeChat } from '@store/chats/actions';

interface IRemoveChatModalProps {
  onClose: () => void;
}

export const RemoveChatModal: React.FC<IRemoveChatModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const removeThisChat = useActionWithDeferred(removeChat);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const deleteTheseMessages = useCallback(() => {
    setLoading(true);
    removeThisChat({ forEveryone: deleteForInterlocutor });
  }, [removeThisChat, deleteForInterlocutor, setLoading]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <DeleteSvg viewBox="0 0 15 16" className="remove-chat-modal__icon" />
            <span> {t('removeChatModal.title')} </span>
          </>
        }
        content={
          <div className="remove-chat-modal">
            <div className="remove-chat-modal__delete-all">
              <CheckBox
                className="remove-chat-modal__check-box"
                onClick={changeDeleteForInterlocutorState}
                isChecked={deleteForInterlocutor}
                title={t('removeChatModal.delete-confirmation')}
              />
            </div>
          </div>
        }
        closeModal={onClose}
        buttons={[
          <button key={1} type="button" onClick={onClose} className="remove-chat-modal__cancel-btn">
            {t('removeChatModal.cancel')}
          </button>,
          <Button
            key={2}
            type="button"
            loading={loading}
            onClick={deleteTheseMessages}
            className="remove-chat-modal__confirm-btn">
            {t('removeChatModal.delete-confirm')}
          </Button>,
        ]}
      />
    </WithBackground>
  );
};
