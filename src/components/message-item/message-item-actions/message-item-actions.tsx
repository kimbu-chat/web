import React, { useCallback } from 'react';

import { ForwardModal } from '@components/forward-modal';
import { DeleteMessageModal } from '@components/selected-messages-data/delete-message-modal/delete-message-modal';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as DeleteSVG } from '@icons/delete.svg';
import { ReactComponent as EditSVG } from '@icons/edit.svg';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { ReactComponent as ReplySVG } from '@icons/reply.svg';
import { editMessageAction, replyToMessageAction } from '@store/chats/actions';

import './message-item-actions.scss';

interface IMessageItemActionsProps {
  messageId: number;
  isEditAllowed: boolean;
}

const MessageItemActions: React.FC<IMessageItemActionsProps> = ({ messageId, isEditAllowed }) => {
  const replyToMessage = useActionWithDispatch(replyToMessageAction);
  const editMessage = useActionWithDispatch(editMessageAction);

  const replyToSelectedMessage = useCallback(() => {
    replyToMessage({ messageId });
  }, [replyToMessage, messageId]);

  const editSelectedMessage = useCallback(() => {
    editMessage({ messageId });
  }, [editMessage, messageId]);

  const [deleteMessagesModalDisplayed, displayDeleteMessagesModal, hideBigMedia] =
    useToggledState(false);

  const [forwardMessagesModalDisplayed, displayForwardMessagesModal, hideForwardMessagesModal] =
    useToggledState(false);

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
          onClick={displayForwardMessagesModal}
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
          onClick={displayDeleteMessagesModal}
          className="message-item-actions__action">
          <DeleteSVG />
        </button>
      </div>

      {deleteMessagesModalDisplayed && (
        <DeleteMessageModal onClose={hideBigMedia} selectedMessages={[messageId]} />
      )}

      {forwardMessagesModalDisplayed && (
        <ForwardModal messageIdsToForward={[messageId]} onClose={hideForwardMessagesModal} />
      )}
    </>
  );
};
MessageItemActions.displayName = 'MessageItemActions';

export { MessageItemActions };
