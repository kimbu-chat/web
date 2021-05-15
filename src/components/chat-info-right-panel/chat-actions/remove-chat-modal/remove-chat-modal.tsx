import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { WithBackground } from '@components/with-background';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { CheckBox } from '@components/check-box/check-box';
import { removeChat } from '@store/chats/actions';
import { getInfoChatIdSelector } from '@store/chats/selectors';

import './remove-chat-modal.scss';

interface IRemoveChatModalProps {
  onClose: () => void;
}

export const RemoveChatModal: React.FC<IRemoveChatModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const chatId = useSelector(getInfoChatIdSelector);

  const removeThisChat = useActionWithDeferred(removeChat);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const deleteTheseMessages = useCallback(() => {
    if (chatId) {
      setLoading(true);
      removeThisChat({ forEveryone: deleteForInterlocutor, chatId }).then(() => {
        setLoading(false);
        onClose();
      });
    }
  }, [removeThisChat, deleteForInterlocutor, setLoading, chatId, onClose]);

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
