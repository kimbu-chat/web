import { useTranslation } from 'react-i18next';
import { Button, Modal, WithBackground } from '@components/shared';
import { getSelectedGroupChatNameSelector } from '@store/chats/selectors';
import React, { useCallback, useState } from 'react';
import './clear-chat-modal.scss';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { useSelector } from 'react-redux';
import { ClearChatHistory } from '@store/chats/features/clear-chat-history/clear-chat-history';
import { CheckBox } from '@components/messenger-page/settings-modal/shared/check-box/check-box';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

interface IClearChatModalProps {
  hide: () => void;
}

export const ClearChatModal: React.FC<IClearChatModalProps> = React.memo(({ hide }) => {
  const { t } = useTranslation();

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const clearHistory = useActionWithDeferred(ClearChatHistory.action);
  const clearSelectedChat = useCallback(() => {
    setLoading(true);
    clearHistory({ forEveryone: deleteForInterlocutor }).then(() => {
      setLoading(false);
      hide();
    });
  }, [deleteForInterlocutor, clearHistory, hide]);

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
        highlightedInContents={selectedGroupChatName}
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
            onClick={clearSelectedChat}>
            {t('chatInfo.clear')}
          </Button>,
        ]}
      />
    </WithBackground>
  );
});
