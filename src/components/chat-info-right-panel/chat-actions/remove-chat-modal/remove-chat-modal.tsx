import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { CheckBox } from '@components/check-box';
import { Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { Button } from '@shared-components/button';
import { removeChat } from '@store/chats/actions';
import { getInfoChatIdSelector } from '@store/chats/selectors';

import './remove-chat-modal.scss';

interface IRemoveChatModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'remove-chat-modal';

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
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <DeleteSvg viewBox="0 0 15 16" className={`${BLOCK_NAME}__icon`} />
            <span> {t('removeChatModal.title')} </span>
          </>
        </Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__delete-all`}>
            <CheckBox
              className={`${BLOCK_NAME}__check-box`}
              onClick={changeDeleteForInterlocutorState}
              isChecked={deleteForInterlocutor}
              title={t('removeChatModal.delete-confirmation')}
            />
          </div>

          <div className={`${BLOCK_NAME}__btn-block`}>
            <button type="button" onClick={onClose} className={`${BLOCK_NAME}__cancel-btn`}>
              {t('removeChatModal.cancel')}
            </button>

            <Button
              type="button"
              loading={loading}
              onClick={deleteTheseMessages}
              className={`${BLOCK_NAME}__confirm-btn`}>
              {t('removeChatModal.delete-confirm')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
