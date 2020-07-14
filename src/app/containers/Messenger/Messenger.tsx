import React, { useRef, useState, useEffect } from 'react';
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
import ChatInfo from '../../components/MessengerPage/ChatInfo/ChatInfo';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { changeSelectedDialogAction } from 'app/store/dialogs/actions';

const Messenger = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const createChatRef = useRef<HTMLDivElement>(null);
  const [createChatDisplayed, setCreateChatDisplayed] = useState<boolean>(false);
  const [infoDisplayed, setInfoDisplayed] = useState<boolean>(false);
  const changeSelectedDialog = useActionWithDispatch(changeSelectedDialogAction);
  const { id: chatId } = useParams();

  useEffect(() => {
    changeSelectedDialog(Number(chatId));
  }, []);

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

  const displayChatInfo = () => {
    setInfoDisplayed(!infoDisplayed);
  };

  return (
    <div className="messenger">
      <SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />
      <BackgroundBlur />
      <AccountInfo ref={sliderRef} hideSlider={hideSlider} displayCreateChat={displayCreateChat} />
      <ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />
      <ChatList />
      {createChatDisplayed ? (
        <CreateChat ref={createChatRef} hide={hideCreateChat} />
      ) : (
        <div className="messenger__chat-send">
          <Chat />
          <CreateMessageInput />
          {infoDisplayed && <ChatInfo displayCreateChat={displayCreateChat} />}
        </div>
      )}
    </div>
  );
};

export default Messenger;
