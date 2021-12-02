import React from 'react';

import './message-form.scss';

const BLOCK_NAME = 'message-form';

export const MessageForm: React.FC = ({ children }) => <div className={BLOCK_NAME}>{children}</div>;
