import React from 'react';
import './editing-message.scss';

import CloseSvg from '@icons/close.svg';
import CrayonSvg from '@icons/crayon.svg';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getMessageToEditSelector } from '@store/chats/selectors';
import { ResetEditMessage } from '@store/chats/features/edit-message/reset-edit-message';

export const EditingMessage = React.memo(() => {
  const editingMessage = useSelector(getMessageToEditSelector);

  const resetEditToMessage = useActionWithDispatch(ResetEditMessage.action);

  return (
    <div className="editing-message">
      <CrayonSvg className="editing-message__icon" viewBox="0 0 16 16" />
      <div className="editing-message__line" />

      <div className="editing-message__message-contents">{editingMessage?.text}</div>
      <button type="button" onClick={resetEditToMessage} className="editing-message__close">
        <CloseSvg viewBox="0 0 24 24" />
      </button>
    </div>
  );
});
