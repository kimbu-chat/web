import React, { useContext, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import './messenger.scss';
import {
  EditMessage,
  SettingsHeader,
  FriendList,
  Settings,
  CallList,
  RoutingChats,
  ActiveCall,
  IncomingCall,
  InternetError,
  ChatInfo,
  CreateMessageInput,
  Chat,
  ChatList,
  ChatData,
  SearchTop,
} from 'components';
import { useSelector } from 'react-redux';
import { amICalledSelector as isCallingMe, amICallingSelector, doIhaveCallSelector } from 'store/calls/selectors';
import { CSSTransition } from 'react-transition-group';
import { LocalizationContext } from 'app/app';
import { getMessageToEditSelector, getSelectedChatIdSelector, getIsInfoOpenedSelector } from 'store/chats/selectors';
import { getInternetStateSelector } from 'app/store/internet/selectors';

interface IMessengerProps {
  preloadNext: () => void;
}

const Messenger: React.FC<IMessengerProps> = React.memo(({ preloadNext }) => {
  const { t } = useContext(LocalizationContext);

  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);
  const messageToEdit = useSelector(getMessageToEditSelector);
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

      <Switch>
        <Route exact path='/settings/edit-profile'>
          <SettingsHeader title={t('settings.edit_profile')} />
        </Route>

        <Route exact path='/settings/notifications'>
          <SettingsHeader title={t('settings.notifications')} />
        </Route>

        <Route exact path='/settings/language'>
          <SettingsHeader title={t('settings.language')} />
        </Route>

        <Route exact path='/settings/typing'>
          <SettingsHeader title={t('settings.text_typing')} />
        </Route>

        <Route path='/'>
          <Redirect to={`/chats${selectedChatId ? `/${selectedChatId}` : ''}`} />
        </Route>
      </Switch>

      <RoutingChats />

      <div className='messenger__chat-list'>
        <div className='messenger__chat-list__animated'>
          <Route path='/calls'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <CallList />
              </CSSTransition>
            )}
          </Route>

          <Route path='/settings/(edit-profile|notifications|language|typing)?'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <Settings />
              </CSSTransition>
            )}
          </Route>

          <Route path='/chats/:chatId?'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <div className='messenger__chats'>
                  <SearchTop />
                  <ChatList />
                </div>
              </CSSTransition>
            )}
          </Route>

          <Route path='/contacts/:chatId?'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <div className='messenger__chats'>
                  <FriendList />
                </div>
              </CSSTransition>
            )}
          </Route>
        </div>
      </div>

      <ChatData />

      <div className='messenger__chat-send'>
        <Chat />
        {!messageToEdit && <CreateMessageInput />}
        {messageToEdit && <EditMessage />}
      </div>

      <CSSTransition in={isInfoOpened} timeout={200} classNames='chat-info-slide' unmountOnExit>
        <div className='messenger__info'>
          <ChatInfo />
        </div>
      </CSSTransition>
    </div>
  );
});

export default Messenger;
