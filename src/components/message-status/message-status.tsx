import React from 'react';

import { SystemMessageType } from 'kimbu-models';
import { useSelector } from 'react-redux';

import { ReactComponent as MessageErrorSvg } from '@icons/message-error.svg';
import { ReactComponent as MessageQueuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { INormalizedMessage, MessageState } from '@store/chats/models';
import { myIdSelector } from '@store/my-profile/selectors';

interface IMessageStatusProps {
  message?: INormalizedMessage;
}

const messageStatusIconMap = {
  [MessageState.QUEUED]: <MessageQueuedSvg />,
  [MessageState.SENT]: <MessageSentSvg />,
  [MessageState.READ]: <MessageReadSvg />,
  [MessageState.ERROR]: <MessageErrorSvg />,
  [MessageState.DELETED]: undefined,
  [MessageState.LOCALMESSAGE]: undefined,
  [MessageState.DRAFT]: undefined,
};

export const MessageStatus: React.FC<IMessageStatusProps> = ({ message }) => {
  const currentUserId = useSelector(myIdSelector);

  const isMessageCreatorCurrentUser: boolean = message?.userCreatorId === currentUserId;

  return (
    <>
      {!isMessageCreatorCurrentUser ||
        !message?.state ||
        (message?.systemMessageType !== SystemMessageType.None && '')}

      {isMessageCreatorCurrentUser && message?.state && messageStatusIconMap[message.state]}
    </>
  );
};
