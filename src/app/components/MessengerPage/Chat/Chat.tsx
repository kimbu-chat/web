import React from 'react';
import Message from '../Message/Message';

import './Chat.scss';

export enum messageFrom {
  me,
  others
}

const Chat = () => {
  return (
    <div className="messenger__messages-list">
      <div className="messenger__messages-container">
        <Message from={messageFrom.me} content="12345" time="20:20" />
        <Message from={messageFrom.me} content="12345" time="20:20" />
        <Message from={messageFrom.others} content="12345" time="20:20" />
      </div>
    </div>
  );
};

export default Chat;
