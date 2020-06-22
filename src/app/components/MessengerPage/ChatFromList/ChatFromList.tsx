import React from 'react';

import './ChatFromList.scss';

namespace ChatFromList {
  export interface Props {
    photo: string;
    name: string;
    lastPhoto: string;
    lastMessage: string;
    lastTime: string;
    count?: number;
  }
}

const ChatFromList = ({ photo, name, lastPhoto, lastMessage, lastTime, count = 0 }: ChatFromList.Props) => {
  return (
    <button className="messenger__chat-block">
      <div className="messenger__active-line"></div>
      <img src={photo} alt="" className="messenger__chat-img" />
      <div className="messenger__name-and-message">
        <div className="messenger__name">{name}</div>
        <div className="flat">
          <img src={lastPhoto} alt="" className="messenger__last-photo" />
          <div className="messenger__last-message">{lastMessage}</div>
        </div>
      </div>
      <div className="messenger__time-and-count">
        <div className="messenger__time">{lastTime}</div>
        <div className="messenger__count">{count}</div>
      </div>
    </button>
  );
};

export default ChatFromList;
