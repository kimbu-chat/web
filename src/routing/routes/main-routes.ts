import React from 'react';

import partialRight from 'lodash/partialRight';
import { Route } from 'react-router';

import { MessageList } from '@components/message-list';
import { LazyPreload, preloadRouteComponent } from '@routing/preloading.utils';
import { CALLS_PATH, CONTACTS_PATH, REGISTERED_USER, SETTINGS_PATH, LOGOUT_PATH, INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { MainRoutesEnum, MainRoutesObject } from '@routing/routing.types';
import withPageGuard from '@routing/with-page-guard';
import { store, StoreKeys } from '@store';

/* ------------- LazyLoading ------------- */
const ChatPage = LazyPreload(() => import('@pages/chat/chat'));

const Welcome = LazyPreload(() => import('@components/welcome/welcome'));

const ContactsPage = LazyPreload(() => import('@pages/contacts'));

const LogoutPage = LazyPreload(() => import('@pages/logout'));

const SettingsRouter = LazyPreload(() => import('@routing/settings-router'));

const CallsPage = LazyPreload(() =>
  import('@store/calls/module').then((module) => {
    store.inject([[StoreKeys.CALLS, module.reducer, module.callsSaga]]);
    return import('@pages/calls');
  }),
);

/* ------------- Routes ------------- */
const MainRoutes: MainRoutesObject = {
  [MainRoutesEnum.INSTANT_MESSAGING_CHAT]: {
    path: INSTANT_MESSAGING_PATH,
    pageName: 'Chat',
    props: {
      element: withPageGuard([REGISTERED_USER])(ChatPage),
      children: [
        React.createElement(Route, { key: '1', index: true, element: React.createElement(Welcome) }),
        React.createElement(Route, { key: '2', path: ':id', element: React.createElement(MessageList) }),
        React.createElement(Route, { key: '3', path: '*', element: React.createElement(Welcome) }),
      ],
    },
  },
  [MainRoutesEnum.CALLS]: {
    path: CALLS_PATH,
    pageName: 'Calls',
    props: {
      element: withPageGuard([REGISTERED_USER])(CallsPage),
      children: React.createElement(Route, { path: '*', element: React.createElement(CallsPage) }),
    },
  },
  [MainRoutesEnum.CONTACTS]: {
    path: CONTACTS_PATH,
    pageName: 'Contacts',
    props: {
      element: ContactsPage,
      children: React.createElement(Route, { path: '*', element: React.createElement(ContactsPage) }),
    },
  },
  [MainRoutesEnum.SETTINGS]: {
    path: `${SETTINGS_PATH}/*`,
    pageName: 'Settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(SettingsRouter),
    },
  },
  [MainRoutesEnum.LOGOUT]: {
    path: LOGOUT_PATH,
    pageName: 'Logout',
    props: {
      element: withPageGuard([REGISTERED_USER])(LogoutPage),
    },
  },
};

export const routes = Object.values(MainRoutes);

export const preloadMainRoute = partialRight(preloadRouteComponent, routes);
