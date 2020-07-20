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

export namespace Messenger {
  export interface contactSearchActions {
    isDisplayed: boolean;
    isSelectable?: boolean;
    onSubmit?: (userIds: number[]) => void;
    displayMyself?: boolean;
    excludeIds?: (number | undefined)[];
  }

  export interface optionalContactSearchActions {
    isSelectable?: boolean;
    onSubmit?: (userIds: number[]) => void;
    displayMyself?: boolean;
    excludeIds?: (number | undefined)[];
  }

  export interface displayedOrNot {
    isDisplayed: boolean;
  }
}

const Messenger = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const createChatRef = useRef<HTMLDivElement>(null);
  const contactSearchRef = useRef<HTMLDivElement>(null);

  const [createChatDisplayed, setCreateChatDisplayed] = useState<Messenger.displayedOrNot>({ isDisplayed: false });
  const [contactSearchDisplayed, setContactSearchDisplayed] = useState<Messenger.contactSearchActions>({
    isDisplayed: false
  });
  const [infoDisplayed, setInfoDisplayed] = useState<boolean>(false);
  const [accountInfoIsDisplayed, setAccountInfoIsDisplayed] = useState<Messenger.displayedOrNot>({
    isDisplayed: false
  });

  const changeSelectedDialog = useActionWithDispatch(changeSelectedDialogAction);

  const { id: chatId } = useParams();

  useEffect(() => {
    if (chatId) changeSelectedDialog(Number(chatId));
    else changeSelectedDialog(-1);
  }, []);

  //Slider display and hide

  const displaySlider = () => {
    setAccountInfoIsDisplayed({ isDisplayed: true });
    setTimeout(() => {
      if (sliderRef.current) sliderRef.current.style.left = '0px';
    }, 1);
  };

  const hideSlider = () => {
    if (sliderRef.current) sliderRef.current.style.left = '-280px';
    setTimeout(() => {
      setAccountInfoIsDisplayed({ isDisplayed: false });
    }, 600);
  };

  //Create chat display and hide

  const displayCreateChat = () => {
    setCreateChatDisplayed({ isDisplayed: true });
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
        setCreateChatDisplayed({ isDisplayed: false });
      }, 600);
    }
  };

  //Contact search display and hide

  const displayContactSearch = (actions?: Messenger.contactSearchActions) => {
    setContactSearchDisplayed({ isDisplayed: true, ...actions });
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
        setContactSearchDisplayed({ isDisplayed: false });
      }, 600);
    }
  };

  //Chat info display and hide

  const displayChatInfo = () => {
    setInfoDisplayed(!infoDisplayed);
  };

  const hideChatInfo = () => {
    setInfoDisplayed(false);
  };

  return (
    <div className="messenger">
      <SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />

      {(createChatDisplayed.isDisplayed ||
        contactSearchDisplayed.isDisplayed ||
        accountInfoIsDisplayed.isDisplayed) && (
        <BackgroundBlur
          onClick={() => {
            hideCreateChat();
            hideContactSearch();
            hideSlider();
          }}
        />
      )}

      {accountInfoIsDisplayed.isDisplayed && (
        <AccountInfo
          ref={sliderRef}
          hideSlider={hideSlider}
          displayCreateChat={displayCreateChat}
          displayContactSearch={displayContactSearch}
        />
      )}

      <ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />

      <ChatList hideChatInfo={hideChatInfo} />
      {createChatDisplayed.isDisplayed && <CreateChat ref={createChatRef} hide={hideCreateChat} />}
      {contactSearchDisplayed.isDisplayed && (
        <ContactSearch hide={hideContactSearch} ref={contactSearchRef} {...contactSearchDisplayed} />
      )}

      {!createChatDisplayed.isDisplayed && !contactSearchDisplayed.isDisplayed && (
        <div className="messenger__chat-send">
          <Chat />
          <CreateMessageInput />
          {infoDisplayed && (
            <ChatInfo
              displayCreateChat={displayCreateChat}
              displayContactSearch={displayContactSearch}
              hideContactSearch={hideContactSearch}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Messenger;
