import React, { useRef } from 'react';
import { useParams } from 'react-router';
import './Messenger.scss';
import SearchTop from '../../components/MessengerPage/SearchTop/SearchTop';
import ChatData from '../../components/MessengerPage/ChatData/ChatData';
import ChatList from '../../components/MessengerPage/ChatList/ChatList';
import Chat from '../../components/MessengerPage/Chat/Chat';
import CreateMessageInput from '../../components/MessengerPage/create-message-input/Index';
import AccountInfo from '../AccountInfo/AccountInfo';
import BackgroundBlur from '../../utils/BackgroundBlur';

const Messenger = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { id: chatId } = useParams();

  const displaySlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '0px';
  };

  const hideSlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '-280px';
  };

  return (
    <div className="messenger">
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
        <Chat chatId={Number(chatId)} />
        <CreateMessageInput />
      </div>
    </div>
  );
};

export default Messenger;
