import { useTranslation } from 'react-i18next';
import { Modal, WithBackground } from '@components/shared';
import { leaveGroupChatAction } from '@store/chats/actions';
import React, { useCallback } from 'react';
import './delete-chat-modal.scss';
import { useSelector } from 'react-redux';
import { getSelectedGroupChatNameSelector } from '@store/chats/selectors';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useHistory } from 'react-router';

interface IDeleteChatModalProps {
  hide: () => void;
}

export const DeleteChatModal: React.FC<IDeleteChatModalProps> = React.memo(({ hide }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const leaveGroupChat = useEmptyActionWithDeferred(leaveGroupChatAction);

  const deleteGroupChat = useCallback(() => {
    leaveGroupChat().then(() =>
      history.push(
        history.location.pathname.replace(
          /\/?(contacts|calls|chats)\/?([0-9]*)?/,
          (_all, groupOne) => `/${groupOne}/`,
        ),
      ),
    );
  }, [leaveGroupChat, history]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title="Delete chat"
        content={t('chatInfo.leave-confirmation', { groupChatName: selectedGroupChatName })}
        highlightedInContents={selectedGroupChatName}
        closeModal={hide}
        buttons={[
          <button key={1} type="button" className="delete-chat-modal__cancel-btn" onClick={hide}>
            {t('chatInfo.cancel')}
          </button>,
          <button
            key={2}
            type="button"
            className="delete-chat-modal__confirm-btn"
            onClick={deleteGroupChat}>
            {t('chatInfo.confirm')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
