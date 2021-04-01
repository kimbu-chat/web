import { LocalizationContext } from '@contexts';
import { Modal, WithBackground } from '@components/shared';
import { getSelectedGroupChatNameSelector } from '@store/chats/selectors';
import React, { useCallback, useContext, useState } from 'react';
import './clear-chat-modal.scss';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { useSelector } from 'react-redux';
import { ClearChatHistory } from '@store/chats/features/clear-chat-history/clear-chat-history';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { CheckBox } from '@components/messenger-page/settings-modal/shared/check-box/check-box';

interface IClearChatModalProps {
  hide: () => void;
}

export const ClearChatModal: React.FC<IClearChatModalProps> = React.memo(({ hide }) => {
  const { t } = useContext(LocalizationContext);

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const clearHistory = useActionWithDispatch(ClearChatHistory.action);
  const clearSelectedChat = useCallback(() => {
    clearHistory({ forEveryone: deleteForInterlocutor });
    hide();
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
          <button
            key={2}
            type="button"
            className="clear-chat-modal__confirm-btn"
            onClick={clearSelectedChat}>
            {t('chatInfo.clear')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
