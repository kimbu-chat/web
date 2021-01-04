import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { ChatActions } from 'store/chats/actions';
import React, { useCallback, useContext } from 'react';
import './delete-chat-modal.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getSelectedGroupChatNameSelector } from 'app/store/chats/selectors';

namespace DeleteChatModalNS {
  export interface IProps {
    hide: () => void;
  }
}

export const DeleteChatModal = React.memo(({ hide }: DeleteChatModalNS.IProps) => {
  const { t } = useContext(LocalizationContext);

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const leaveGroupChat = useActionWithDispatch(ChatActions.leaveGroupChat);

  const deleteGroupChat = useCallback(() => {
    leaveGroupChat();
  }, [leaveGroupChat]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title='Delete chat'
        contents={t('chatInfo.leave-confirmation', { groupChatName: selectedGroupChatName })}
        highlightedInContents={selectedGroupChatName}
        closeModal={hide}
        buttons={[
          {
            children: t('chatInfo.confirm'),
            className: 'delete-chat-modal__confirm-btn',
            onClick: deleteGroupChat,
            position: 'left',
            width: 'contained',
            variant: 'contained',
            color: 'secondary',
          },
          {
            children: t('chatInfo.cancel'),
            className: 'delete-chat-modal__cancel-btn',
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
