import { WithBackground, Modal, Button } from '@components/shared';
import { RemoveUserFromGroupChat } from '@store/chats/features/remove-user-from-group-chat/remove-user-from-group-chat';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './delete-chat-member-modal.scss';
import { IUser } from '@store/common/models';

interface IDeleteChatMemberModalProps {
  user: IUser;
  hide: () => void;
}

export const DeleteChatMemberModal: React.FC<IDeleteChatMemberModalProps> = React.memo(
  ({ hide, user }) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const removeUserFromGroupChat = useActionWithDeferred(RemoveUserFromGroupChat.action);

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
            <button key={1} type="button" className="delete-chat-modal__cancel-btn" onClick={hide}>
              {t('deleteChatMemberModal.cancel')}
            </button>,
            <Button
              key={2}
              type="button"
              loading={loading}
              className="delete-chat-modal__confirm-btn"
              onClick={removeChatMember}>
              {t('deleteChatMemberModal.confirm')}
            </Button>,
          ]}
        />
      </WithBackground>
    );
  },
);
