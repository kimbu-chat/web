import React from 'react';
import './responding-message.scss';

import CloseSVG from 'icons/ic-close.svg';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getMessageToReplySelector } from 'app/store/chats/selectors';
import { ResetReplyToMessage } from 'app/store/chats/features/reply-to-message/reset-reply-to-message';

export const RespondingMessage = React.memo(() => {
  const replyingMessage = useSelector(getMessageToReplySelector);

  const resetReplyToMessage = useActionWithDispatch(ResetReplyToMessage.action);

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
