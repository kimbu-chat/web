import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { getMessagesAction } from '../../../store/messages/actions';
import InfiniteScroll from 'react-infinite-scroller';
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
  const hasMoreMessages = useSelector<AppState, boolean>(
    (state) => state.messages.messages.find((x) => x.dialogId == chatId)?.hasMoreMessages as boolean
  );
  const myId = useSelector<AppState, number>((state) => state.auth.authentication.userId);
  const messagesContainerRef = useRef(null);

  const loadPage = (page: number) => {
    const pageData = {
      limit: 25,
      offset: page * 25
    };

    if (selectedDialog) {
      getMessages({
        page: pageData,
        dialog: selectedDialog,
        initiatedByScrolling: false
      });
    }
  };

  useEffect(() => {
    loadPage(0);
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
      <div ref={messagesContainerRef} className="messenger__messages-container">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadPage}
          hasMore={hasMoreMessages}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
          getScrollParent={() => messagesContainerRef.current}
          isReverse={true}
        >
          {messages
            .map((msg) => {
              return (
                <MessageItem
                  key={msg.id}
                  from={messageIsFrom(msg.userCreator.id)}
                  content={msg.text}
                  time={`${new Date(msg.creationDateTime ? msg.creationDateTime : 0).getUTCHours()}:${new Date(
                    msg.creationDateTime ? msg.creationDateTime : 0
                  ).getUTCMinutes()}`}
                />
              );
            })
            .reverse()}
        </InfiniteScroll>
      </div>
      {selectedDialog.isInterlocutorTyping && (
        <div className="messenger__typing-notification">{`${selectedDialog.interlocutor?.firstName} ${selectedDialog.interlocutor?.lastName} печатает...`}</div>
      )}
    </div>
  );
};

export default Chat;
