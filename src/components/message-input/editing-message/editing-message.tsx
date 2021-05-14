import React from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getMessageToEditSelector } from '@store/chats/selectors';
import { resetEditMessageAction } from '@store/chats/actions';

import './editing-message.scss';

export const EditingMessage = () => {
  const editingMessage = useSelector(getMessageToEditSelector);

  const resetEditToMessage = useActionWithDispatch(resetEditMessageAction);

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
};