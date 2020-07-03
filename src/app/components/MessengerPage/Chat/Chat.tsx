import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Message from '../Message/Message';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { getMessagesAction } from '../../../store/messages/actions';

import './Chat.scss';

export enum messageFrom {
  me,
  others
}

namespace Chat {
  export interface Props {
    chatId: string;
  }
}

const Chat = ({ chatId }: Chat.Props) => {
  const getMessages = useActionWithDeferred(getMessagesAction);
  const dialog = useSelector((state) =>
    state.dialogs.dialogs.find(({ id }) => {
      return id === Number(chatId);
    })
  );

  const page = {
    offset: 0,
    limit: 25
  };

  useEffect(() => {
    if (dialog) {
      console.log(111);
      getMessages({
        page,
        dialog,
        initiatedByScrolling: false
      });
    }
  }, [dialog]);

  const messages = useSelector((state) => state.messages.messages[Number(chatId)]?.messages);
  const myId = useSelector((state) => state.auth.currentUser?.id);

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
        {messages?.map((msg) => {
          return <Message key={msg.id} from={messageIsFrom(msg.userCreator.id)} content={msg.text} time="20:20" />;
        })}
      </div>
    </div>
  );
};

export default Chat;
