import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { Button } from '@shared-components/button';
import { leaveGroupChatAction } from '@store/chats/actions';

import './leave-chat-modal.scss';

interface ILeaveChatModalProps {
  hide: () => void;
}

const BLOCK_NAME = 'leave-chat-modal';

const InitialLeaveChatModal: React.FC<IModalChildrenProps> = ({ animatedClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const leaveGroupChat = useActionWithDeferred(leaveGroupChatAction);

  const deleteGroupChat = useCallback(() => {
    setLoading(true);
    leaveGroupChat().then(() => {
      animatedClose();
      navigate(INSTANT_MESSAGING_PATH);
    });
  }, [leaveGroupChat, animatedClose, navigate]);

  return (
    <>
      <Modal.Header>{t('chatActions.leave-chat')}</Modal.Header>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__сontent`}>{t('chatInfo.leave-confirmation')}</div>
        <div className={`${BLOCK_NAME}__btn-block`}>
          <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={animatedClose}>
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
  );
};

const LeaveChatModal: React.FC<ILeaveChatModalProps> = ({ hide, ...props }) => (
  <Modal closeModal={hide}>
    {(animatedClose: () => void) => (
      <InitialLeaveChatModal {...props} animatedClose={animatedClose} />
    )}
  </Modal>
);

LeaveChatModal.displayName = 'LeaveChatModal';

export { LeaveChatModal };
