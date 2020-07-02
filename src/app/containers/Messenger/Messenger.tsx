import React, { useRef } from 'react';

import './Messenger.scss';
import SearchTop from '../../components/MessengerPage/SearchTop/SearchTop';
import ChatData from '../../components/MessengerPage/ChatData/ChatData';
import ChatList from '../../components/MessengerPage/ChatList/ChatList';
import Chat from '../../components/MessengerPage/Chat/Chat';
import SendMessage from '../../components/MessengerPage/SendMessage/SendMessage';
import AccountInfo from '../AccountInfo/AccountInfo';
import BackgroundBlur from '../../utils/BackgroundBlur';

namespace Messenger {
  export interface Props {
    id?: number;
  }
}

const Messenger = ({ id }: Messenger.Props) => {
  // const [activeChat, setActiveChat] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const displaySlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '0px';
  };

  const hideSlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '-280px';
  };

  return (
    <div className="messenger">
      {id}
      <SearchTop displaySlider={displaySlider} />
      <BackgroundBlur />
      <AccountInfo ref={sliderRef} hideSlider={hideSlider} />
      <ChatData
        contact="Eternal Eagle"
        imageUrl="https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg"
        suplimentData="123456"
      />
      <ChatList />
      <div className="messenger__chat-send">
        <Chat />
        <SendMessage />
      </div>
    </div>
  );
};

export default Messenger;
