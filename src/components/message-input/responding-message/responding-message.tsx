import React from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ReplySvg } from '@icons/reply.svg';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getMessageToReplySelector } from '@store/chats/selectors';
import { Avatar } from '@components/avatar';
import { myIdSelector } from '@store/my-profile/selectors';
import { resetReplyToMessageAction } from '@store/chats/actions';
import { getUserSelector } from '@store/users/selectors';

import './responding-message.scss';

export const RespondingMessage = () => {
  const replyingMessage = useSelector(getMessageToReplySelector);
  const myId = useSelector(myIdSelector) as number;
  const userCreator = useSelector(getUserSelector(replyingMessage?.userCreatorId));

  const isCurrentUserMessageCreator = replyingMessage?.userCreatorId === myId;

  const resetReplyToMessage = useActionWithDispatch(resetReplyToMessageAction);

  return (
    <div className="responding-message">
      <ReplySvg className="responding-message__icon" viewBox="0 0 15 16" />
      <div className="responding-message__line" />

      <Avatar className="responding-message__message-sender" user={userCreator} />

      <div
        className={`responding-message__message-contents ${
          isCurrentUserMessageCreator
            ? 'responding-message__message-contents--outgoing'
            : 'responding-message__message-contents--incoming'
        }`}>
        {replyingMessage?.text}
      </div>
      <button type="button" onClick={resetReplyToMessage} className="responding-message__close">
        <CloseSvg viewBox="0 0 24 24" />
      </button>
    </div>
  );
};
