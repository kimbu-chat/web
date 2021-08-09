import React from 'react';

import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { resetEditMessageAction } from '@store/chats/actions';
import { getMessageToEditSelector } from '@store/chats/selectors';
import renderText from '@utils/render-text/render-text';

import './editing-message.scss';

export const EditingMessage = () => {
  const editingMessage = useSelector(getMessageToEditSelector);

  const resetEditToMessage = useActionWithDispatch(resetEditMessageAction);

  return (
    <div className="editing-message">
      <div>
        <CrayonSvg className="editing-message__icon" />
      </div>
      <div className="editing-message__line" />

      <div className="editing-message__message-contents">
        {editingMessage?.text && renderText(editingMessage.text)}
      </div>
      <button type="button" onClick={resetEditToMessage} className="editing-message__close">
        <CloseSvg />
      </button>
    </div>
  );
};
