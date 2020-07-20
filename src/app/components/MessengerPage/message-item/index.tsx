import React from 'react';
import { messageFrom } from '../Chat/Chat';
import { Message, SystemMessageType } from 'app/store/messages/interfaces';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';
import './Message.scss';

namespace Message {
  export interface Props {
    from: messageFrom;
    content: string;
    time: string;
    needToShowDateSeparator: boolean | undefined;
    dateSeparator?: string;
    message: Message;
  }
}

const MessageItem = ({ from, content, time, needToShowDateSeparator, dateSeparator, message }: Message.Props) => {
  const currentUserId: number = useSelector<AppState, number>((state) => state.auth.authentication.userId);

  if (message?.systemMessageType !== SystemMessageType.None) {
    if (needToShowDateSeparator) {
      return (
        <React.Fragment>
          <div className="messenger__message-separator">
            <span>{dateSeparator}</span>
          </div>
          <div className="messenger__message-separator">
            <span>
              {MessageUtils.constructSystemMessageText(message as Message, message?.userCreator?.id === currentUserId)}
            </span>
          </div>
        </React.Fragment>
      );
    }
    return (
      <div className="messenger__message-separator">
        <span>
          {MessageUtils.constructSystemMessageText(message as Message, message?.userCreator?.id === currentUserId)}
        </span>
      </div>
    );
  }

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
