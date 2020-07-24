import React, { useState, useEffect } from 'react';
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
import ChangePhoto from '../../components/MessengerPage/ChangePhoto/ChangePhoto';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { changeSelectedDialogAction } from 'app/store/dialogs/actions';
import { AvatarSelectedData } from 'app/store/user/interfaces';

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

  export interface photoSelect {
    isDisplayed?: boolean;
    onSubmit?: (data: AvatarSelectedData) => void;
  }
}

const Messenger = () => {
  const changeSelectedDialog = useActionWithDispatch(changeSelectedDialogAction);

  const { id: chatId } = useParams();

  useEffect(() => {
    if (chatId) changeSelectedDialog(Number(chatId));
    else changeSelectedDialog(-1);
  }, []);

  const [createChatDisplayed, setCreateChatDisplayed] = useState<Messenger.displayedOrNot>({ isDisplayed: false });
  const [contactSearchDisplayed, setContactSearchDisplayed] = useState<Messenger.contactSearchActions>({
    isDisplayed: false
  });
  const [infoDisplayed, setInfoDisplayed] = useState<boolean>(false);
  const [accountInfoIsDisplayed, setAccountInfoIsDisplayed] = useState<Messenger.displayedOrNot>({
    isDisplayed: false
  });
  const [photoSelected, setPhotoSelected] = useState<Messenger.photoSelect>({
    isDisplayed: false
  });
  const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>('');

  //Slider display and hide
  const displaySlider = () => {
    setAccountInfoIsDisplayed({ isDisplayed: true });
  };
  const hideSlider = () => {
    setAccountInfoIsDisplayed({ isDisplayed: false });
  };

  //Create chat display and hide
  const displayCreateChat = () => {
    setCreateChatDisplayed({ isDisplayed: true });
  };
  const hideCreateChat = () => {
    setCreateChatDisplayed({ isDisplayed: false });
  };

  //Contact search display and hide
  const displayContactSearch = (actions?: Messenger.contactSearchActions) => {
    setContactSearchDisplayed({ isDisplayed: true, ...actions });
  };
  const hideContactSearch = () => {
    setContactSearchDisplayed({ isDisplayed: false });
  };

  //Chat info display and hide
  const displayChatInfo = () => {
    setInfoDisplayed(!infoDisplayed);
  };
  const hideChatInfo = () => {
    setInfoDisplayed(false);
  };

  //Cropper display and hide
  const hideChangePhoto = () => setPhotoSelected({ isDisplayed: false });
  const displayChangePhoto = ({ onSubmit }: Messenger.photoSelect) => {
    setPhotoSelected({ ...photoSelected, isDisplayed: true, onSubmit });
    hideContactSearch();
    hideSlider();
  };

  return (
    <div className="messenger">
      <SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />

      {photoSelected.isDisplayed && (
        <ChangePhoto imageUrl={imageUrl} hideChangePhoto={hideChangePhoto} onSubmit={photoSelected.onSubmit} />
      )}

      {(createChatDisplayed.isDisplayed ||
        contactSearchDisplayed.isDisplayed ||
        accountInfoIsDisplayed.isDisplayed ||
        photoSelected.isDisplayed) && (
        <BackgroundBlur
          onClick={() => {
            hideCreateChat();
            hideContactSearch();
            hideSlider();
            hideChangePhoto();
          }}
        />
      )}

      <AccountInfo
        hideSlider={hideSlider}
        displayCreateChat={displayCreateChat}
        displayContactSearch={displayContactSearch}
        setImageUrl={setImageUrl}
        displayChangePhoto={displayChangePhoto}
        isDisplayed={accountInfoIsDisplayed.isDisplayed}
      />

      <ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />

      <ChatList hideChatInfo={hideChatInfo} />

      <CreateChat
        setImageUrl={setImageUrl}
        displayChangePhoto={displayChangePhoto}
        hide={hideCreateChat}
        isDisplayed={createChatDisplayed.isDisplayed}
      />

      <ContactSearch hide={hideContactSearch} {...contactSearchDisplayed} />

      {!createChatDisplayed.isDisplayed && !contactSearchDisplayed.isDisplayed && (
        <div className="messenger__chat-send">
          <Chat />
          <CreateMessageInput />
          <ChatInfo
            displayCreateChat={displayCreateChat}
            displayContactSearch={displayContactSearch}
            hideContactSearch={hideContactSearch}
            setImageUrl={setImageUrl}
            displayChangePhoto={displayChangePhoto}
            isDisplayed={infoDisplayed}
          />
        </div>
      )}
    </div>
  );
};

export default Messenger;
