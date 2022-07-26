import React from 'react';

import { ReactComponent as MessageErrorSvg } from '@icons/message-error.svg';
import { ReactComponent as MessageQueuedSvg } from '@icons/message-queued.svg';
import { ReactComponent as MessageReadSvg } from '@icons/message-read.svg';
import { ReactComponent as MessageSentSvg } from '@icons/message-sent.svg';
import { MessageState } from '@store/chats/models';

interface IMessageStatusProps {
  state: MessageState;
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

export const MessageStatus: React.FC<IMessageStatusProps> = ({ state }) => (
  <>{messageStatusIconMap[state]}</>
);
