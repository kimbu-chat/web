import React from 'react';
import './responding-message.scss';

import CloseSvg from '@icons/close.svg';
import ReplySvg from '@icons/reply.svg';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getMessageToReplySelector } from '@store/chats/selectors';
import { ResetReplyToMessage } from '@store/chats/features/reply-to-message/reset-reply-to-message';
import { Avatar } from '@components';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import { myIdSelector } from '@store/my-profile/selectors';

export const RespondingMessage = React.memo(() => {
  const replyingMessage = useSelector(getMessageToReplySelector);
  const myId = useSelector(myIdSelector) as number;

  const isCurrentUserMessageCreator = replyingMessage?.userCreator?.id === myId;

  const resetReplyToMessage = useActionWithDispatch(ResetReplyToMessage.action);

  return (
    <div className="responding-message">
      <ReplySvg className="responding-message__icon" viewBox="0 0 15 16" />
      <div className="responding-message__line" />

      <Avatar
        className="responding-message__message-sender"
        src={replyingMessage?.userCreator.avatar?.previewUrl}>
        {getUserInitials(replyingMessage?.userCreator)}
      </Avatar>

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
});
