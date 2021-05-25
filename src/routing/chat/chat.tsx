import React, { lazy, useEffect, Suspense } from 'react';
import { Route } from 'react-router';
import { useDispatch } from 'react-redux';

import { useDragDrop } from '@hooks/use-drag-drop';
import { RoutingChats } from '@components/routing-chats';
import { AppInit } from '@store/initiation/features/app-init/app-init';

import './chat.scss';

interface IChatProps {
  preloadNext: () => void;
  store: any;
}

const Chat: React.FC<IChatProps> = ({ preloadNext, store }) => {
  console.log('CHAAAAAAAAAAAAT');

  const { onDrop, onDragLeave, onDragEnter, onDragOver, isDragging } = useDragDrop();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AppInit.action());
  }, [dispatch]);

  const CallsPage = lazy(() =>
    import('@store/calls/module').then((module) => {
      store.injectReducer('calls', module.reducer);
      store.injectSaga('calls', module.callsSaga);

      return import('@pages/calls');
    }),
  );

  const Call = lazy(async () => {
    const callModule = await import('@store/calls/module');

    store.injectReducer('calls', callModule.reducer);
    store.injectSaga('calls', callModule.callsSaga);

    return import('@pages/call/call');
  });

  const ChatPage = lazy(() => import('@pages/chat/chat'));

  const ContactsPage = lazy(async () => {
    const friendsModule = await import('@store/friends/module');
    store.injectReducer('friends', friendsModule.reducer);
    store.injectSaga('friends', friendsModule.FriendSagas);

    const usersModule = await import('@store/users/module');
    store.injectReducer('users', usersModule.reducer);
    store.injectSaga('users', usersModule.usersSaga);

    return import('@pages/contacts');
  });

  const SettingsRouter = lazy(() =>
    import('@store/settings/module').then((module) => {
      store.injectReducer(module.reducer);
      store.injectSaga(module.settingsSaga);

      return import('../settings-router');
    }),
  );

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
      <Call />
      {/* TODO: FIX THIS LATER!!! */}
      {/* {!internetState && <InternetError />} */}

      {/* <RoutingChats /> */}

      <RoutingChats />

      <Route path="/calls">
        <Suspense fallback={<span>Loading...</span>}>
          <CallsPage />
        </Suspense>
      </Route>

      <Route path="/chats/:chatId?/">
        <Suspense fallback={<span>Loading...</span>}>
          <ChatPage isDragging={isDragging} />
        </Suspense>
      </Route>

      <Route path="/contacts/">
        <Suspense fallback={<span>Loading...</span>}>
          <ContactsPage />
        </Suspense>
      </Route>

      <Route path="/settings/">
        <Suspense fallback={<span>Loading...</span>}>
          <SettingsRouter />
        </Suspense>
      </Route>
    </div>
  );
};

Chat.displayName = 'Chat';

export default Chat;
