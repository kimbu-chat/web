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

const MessageItem = ({ from, content, time }: Message.Props) => {
  return (
    <div
      className={
        from === messageFrom.me
          ? 'messenger__message-container messenger__message-container--from-me'
          : 'messenger__message-container messenger__message-container--from-others'
      }
    >
      <div
        className={
          from === messageFrom.me
            ? 'messenger__message messenger__message--from-me'
            : 'messenger__message messenger__message--from-others'
        }
      >
        {content}
        <span className="messenger__message-time">{time}</span>
      </div>
    </div>
  );
};

export default MessageItem;
