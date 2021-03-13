import React, { useEffect } from 'react';
import { Route } from 'react-router';
import './chat.scss';
import {
  EditMessage,
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
} from 'components';
import { useSelector } from 'react-redux';
import { amICalledSelector as isCallingMe, amICallingSelector, doIhaveCallSelector } from 'store/calls/selectors';
import { CSSTransition } from 'react-transition-group';
import { getMessageToEditSelector, getIsInfoOpenedSelector } from 'store/chats/selectors';
import { getInternetStateSelector } from 'app/store/internet/selectors';

interface IChatProps {
  preloadNext: () => void;
}

const Chat: React.FC<IChatProps> = React.memo(({ preloadNext }) => {
  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);
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

      <RoutingChats />

      <div className='messenger__chat-list'>
        <Route path='/calls'>
          <CallList />
        </Route>

        <Route path='/chats/:chatId?/'>
          <div className='messenger__chats'>
            <SearchTop />
            <ChatList />
          </div>
        </Route>

        <Route path='/contacts/:chatId?/'>
          <div className='messenger__chats'>
            <FriendList />
          </div>
        </Route>
      </div>

      <ChatTopBar />

      <div className='messenger__chat-send'>
        <MessageList />
        {!messageToEdit && <CreateMessageInput />}
        {messageToEdit && <EditMessage />}
      </div>

      <CSSTransition in={isInfoOpened} timeout={200} classNames='chat-info-slide' unmountOnExit>
        <div className='messenger__info'>
          <ChatInfoRightPanel />
        </div>
      </CSSTransition>
    </div>
  );
});

export default Chat;
