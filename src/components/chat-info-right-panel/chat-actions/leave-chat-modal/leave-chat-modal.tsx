import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { WithBackground } from '@components/with-background';
import { leaveGroupChatAction } from '@store/chats/actions';
import { getSelectedGroupChatNameSelector } from '@store/chats/selectors';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';

import './leave-chat-modal.scss';

interface ILeaveChatModalProps {
  hide: () => void;
}

const BLOCK_NAME = 'leave-chat-modal';

export const LeaveChatModal: React.FC<ILeaveChatModalProps> = ({ hide }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const leaveGroupChat = useEmptyActionWithDeferred(leaveGroupChatAction);

  const deleteGroupChat = useCallback(() => {
    setLoading(true);
    leaveGroupChat().then(() => {
      setLoading(false);
      history.push('/chats');
    });
  }, [leaveGroupChat, history]);

  return (
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title="Delete chat"
        content={t('chatInfo.leave-confirmation', { groupChatName: selectedGroupChatName })}
        highlightedInContents={selectedGroupChatName}
        closeModal={hide}
        buttons={[
          <button key={1} type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={hide}>
            {t('chatInfo.cancel')}
          </button>,
          <Button
            key={2}
            loading={loading}
            type="button"
            className={`${BLOCK_NAME}__confirm-btn`}
            onClick={deleteGroupChat}>
            {t('chatInfo.confirm')}
          </Button>,
        ]}
      />
    </WithBackground>
  );
};
