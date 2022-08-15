import React from 'react';

import classnames from 'classnames';

import './message-text.scss';

export enum MessageTextState {
  DELETED = 'DELETED',
  BASIC = 'BASIC',
}

interface IMessageTextProps {
  state?: MessageTextState;
  className?: string;
  children: React.ReactNode;
}

const BLOCK_NAME = 'message-text';

const classes = {
  [MessageTextState.DELETED]: `${BLOCK_NAME}__deleted`,
  [MessageTextState.BASIC]: undefined,
};

export const MessageText: React.FC<IMessageTextProps> = ({
  children,
  state = MessageTextState.BASIC,
  className,
}) => <span className={classnames(BLOCK_NAME, classes[state], className)}>{children}</span>;
