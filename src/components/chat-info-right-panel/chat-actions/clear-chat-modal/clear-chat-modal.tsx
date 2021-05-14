import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Modal, WithBackground } from '@components';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { CheckBox } from '@components/check-box/check-box';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { clearChatHistoryAction } from '@store/chats/actions';
import { getInfoChatIdSelector } from '@store/chats/selectors';

import './clear-chat-modal.scss';

interface IClearChatModalProps {
  hide: () => void;
}

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
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title={
          <>
            <ClearSvg viewBox="0 0 18 18" className="clear-chat-modal__icon" />
            <span> {t('clearChat.title')} </span>
          </>
        }
        content={
          <div className="clear-chat-modal">
            <div className="clear-chat-modal__delete-all">
              <CheckBox
                className="clear-chat-modal__check-box"
                onClick={changeDeleteForInterlocutorState}
                isChecked={deleteForInterlocutor}
                title={t('clearChat.clear-confirmation')}
              />
            </div>
          </div>
        }
        closeModal={hide}
        buttons={[
          <button key={1} type="button" className="clear-chat-modal__cancel-btn" onClick={hide}>
            {t('chatInfo.cancel')}
          </button>,
          <Button
            key={2}
            loading={loading}
            type="button"
            className="clear-chat-modal__confirm-btn"
            onClick={clearChat}>
            {t('chatInfo.clear')}
          </Button>,
        ]}
      />
    </WithBackground>
  );
};
