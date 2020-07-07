import React from 'react';
import { messageFrom } from '../Chat/Chat';
import { Message } from 'app/store/messages/interfaces';
import './Message.scss';

namespace Message {
  export interface Props {
    from: messageFrom;
    content: string;
    time: string;
    needToShowDateSeparator: boolean | undefined;
    dateSeparator?: string;
  }
}

const MessageItem = ({ from, content, time, needToShowDateSeparator, dateSeparator }: Message.Props) => {
  if (needToShowDateSeparator) {
    return (
      <React.Fragment>
        <div className="messenger__message-separator">
          <span>{dateSeparator}</span>
        </div>
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
      </React.Fragment>
    );
  }
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
