import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { CheckBox } from '@components/check-box';
import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { Button } from '@shared-components/button';
import { removeChatAction } from '@store/chats/actions';
import { getInfoChatIdSelector } from '@store/chats/selectors';

import './remove-chat-modal.scss';

interface IRemoveChatModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'remove-chat-modal';

const InitialRemoveChatModal: React.FC<IModalChildrenProps> = ({ animatedClose }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const chatId = useSelector(getInfoChatIdSelector);

  const removeThisChat = useActionWithDeferred(removeChatAction);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const deleteTheseMessages = useCallback(() => {
    if (chatId) {
      setLoading(true);
      removeThisChat({ forEveryone: deleteForInterlocutor, chatId }).then(() => {
        animatedClose();
        navigate(INSTANT_MESSAGING_PATH);
      });
    }
  }, [chatId, removeThisChat, deleteForInterlocutor, animatedClose, navigate]);

  return (
    <>
      <Modal.Header>
        <>
          <DeleteSvg className={`${BLOCK_NAME}__icon`} />
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
          <button type="button" onClick={animatedClose} className={`${BLOCK_NAME}__cancel-btn`}>
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
  );
};

const RemoveChatModal: React.FC<IRemoveChatModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialRemoveChatModal {...props} animatedClose={animatedClose} />
    )}
  </Modal>
);

RemoveChatModal.displayName = 'RemoveChatModal';

export { RemoveChatModal };
