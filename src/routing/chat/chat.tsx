import React, { useEffect } from 'react';
import { Route } from 'react-router';
import { useSelector } from 'react-redux';

import { RoutingChats, ActiveCall, IncomingCall, InternetError } from '@components';
import {
  amICalledSelector as isCallingMe,
  amICallingSelector,
  doIhaveCallSelector,
} from '@store/calls/selectors';
import { getInternetStateSelector } from '@store/internet/selectors';
import { useDragDrop } from '@hooks/use-drag-drop';
import { ChatPage } from '@pages/chat';
import { CallsPage } from '@pages/calls';
import { ContactsPage } from '@pages/contacts';

import { SettingsRouter } from '../settings-router';

import './chat.scss';

interface IChatProps {
  preloadNext: () => void;
}

const Chat: React.FC<IChatProps> = ({ preloadNext }) => {
  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);

  const internetState = useSelector(getInternetStateSelector);

  const { onDrop, onDragLeave, onDragEnter, onDragOver, isDragging } = useDragDrop();

  useEffect(() => {
    preloadNext();
  }, [preloadNext]);

  return (
    <div
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="messenger">
      {amICalledSelector && <IncomingCall />}
      {(amISpeaking || amICallingSelectorSomebody) && <ActiveCall />}
      {!internetState && <InternetError />}

      <RoutingChats />

      <Route path="/calls">
        <CallsPage />
      </Route>

      <Route path="/chats/:chatId?/">
        <ChatPage isDragging={isDragging} />
      </Route>

      <Route path="/contacts/">
        <ContactsPage />
      </Route>

      <Route path="/settings/">
        <SettingsRouter />
      </Route>
    </div>
  );
};

Chat.displayName = 'Chat';

export default Chat;
