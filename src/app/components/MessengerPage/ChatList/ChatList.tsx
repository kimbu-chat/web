import React from 'react';
import ChatFromList from '../ChatFromList/ChatFromList';

import './ChatList.scss';

namespace ChatList {
  export interface Props {
    chats?: {
      photo: string;
      name: string;
      lastPhoto: string;
      lastMessage: string;
      lastTime: string;
      count?: number;
    }[];
  }
}

const ChatList = ({ chats }: ChatList.Props) => {
  return (
    <div className="messenger__chat-list">
      {chats?.map(({ photo, name, lastPhoto, lastMessage, lastTime, count }) => {
        return (
          <ChatFromList
            photo={photo}
            name={name}
            lastPhoto={lastPhoto}
            lastMessage={lastMessage}
            lastTime={lastTime}
            count={count}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
