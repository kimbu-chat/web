import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { IUser } from '@store/common/models';
import { removeUserFromGroupChatAction } from '@store/chats/actions';

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
    <Modal
      title={t('deleteChatMemberModal.title')}
      content={t('deleteChatMemberModal.delete-confirmation')}
      closeModal={hide}
      buttons={[
        <button key={1} type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={hide}>
          {t('deleteChatMemberModal.cancel')}
        </button>,
        <Button
          key={2}
          type="button"
          loading={loading}
          className={`${BLOCK_NAME}__confirm-btn`}
          onClick={removeChatMember}>
          {t('deleteChatMemberModal.confirm')}
        </Button>,
      ]}
    />
  );
};
