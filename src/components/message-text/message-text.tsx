import React from 'react';

import classnames from 'classnames';

import './message-text.scss';

export enum MessageState {
  DELETED = 'DELETED',
  EXISTS = 'EXISTS',
}

interface IMessageTextProps {
  state?: MessageState;
  className?: string;
}

const BLOCK_NAME = 'message-text';

const classes = {
  [MessageState.DELETED]: `${BLOCK_NAME}__deleted`,
  [MessageState.EXISTS]: undefined,
};

export const MessageText: React.FC<IMessageTextProps> = ({
  children,
  state = MessageState.EXISTS,
  className,
}) => <span className={classnames(BLOCK_NAME, classes[state], className)}>{children}</span>;
