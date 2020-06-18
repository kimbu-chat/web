import React from 'react';

import './Messenger.scss';
import SearchTop from '../../components/MessengerPage/SearchTop/SearchTop';
import ChatData from '../../components/MessengerPage/ChatData/ChatData';

const Messenger = () => {
  return (
    <div className="messenger">
      <SearchTop />
      <ChatData
        contact="Eternal Eagle"
        imageUrl="https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg"
        suplimentData="123456"
      />
      {/* <ChatsContainer />
    
    <Chat />
    <SendMessage /> */}
    </div>
  );
};

export default Messenger;
