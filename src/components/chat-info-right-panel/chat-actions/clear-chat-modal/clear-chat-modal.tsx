import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { CheckBox } from '@components/check-box/check-box';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { clearChatHistoryAction } from '@store/chats/actions';
import { getInfoChatIdSelector } from '@store/chats/selectors';

import './clear-chat-modal.scss';

interface IClearChatModalProps {
  hide: () => void;
}

const BLOCK_NAME = 'clear-chat-modal';

export const ClearChatModal: React.FC<IClearChatModalProps> = ({ hide }) => {
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
        hide();
      });
    }
  }, [deleteForInterlocutor, clearHistory, hide, chatId]);

  return (
    <Modal closeModal={hide}>
      <>
        <Modal.Header>
          <>
            <ClearSvg viewBox="0 0 18 18" className={`${BLOCK_NAME}__icon`} />
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
            <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={hide}>
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
    </Modal>
  );
};
