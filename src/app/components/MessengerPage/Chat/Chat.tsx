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
  const dialog = useSelector((state) =>
    state.dialogs.dialogs.find(({ id }) => {
      return id === Number(chatId);
    })
  );

  //const messages = useSelector((state) => state.messages[Number(chatId)].messages);

  const getMessages = useActionWithDeferred(getMessagesAction);

  const page = {
    offset: 0,
    limit: 10
  };

  useEffect(() => {
    if (dialog) {
      getMessages({
        page,
        dialog,
        initiatedByScrolling: false
      });
      console.log(1);
    }
  });

  return (
    <div className="messenger__messages-list">
      <div className="messenger__messages-container">
        <Message from={messageFrom.me} content="12345" time="20:20" />
      </div>
    </div>
  );
};

export default Chat;
