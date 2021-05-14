import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { WithBackground, Modal, Button } from '@components';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { IUser } from '@store/common/models';
import { removeUserFromGroupChatAction } from '@store/chats/actions';

import './delete-chat-member-modal.scss';

interface IDeleteChatMemberModalProps {
  user: IUser;
  hide: () => void;
}

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
    <WithBackground onBackgroundClick={hide}>
      <Modal
        title={t('deleteChatMemberModal.title')}
        content={t('deleteChatMemberModal.delete-confirmation')}
        closeModal={hide}
        buttons={[
          <button
            key={1}
            type="button"
            className="delete-chat-member-modal__cancel-btn"
            onClick={hide}>
            {t('deleteChatMemberModal.cancel')}
          </button>,
          <Button
            key={2}
            type="button"
            loading={loading}
            className="delete-chat-member-modal__confirm-btn"
            onClick={removeChatMember}>
            {t('deleteChatMemberModal.confirm')}
          </Button>,
        ]}
      />
    </WithBackground>
  );
};
