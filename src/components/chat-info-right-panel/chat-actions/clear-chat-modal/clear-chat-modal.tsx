import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { CheckBox } from '@components/check-box';
import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { Button } from '@shared-components/button';
import { clearChatHistoryAction } from '@store/chats/actions';
import { getInfoChatIdSelector } from '@store/chats/selectors';

import './clear-chat-modal.scss';

interface IClearChatModalProps {
  hide: () => void;
}

const BLOCK_NAME = 'clear-chat-modal';

export const InitialClearChatModal: React.FC<IClearChatModalProps & IModalChildrenProps> = ({
  animatedClose,
}) => {
  const { t } = useTranslation();

  const chatId = useSelector(getInfoChatIdSelector);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const clearHistory = useActionWithDeferred(clearChatHistoryAction);
  const clearChat = useCallback(() => {
    if (chatId) {
      setLoading(true);
      clearHistory({ forEveryone: deleteForInterlocutor, chatId }).then(() => {
        setLoading(false);
        animatedClose();
      });
    }
  }, [deleteForInterlocutor, clearHistory, animatedClose, chatId]);

  return (
    <>
      <Modal.Header>
        <>
          <ClearSvg className={`${BLOCK_NAME}__icon`} />
          <span> {t('clearChat.title')} </span>
        </>
      </Modal.Header>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__delete-all`}>
          <CheckBox
            className={`${BLOCK_NAME}__check-box`}
            onClick={changeDeleteForInterlocutorState}
            isChecked={deleteForInterlocutor}
            title={t('clearChat.clear-confirmation')}
          />
        </div>
        <div className={`${BLOCK_NAME}__btn-block`}>
          <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={animatedClose}>
            {t('chatInfo.cancel')}
          </button>
          <Button
            loading={loading}
            type="button"
            className={`${BLOCK_NAME}__confirm-btn`}
            onClick={clearChat}>
            {t('chatInfo.clear')}
          </Button>
        </div>
      </div>
    </>
  );
};

const ClearChatModal: React.FC<IClearChatModalProps> = ({ hide, ...props }) => (
  <Modal closeModal={hide}>
    {(animatedClose: () => void) => (
      <InitialClearChatModal {...props} hide={hide} animatedClose={animatedClose} />
    )}
  </Modal>
);

ClearChatModal.displayName = 'ClearChatModal';

export { ClearChatModal };
