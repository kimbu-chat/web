import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { Button } from '@shared-components/button';
import { removeUserFromGroupChatAction } from '@store/chats/actions';
import { IUser } from '@store/common/models';

import './delete-chat-member-modal.scss';

interface IDeleteChatMemberModalProps {
  user: IUser;
  hide: () => void;
}

const BLOCK_NAME = 'delete-chat-member-modal';

export const DeleteChatMemberModal: React.FC<IDeleteChatMemberModalProps> = ({ hide, user }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const removeUserFromGroupChat = useActionWithDeferred(removeUserFromGroupChatAction);

  const removeChatMember = useCallback(() => {
    setLoading(true);
    removeUserFromGroupChat({ userId: user.id }).then(() => {
      setLoading(false);
    });
  }, [removeUserFromGroupChat, user.id]);

  return (
    <Modal closeModal={hide}>
      <>
        <Modal.Header>{t('deleteChatMemberModal.title')}</Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__сontent`}>
            {t('deleteChatMemberModal.delete-confirmation')}
          </div>
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={hide}>
              {t('deleteChatMemberModal.cancel')}
            </button>
            <Button
              type="button"
              loading={loading}
              className={`${BLOCK_NAME}__confirm-btn`}
              onClick={removeChatMember}>
              {t('deleteChatMemberModal.confirm')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
