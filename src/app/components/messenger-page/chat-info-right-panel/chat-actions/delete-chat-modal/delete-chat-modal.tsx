import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { ChatActions } from 'store/chats/actions';
import React, { useCallback, useContext } from 'react';
import './delete-chat-modal.scss';
import { useSelector } from 'react-redux';
import { getSelectedGroupChatNameSelector } from 'app/store/chats/selectors';
import { useEmptyActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { useHistory } from 'react-router';

interface IDeleteChatModalProps {
  hide: () => void;
}

export const DeleteChatModal: React.FC<IDeleteChatModalProps> = React.memo(({ hide }) => {
  const { t } = useContext(LocalizationContext);
  const history = useHistory();

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const leaveGroupChat = useEmptyActionWithDeferred(ChatActions.leaveGroupChat);

  const deleteGroupChat = useCallback(() => {
    leaveGroupChat().then(() => history.push(history.location.pathname.replace(/\/?(contacts|calls|chats)\/?([0-9]*)?/, (_all, groupOne) => `/${groupOne}/`)));
  }, [leaveGroupChat]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title='Delete chat'
        content={t('chatInfo.leave-confirmation', { groupChatName: selectedGroupChatName })}
        highlightedInContents={selectedGroupChatName}
        closeModal={hide}
        buttons={[
          <button type='button' className='delete-chat-modal__cancel-btn' onClick={hide}>
            {t('chatInfo.cancel')}
          </button>,
          <button type='button' className='delete-chat-modal__confirm-btn' onClick={deleteGroupChat}>
            {t('chatInfo.confirm')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
