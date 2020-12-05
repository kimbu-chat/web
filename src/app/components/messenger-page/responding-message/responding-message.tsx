import React from 'react';
import './responding-message.scss';

import CloseSVG from 'icons/ic-close.svg';
import { useSelector } from 'react-redux';
import { MessageActions } from 'store/messages/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { getMessageToReply } from 'app/store/messages/selectors';

export const RespondingMessage = React.memo(() => {
  const replyingMessage = useSelector(getMessageToReply);

  const resetReplyToMessage = useActionWithDispatch(MessageActions.resetReplyToMessage);

  return (
    <div className='responding-message'>
      <div className='responding-message__line' />
      <div className='responding-message__message-wrapper'>
        <div className='responding-message__message-sender'>{`${replyingMessage?.userCreator.firstName} ${replyingMessage?.userCreator.lastName}`}</div>
        <div className='responding-message__message-contents'>{replyingMessage?.text}</div>
      </div>
      <button type='button' onClick={resetReplyToMessage} className='responding-message__close'>
        <CloseSVG viewBox='0 0 25 25' />
      </button>
    </div>
  );
});
