import React from 'react';

import './message-form.scss';

const BLOCK_NAME = 'message-form';

interface IMessageProps {
  children: React.ReactNode;
}

export const MessageForm: React.FC<IMessageProps> = ({ children }) => (
  <div className={BLOCK_NAME}>{children}</div>
);
