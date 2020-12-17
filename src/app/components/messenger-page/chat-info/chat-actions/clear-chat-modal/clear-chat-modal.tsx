import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { Chat } from 'store/chats/models';
import { getSelectedChatSelector } from 'store/chats/selectors';
import React, { useCallback, useContext, useState } from 'react';
import './clear-chat-modal.scss';
import { useSelector } from 'react-redux';
import { ClearChatHistory } from 'app/store/messages/features/clear-history/clear-chat-history';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import CheckBoxSvg from 'icons/ic-checkbox.svg';

namespace ClearChatModalNS {
  export interface Props {
    hide: () => void;
  }
}

export const ClearChatModal = React.memo(({ hide }: ClearChatModalNS.Props) => {
  const { t } = useContext(LocalizationContext);

  const selectedChat = useSelector(getSelectedChatSelector) as Chat;

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const clearHistory = useActionWithDispatch(ClearChatHistory.action);
  const clearSelectedChat = useCallback(() => {
    clearHistory({ forEveryone: deleteForInterlocutor, chatId: selectedChat.id });
    hide();
  }, [selectedChat.id, deleteForInterlocutor]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title='Clear chat'
        contents={
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
        highlightedInContents={`‘${selectedChat.groupChat?.name}‘`}
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
