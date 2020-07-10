import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import './Messenger.scss';
import SearchTop from '../../components/MessengerPage/SearchTop/SearchTop';
import ChatData from '../../components/MessengerPage/ChatData/ChatData';
import ChatList from '../../components/MessengerPage/ChatList/ChatList';
import Chat from '../../components/MessengerPage/Chat/Chat';
import CreateMessageInput from '../../components/MessengerPage/create-message-input/Index';
import AccountInfo from '../AccountInfo/AccountInfo';
import BackgroundBlur from '../../utils/BackgroundBlur';
import CreateChat from '../../components/MessengerPage/CreateChat/CreateChat';

const Messenger = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const createChatRef = useRef<HTMLDivElement>(null);
  const [createChatDisplayed, setCreateChatDisplayed] = useState<boolean>(false);

  const { id: chatId } = useParams();

  const displaySlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '0px';
  };

  const hideSlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '-280px';
  };

  const displayCreateChat = () => {
    console.log(123);
    setCreateChatDisplayed(true);
    setTimeout(() => {
      if (createChatRef.current) {
        createChatRef.current.style.visibility = 'visible';
        createChatRef.current.style.opacity = '1';
        createChatRef.current.style.left = '0';
      }
    }, 1);
  };

  const hideCreateChat = () => {
    if (createChatRef.current) {
      createChatRef.current.style.visibility = 'hidden';
      createChatRef.current.style.opacity = '0';
      createChatRef.current.style.left = '-150px';
      console.log(789);

      setTimeout(() => {
        setCreateChatDisplayed(false);
      }, 600);
    }
  };

  return (
    <div className="messenger">
      <SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />
      <BackgroundBlur />
      <AccountInfo ref={sliderRef} hideSlider={hideSlider} />
      <ChatData />
      <ChatList />
      {createChatDisplayed ? (
        <CreateChat ref={createChatRef} hide={hideCreateChat} />
      ) : (
        <div className="messenger__chat-send">
          <Chat chatId={Number(chatId)} />
          <CreateMessageInput />
        </div>
      )}
    </div>
  );
};

export default Messenger;
