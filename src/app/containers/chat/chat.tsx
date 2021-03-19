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
} from 'components';
import { useSelector } from 'react-redux';
import { amICalledSelector as isCallingMe, amICallingSelector, doIhaveCallSelector } from 'store/calls/selectors';
import { CSSTransition } from 'react-transition-group';
import { getIsInfoOpenedSelector } from 'store/chats/selectors';
import { getInternetStateSelector } from 'app/store/internet/selectors';
import { AddFriend } from 'app/components/messenger-page/friend-list/add-friend/add-friend';

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
      </Route>

      <Route path='/chats/:chatId?/'>
        <div className='messenger__chats'>
          <SearchTop searchFor='chats' />
          <ChatList />
        </div>
        <div className='messenger__chat-send'>
          <MessageList />
          <CreateMessageInput />
        </div>
        <ChatTopBar />
        co
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
        <div className='messenger__add-contact'>
          <AddFriend />
        </div>
      </Route>
    </div>
  );
});

export default Chat;
