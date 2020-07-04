import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { getMessagesAction } from '../../../store/messages/actions';

import './Chat.scss';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import MessageItem from '../message-item';
import { Message } from 'app/store/messages/interfaces';
import { AppState } from 'app/store';

export enum messageFrom {
  me,
  others
}

namespace Chat {
  export interface Props {
    chatId: number;
  }
}

const Chat = ({ chatId }: Chat.Props) => {
  const getMessages = useActionWithDeferred(getMessagesAction);
  const selectedDialog = useSelector(getSelectedDialogSelector);
  const messages = useSelector<AppState, Message[]>(
    (state) => state.messages.messages.find((x) => x.dialogId == chatId)?.messages as Message[]
  );
  const myId = useSelector<AppState, number>((state) => state.auth.authentication.userId);

  const page = {
    offset: 0,
    limit: 25
  };

  useEffect(() => {
    if (selectedDialog) {
      getMessages({
        page,
        dialog: selectedDialog,
        initiatedByScrolling: false
      });
    }
  }, [selectedDialog]);

  if (!selectedDialog || !messages) {
    return <div className="messenger__messages-list"></div>;
  }

  const messageIsFrom = (id: Number | undefined) => {
    if (id === myId) {
      return messageFrom.me;
    } else {
      return messageFrom.others;
    }
  };

  return (
    <div className="messenger__messages-list">
      <div className="messenger__messages-container">
        {messages.map((msg) => {
          return <MessageItem key={msg.id} from={messageIsFrom(msg.userCreator.id)} content={msg.text} time="20:20" />;
        })}
      </div>
    </div>
  );
};

export default Chat;
