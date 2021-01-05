import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { getSelectedGroupChatNameSelector } from 'store/chats/selectors';
import React, { useCallback, useContext, useState } from 'react';
import './clear-chat-modal.scss';
import { useSelector } from 'react-redux';
import { ClearChatHistory } from 'app/store/chats/features/clear-chat-history/clear-chat-history';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import CheckBoxSvg from 'icons/ic-checkbox.svg';

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
  }, [deleteForInterlocutor]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title='Clear chat'
        content={
          <div>
            <div className=''>{t('chatInfo.clear-confirmation')}</div>
            <div className='clear-chat-modal'>
              <button type='button' className='clear-chat-modal__btn' onClick={changeDeleteForInterlocutorState}>
                {deleteForInterlocutor && <CheckBoxSvg />}
              </button>
              <span className='clear-chat-modal__btn-description'>{t('chatInfo.clear-for-everybody')}</span>
            </div>
          </div>
        }
        highlightedInContents={selectedGroupChatName}
        closeModal={hide}
        buttons={[
          {
            children: t('chatInfo.clear'),
            className: 'clear-chat-modal__clear',
            onClick: clearSelectedChat,
            position: 'left',
            width: 'contained',
            variant: 'contained',
            color: 'secondary',
          },
          {
            children: t('chatInfo.cancel'),
            className: 'clear-chat-modal__cancel-btn',
            onClick: hide,
            position: 'left',
            width: 'auto',
            variant: 'outlined',
            color: 'default',
          },
        ]}
      />
    </WithBackground>
  );
});
