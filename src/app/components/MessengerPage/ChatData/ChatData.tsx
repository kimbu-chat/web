import React from 'react';

import './ChatData.scss';

namespace ChatData {
  export interface Props {
    imageUrl: string;
    contact: string;
    suplimentData: string;
  }
}

const ChatData = ({ imageUrl, contact, suplimentData }: ChatData.Props) => {
  return (
    <div className="messenger__chat-data">
      <div className="messenger__contact-data">
        <img src={imageUrl} alt="" className="messenger__contact-img" />
        <div className="messenger__chat-info">
          <h1>{contact}</h1>
          <p>{suplimentData}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatData;
