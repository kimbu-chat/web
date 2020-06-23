import React from 'react';
import { messageFrom } from '../Chat/Chat';
import './Message.scss';

namespace Message {
  export interface Props {
    from: messageFrom;
    content: string;
    time: string;
  }
}

const Message = ({ from, content, time }: Message.Props) => {
  return (
    <div className="messenger__message-container">
      <div className="messenger__message">13245</div>
    </div>
  );
};

export default Message;
