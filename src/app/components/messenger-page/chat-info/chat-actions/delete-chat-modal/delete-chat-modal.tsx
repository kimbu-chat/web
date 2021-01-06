import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { ChatActions } from 'store/chats/actions';
import React, { useCallback, useContext } from 'react';
import './delete-chat-modal.scss';
import { useSelector } from 'react-redux';
import { getSelectedGroupChatNameSelector } from 'app/store/chats/selectors';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { useHistory } from 'react-router';

interface IDeleteChatModalProps {
  hide: () => void;
}

export const DeleteChatModal: React.FC<IDeleteChatModalProps> = React.memo(({ hide }) => {
  const { t } = useContext(LocalizationContext);
  const history = useHistory();

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const leaveGroupChat = useActionWithDeferred(ChatActions.leaveGroupChat);

  const deleteGroupChat = useCallback(() => {
    leaveGroupChat(undefined).then(() =>
      history.push(
        history.location.pathname.replace(
          /\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
          (_all, groupOne, _groupTwo, groupThree) => `/${groupOne}/${groupThree || ''}`,
        ),
      ),
    );
  }, [leaveGroupChat]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title='Delete chat'
        content={t('chatInfo.leave-confirmation', { groupChatName: selectedGroupChatName })}
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
