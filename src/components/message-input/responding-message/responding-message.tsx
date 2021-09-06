import React from 'react';

import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ReplySvg } from '@icons/reply.svg';
import { resetReplyToMessageAction } from '@store/chats/actions';
import { getMessageToReplySelector } from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import renderText from '@utils/render-text/render-text';

import './responding-message.scss';

export const RespondingMessage = () => {
  const replyingMessage = useSelector(getMessageToReplySelector);
  const myId = useSelector(myIdSelector) as string;
  const userCreator = useSelector(getUserSelector(replyingMessage?.userCreatorId));

  const isCurrentUserMessageCreator = replyingMessage?.userCreatorId === myId;

  const resetReplyToMessage = useActionWithDispatch(resetReplyToMessageAction);

  return (
    <div className="responding-message">
      <ReplySvg className="responding-message__icon" />
      <div className="responding-message__line" />

      <Avatar size={32} user={userCreator} />

      <div
        className={`responding-message__message-contents ${
          isCurrentUserMessageCreator
            ? 'responding-message__message-contents--outgoing'
            : 'responding-message__message-contents--incoming'
        }`}>
        {replyingMessage?.text && renderText(replyingMessage?.text)}
      </div>
      <button type="button" onClick={resetReplyToMessage} className="responding-message__close">
        <CloseSvg />
      </button>
    </div>
  );
};
