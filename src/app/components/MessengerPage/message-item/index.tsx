import React from 'react';
import { messageFrom } from '../Chat/Chat';
import { Message, SystemMessageType } from 'app/store/messages/models';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './Message.scss';
import { RootState } from 'app/store/root-reducer';

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
  const currentUserId: number = useSelector<RootState, number>((state) => state.myProfile.user.id);

  if (message?.systemMessageType !== SystemMessageType.None) {
    return (
      <React.Fragment>
        {needToShowDateSeparator && (
          <div className="messenger__message-separator">
            <span>{dateSeparator}</span>
          </div>
        )}
        <div className="messenger__message-separator">
          <span>
            {MessageUtils.constructSystemMessageText(message as Message, message?.userCreator?.id === currentUserId)}
          </span>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {needToShowDateSeparator && (
        <div className="messenger__message-separator">
          <span>{dateSeparator}</span>
        </div>
      )}
      <div
        className={`messenger__message-container ${
          from === messageFrom.me
            ? 'messenger__message-container--from-me'
            : 'messenger__message-container--from-others'
        }`}
      >
        <div
          className={`messenger__message ${
            from === messageFrom.me ? 'messenger__message--from-me' : 'messenger__message--from-others'
          }`}
        >
          {content}
          <span className="messenger__message-time">{time}</span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MessageItem;
