import React from 'react';
import './responding-message.scss';

import CloseSvg from 'icons/close.svg';
import ReplySvg from 'icons/reply.svg';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getMessageToReplySelector } from 'app/store/chats/selectors';
import { ResetReplyToMessage } from 'app/store/chats/features/reply-to-message/reset-reply-to-message';
import { Avatar } from 'app/components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';

export const RespondingMessage = React.memo(() => {
  const replyingMessage = useSelector(getMessageToReplySelector);

  const resetReplyToMessage = useActionWithDispatch(ResetReplyToMessage.action);

  return (
    <div className='responding-message'>
      <ReplySvg className='responding-message__icon' viewBox='0 0 15 16' />
      <div className='responding-message__line' />

      <Avatar className='responding-message__message-sender' src={replyingMessage?.userCreator.avatar?.previewUrl}>
        {getUserInitials(replyingMessage?.userCreator)}
      </Avatar>

      <div className='responding-message__message-contents'>{replyingMessage?.text}</div>
      <button type='button' onClick={resetReplyToMessage} className='responding-message__close'>
        <CloseSvg viewBox='0 0 24 24' />
      </button>
    </div>
  );
});
