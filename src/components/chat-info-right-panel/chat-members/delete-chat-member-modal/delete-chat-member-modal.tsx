import React, { useCallback, useState } from 'react';

import { IUser } from 'kimbu-models';
import { useTranslation } from 'react-i18next';

import { IModalChildrenProps, Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { Button } from '@shared-components/button';
import { removeUserFromGroupChatAction } from '@store/chats/actions';

import './delete-chat-member-modal.scss';

interface IDeleteChatMemberModalProps {
  user: IUser;
  hide: () => void;
}

const BLOCK_NAME = 'delete-chat-member-modal';

const InitialDeleteChatMemberModal: React.FC<IDeleteChatMemberModalProps & IModalChildrenProps> = ({
  animatedClose,
  user,
}) => {
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
    <>
      <Modal.Header>{t('deleteChatMemberModal.title')}</Modal.Header>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__сontent`}>
          {t('deleteChatMemberModal.delete-confirmation')}
        </div>
        <div className={`${BLOCK_NAME}__btn-block`}>
          <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={animatedClose}>
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
  );
};

const DeleteChatMemberModal: React.FC<IDeleteChatMemberModalProps> = ({ hide, ...props }) => (
  <Modal closeModal={hide}>
    {(animatedClose: () => void) => (
      <InitialDeleteChatMemberModal {...props} hide={hide} animatedClose={animatedClose} />
    )}
  </Modal>
);

DeleteChatMemberModal.displayName = 'DeleteChatMemberModal';

export { DeleteChatMemberModal };
