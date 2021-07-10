import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { leaveGroupChatAction } from '@store/chats/actions';

import './leave-chat-modal.scss';

interface ILeaveChatModalProps {
  hide: () => void;
}

const BLOCK_NAME = 'leave-chat-modal';

export const LeaveChatModal: React.FC<ILeaveChatModalProps> = ({ hide }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const leaveGroupChat = useEmptyActionWithDeferred(leaveGroupChatAction);

  const deleteGroupChat = useCallback(() => {
    setLoading(true);
    leaveGroupChat().then(() => {
      setLoading(false);
      history.push(INSTANT_MESSAGING_PATH);
    });
  }, [leaveGroupChat, history]);

  return (
    <Modal closeModal={hide}>
      <>
        <Modal.Header>{t('chatActions.leave-chat')}</Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__сontent`}>{t('chatInfo.leave-confirmation')}</div>
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={hide}>
              {t('chatInfo.cancel')}
            </button>
            <Button
              loading={loading}
              type="button"
              className={`${BLOCK_NAME}__confirm-btn`}
              onClick={deleteGroupChat}>
              {t('chatInfo.leave')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
