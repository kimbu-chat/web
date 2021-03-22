import React, { useEffect } from 'react';
import { Route } from 'react-router';
import './chat.scss';
import {
  FriendList,
  CallList,
  RoutingChats,
  ActiveCall,
  IncomingCall,
  InternetError,
  ChatInfoRightPanel,
  CreateMessageInput,
  ChatList,
  ChatTopBar,
  SearchTop,
  MessageList,
  NotContact,
  BlockedMessageInput,
  AddFriend,
  AddCall,
  SettingsNavigation,
} from '@components';
import { useSelector } from 'react-redux';
import { amICalledSelector as isCallingMe, amICallingSelector, doIhaveCallSelector } from '@store/calls/selectors';
import { CSSTransition } from 'react-transition-group';
import { getIsInfoOpenedSelector } from '@store/chats/selectors';
import { getInternetStateSelector } from '@store/internet/selectors';
import { EditProfile } from '@app/components/messenger-page/settings-modal/edit-profile/edit-profile';
import { LanguageSettings } from '@app/components/messenger-page/settings-modal/language-settings/language-settings';
import { NotificationsSettings } from '@app/components/messenger-page/settings-modal/notifications-settings/notifications-settings';
import { KeyBindings } from '@app/components/messenger-page/settings-modal/key-bindings/key-bindings';
import { Appearance } from '@app/components/messenger-page/settings-modal/appearance/appearance';

interface IChatProps {
  preloadNext: () => void;
}

const Chat: React.FC<IChatProps> = React.memo(({ preloadNext }) => {
  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);

  const internetState = useSelector(getInternetStateSelector);
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  useEffect(() => {
    preloadNext();
  }, []);

  return (
    <div className='messenger'>
      {amICalledSelector && <IncomingCall />}
      {(amISpeaking || amICallingSelectorSomebody) && <ActiveCall />}
      {!internetState && <InternetError />}

      <RoutingChats />

      <Route path='/calls'>
        <div className='messenger__calls'>
          <SearchTop searchFor='calls' />
          <CallList />
        </div>
        <div className='messenger__main-data'>
          <AddCall />
        </div>
      </Route>

      <Route path='/chats/:chatId?/'>
        <div className='messenger__chats'>
          <SearchTop searchFor='chats' />
          <ChatList />
        </div>
        <div className='messenger__chat-send'>
          <MessageList />
          {true ? <CreateMessageInput /> : <BlockedMessageInput />}
          {false && <NotContact />}
        </div>
        <ChatTopBar />
        <CSSTransition in={isInfoOpened} timeout={200} classNames='chat-info-slide' unmountOnExit>
          <div className='messenger__info'>
            <ChatInfoRightPanel />
          </div>
        </CSSTransition>
      </Route>

      <Route path='/contacts/'>
        <div className='messenger__friends'>
          <SearchTop searchFor='friends' />
          <FriendList />
        </div>
        <div className='messenger__main-data'>
          <AddFriend />
        </div>
      </Route>

      <Route path='/settings/'>
        <div className='messenger__settings-navigation'>
          <SettingsNavigation />
        </div>
        <div className='messenger__settings-data'>
          <Route path='/settings/profile'>
            <EditProfile />
          </Route>

          <Route path='/settings/notifications'>
            <NotificationsSettings />
          </Route>

          <Route path='/settings/language'>
            <LanguageSettings />
          </Route>

          <Route path='/settings/typing'>
            <KeyBindings />
          </Route>

          <Route path='/settings/appearance'>
            <Appearance />
          </Route>
        </div>
      </Route>
    </div>
  );
});

export default Chat;
