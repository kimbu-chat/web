import React from 'react';
import Message from '../Message/Message';

export enum messageFrom {
  me,
  others
}

const Chat = () => {
  return (
    <div className="messenger__messages-list">
      <Message from={messageFrom.me} content="12345" time="20:20" />
    </div>
  );
};

export default Chat;
