import React, { useContext } from 'react';
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
import { getMessageToEditSelector, getSelectedChatIdSelector } from 'store/chats/selectors';
import { getInternetStateSelector } from 'app/store/internet/selectors';

const Messenger = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);
  const messageToEdit = useSelector(getMessageToEditSelector);
  const internetState = useSelector(getInternetStateSelector);

  return (
    <div className='messenger'>
      {amICalledSelector && <IncomingCall />}
      {(amISpeaking || amICallingSelectorSomebody) && <ActiveCall />}

      {!internetState && <InternetError />}

      <Switch>
        <Route exact path='/settings/edit-profile/(info)?/(photo|video|audio-recordings|files|audios)?'>
          <SettingsHeader title={t('settings.edit_profile')} />
        </Route>

        <Route exact path='/settings/notifications/(info)?/(photo|video|audio-recordings|files|audios)?'>
          <SettingsHeader title={t('settings.notifications')} />
        </Route>

        <Route exact path='/settings/language/(info)?/(photo|video|audio-recordings|files|audios)?'>
          <SettingsHeader title={t('settings.language')} />
        </Route>

        <Route exact path='/settings/typing/(info)?/(photo|video|audio-recordings|files|audios)?'>
          <SettingsHeader title={t('settings.text_typing')} />
        </Route>

        <Route exact path={['/(calls|settings|chats|contacts)/:chatId?/(info)?/(photo|video|audio-recordings|files|audios)?']}>
          <RoutingChats />
        </Route>

        <Route path='/'>
          <Redirect
            to={{
              pathname: `/chats${selectedChatId ? `/${selectedChatId}` : ''}`,
            }}
          />
        </Route>
      </Switch>

      <div className='messenger__chat-list'>
        <div className='messenger__chat-list__animated'>
          <Route path='/calls/(info)?/(photo|video|audio-recordings|files|audios)?'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <CallList />
              </CSSTransition>
            )}
          </Route>

          <Route path='/settings/(edit-profile|notifications|language|typing)?/(info)?/(photo|video|audio-recordings|files|audios)?'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <Settings />
              </CSSTransition>
            )}
          </Route>

          <Route path='/chats/:chatId?/(info)?/(photo|video|audio-recordings|files|audios)?'>
            {({ match }) => (
              <CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
                <div className='messenger__chats'>
                  <SearchTop />
                  <ChatList />
                </div>
              </CSSTransition>
            )}
          </Route>

          <Route path='/contacts/:chatId?/(info)?/(photo|video|audio-recordings|files|audios)?'>
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

      <Route path='/(contacts|calls|settings|chats)/:chatId?/info'>
        {({ match }) => (
          <CSSTransition in={match != null} timeout={200} classNames='chat-info-slide' unmountOnExit>
            <div className='messenger__info'>
              <ChatInfo />
            </div>
          </CSSTransition>
        )}
      </Route>
    </div>
  );
});

export default Messenger;
