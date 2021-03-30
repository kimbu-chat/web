import { FadeAnimationWrapper } from '@components/shared';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { EditMessage } from '@store/chats/features/edit-message/edit-message';
import { ReplyToMessage } from '@store/chats/features/reply-to-message/reply-to-message';
import React, { useCallback, useState } from 'react';
import './message-item-actions.scss';

import ForwardSvg from '@icons/forward.svg';
import EditSVG from '@icons/edit.svg';
import DeleteSVG from '@icons/delete.svg';
import ReplySVG from '@icons/reply.svg';

import { DeleteMessageModal } from '../../selected-messages-data/delete-message-modal/delete-message-modal';
import { ForwardModal } from '../../forward-modal/forward-modal';

interface IMessageItemActionsProps {
  messageId: number;
  isEditAllowed: boolean;
}

const MessageItemActions: React.FC<IMessageItemActionsProps> = React.memo(
  ({ messageId, isEditAllowed }) => {
    const replyToMessage = useActionWithDispatch(ReplyToMessage.action);
    const editMessage = useActionWithDispatch(EditMessage.action);

    const replyToSelectedMessage = useCallback(() => {
      replyToMessage({ messageId });
    }, [replyToMessage, messageId]);

    const editSelectedMessage = useCallback(() => {
      editMessage({ messageId });
    }, [editMessage, messageId]);

    // --Delete message logic
    const [deleteMessagesModalDisplayed, setDeleteMessagesModalDisplayed] = useState(false);
    const changeDeleteMessagesModalDisplayedState = useCallback(() => {
      setDeleteMessagesModalDisplayed((oldState) => !oldState);
    }, [setDeleteMessagesModalDisplayed]);

    // --Forward Message Logic
    const [forwardMessagesModalDisplayed, setForwardMessagesModalDisplayed] = useState(false);
    const changeForwardMessagesModalDisplayedState = useCallback(() => {
      setForwardMessagesModalDisplayed((oldState) => !oldState);
    }, [setForwardMessagesModalDisplayed]);

    return (
      <>
        <div className="message-item-actions">
          {isEditAllowed && (
            <button
              type="button"
              onClick={editSelectedMessage}
              className="message-item-actions__action">
              <EditSVG />
            </button>
          )}

          <button
            type="button"
            onClick={changeForwardMessagesModalDisplayedState}
            className="message-item-actions__action">
            <ForwardSvg />
          </button>

          <button
            type="button"
            onClick={replyToSelectedMessage}
            className="message-item-actions__action">
            <ReplySVG />
          </button>

          <button
            type="button"
            onClick={changeDeleteMessagesModalDisplayedState}
            className="message-item-actions__action">
            <DeleteSVG />
          </button>
        </div>

        <FadeAnimationWrapper isDisplayed={deleteMessagesModalDisplayed}>
          <DeleteMessageModal
            onClose={changeDeleteMessagesModalDisplayedState}
            selectedMessages={[messageId]}
          />
        </FadeAnimationWrapper>

        <FadeAnimationWrapper isDisplayed={forwardMessagesModalDisplayed}>
          <ForwardModal
            messageIdsToForward={[messageId]}
            onClose={changeForwardMessagesModalDisplayedState}
          />
        </FadeAnimationWrapper>
      </>
    );
  },
);

MessageItemActions.displayName = 'MessageItemActions';

export { MessageItemActions };
