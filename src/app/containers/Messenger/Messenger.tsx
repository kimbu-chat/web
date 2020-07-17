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
import ContactSearch from '../../components/MessengerPage/ContactSearch/ContactSearch';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { changeSelectedDialogAction } from 'app/store/dialogs/actions';

const Messenger = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const createChatRef = useRef<HTMLDivElement>(null);
  const contactSearchRef = useRef<HTMLDivElement>(null);

  const [createChatDisplayed, setCreateChatDisplayed] = useState<boolean>(false);
  const [contactSearchDisplayed, setContactSearchDisplayed] = useState<boolean>(false);
  const [infoDisplayed, setInfoDisplayed] = useState<boolean>(false);

  const changeSelectedDialog = useActionWithDispatch(changeSelectedDialogAction);

  const { id: chatId } = useParams();

  useEffect(() => {
    if (chatId) changeSelectedDialog(Number(chatId));
    else changeSelectedDialog(-1);
  }, []);

  const displaySlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '0px';
  };

  const hideSlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '-280px';
  };

  //Create chat display and hide

  const displayCreateChat = () => {
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

      setTimeout(() => {
        setCreateChatDisplayed(false);
      }, 600);
    }
  };

  //Contact search display and hide

  const displayContactSearch = () => {
    setContactSearchDisplayed(true);
    setTimeout(() => {
      if (contactSearchRef.current) {
        contactSearchRef.current.style.visibility = 'visible';
        contactSearchRef.current.style.opacity = '1';
        contactSearchRef.current.style.left = '0';
      }
    }, 1);
  };

  const hideContactSearch = () => {
    if (contactSearchRef.current) {
      contactSearchRef.current.style.visibility = 'hidden';
      contactSearchRef.current.style.opacity = '0';
      contactSearchRef.current.style.left = '-150px';

      setTimeout(() => {
        setContactSearchDisplayed(false);
      }, 600);
    }
  };

  const displayChatInfo = () => {
    setInfoDisplayed(!infoDisplayed);
  };

  return (
    <div className="messenger">
      <SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />
      {(createChatDisplayed || contactSearchDisplayed) && (
        <BackgroundBlur
          onClick={() => {
            hideCreateChat();
            hideContactSearch();
          }}
        />
      )}
      <AccountInfo
        ref={sliderRef}
        hideSlider={hideSlider}
        displayCreateChat={displayCreateChat}
        displayContactSearch={displayContactSearch}
      />
      <ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />
      <ChatList />
      {createChatDisplayed && <CreateChat ref={createChatRef} hide={hideCreateChat} />}
      {contactSearchDisplayed && <ContactSearch hide={hideContactSearch} ref={contactSearchRef} />}

      {!createChatDisplayed && !contactSearchDisplayed && (
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
