import partialRight from 'lodash/partialRight';

import { LazyPreload, preloadRouteComponent } from '@routing/preloading.utils';
import {
  CALLS_PATH,
  CONTACTS_PATH,
  INSTANT_MESSAGING_CHAT_PATH,
  REGISTERED_USER,
  SETTINGS_PATH,
} from '@routing/routing.constants';
import { MainRoutesEnum, MainRoutesObject } from '@routing/routing.types';
import withPageGuard from '@routing/with-page-guard';
import { store, StoreKeys } from '@store';

const ChatPage = LazyPreload(() => import('@pages/chat/chat'));

const ContactsPage = LazyPreload(() => import('@pages/contacts'));

const CallsPage = LazyPreload(() =>
  import('@store/calls/module').then((module) => {
    store.inject([[StoreKeys.CALLS, module.reducer, module.callsSaga]]);
    return import('@pages/calls');
  }),
);

const SettingsRouter = LazyPreload(() => import('@routing/settings-router'));

const MainRoutes: MainRoutesObject = {
  [MainRoutesEnum.INSTANT_MESSAGING_CHAT]: {
    path: INSTANT_MESSAGING_CHAT_PATH,
    pageName: 'Chat',
    props: {
      component: withPageGuard([REGISTERED_USER])(ChatPage),
      exact: true,
    },
  },
  [MainRoutesEnum.CALLS]: {
    path: CALLS_PATH,
    pageName: 'Calls',
    props: {
      component: withPageGuard([REGISTERED_USER])(CallsPage),
    },
  },
  [MainRoutesEnum.CONTACTS]: {
    path: CONTACTS_PATH,
    pageName: 'Contacts',
    props: {
      component: ContactsPage,
    },
  },
  [MainRoutesEnum.SETTINGS]: {
    path: SETTINGS_PATH,
    pageName: 'Settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(SettingsRouter),
    },
  },
};

export const routes = Object.values(MainRoutes);

export const preloadMainRoute = partialRight(preloadRouteComponent, routes);
