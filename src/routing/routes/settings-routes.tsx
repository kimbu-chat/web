import React from 'react';

import partialRight from 'lodash/partialRight';
import { Route } from 'react-router';

import { LazyPreload, preloadRouteComponent } from '@routing/preloading.utils';
import {
  APPEARANCE_SETTINGS_PATH,
  AUDIO_VIDEO_SETTINGS_PATH,
  LANGUAGE_SETTINGS_PATH,
  NOTIFICATIONS_SETTINGS_PATH,
  PRIVACY_SECURITY_SETTINGS_PATH,
  PROFILE_SETTINGS_PATH,
  REGISTERED_USER,
  TYPING_SETTINGS_PATH,
} from '@routing/routing.constants';
import { SettingsRoutesEnum, SettingsRoutesObject } from '@routing/routing.types';
import withPageGuard from '@routing/with-page-guard';

import { deleteLineFromPath } from './utils';

/* ------------- LazyLoading ------------- */
const ProfileSettings = LazyPreload(() => import('@pages/settings/edit-profile'));
const NotificationsSettings = LazyPreload(() => import('@pages/settings/notifications-settings'));
const LanguageSettings = LazyPreload(() => import('@pages/settings/language-settings'));
const KeyBindings = LazyPreload(() => import('@pages/settings/key-bindings'));
const AppearanceSettings = LazyPreload(() => import('@pages/settings/appearance'));
const PrivacySecuritySettings = LazyPreload(() => import('@pages/settings/privacy-security'));
const AudioVideoSettings = LazyPreload(() => import('@pages/settings/audio-video'));

/* ------------- Routes ------------- */
const SettingsRoutes: SettingsRoutesObject = {
  [SettingsRoutesEnum.PROFILE_SETTINGS]: {
    path: deleteLineFromPath(PROFILE_SETTINGS_PATH, '/settings/'),
    pageName: 'Profile settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(ProfileSettings),
      children: <Route path="*" element={<ProfileSettings />} />,
    },
  },
  [SettingsRoutesEnum.APPEARANCE_SETTINGS]: {
    path: deleteLineFromPath(APPEARANCE_SETTINGS_PATH, '/settings/'),
    pageName: 'Appearance settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(AppearanceSettings),
      children: <Route path="*" element={<AppearanceSettings />} />,
    },
  },
  [SettingsRoutesEnum.AUDIO_VIDEO_SETTINGS]: {
    path: deleteLineFromPath(AUDIO_VIDEO_SETTINGS_PATH, '/settings/'),
    pageName: 'Audio video settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(AudioVideoSettings),
      children: <Route path="*" element={<AudioVideoSettings />} />,
    },
  },
  [SettingsRoutesEnum.LANGUAGE_SETTINGS]: {
    path: deleteLineFromPath(LANGUAGE_SETTINGS_PATH, '/settings/'),
    pageName: 'Language settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(LanguageSettings),
      children: <Route path="*" element={<LanguageSettings />} />,
    },
  },
  [SettingsRoutesEnum.NOTIFICATIONS_SETTINGS]: {
    path: deleteLineFromPath(NOTIFICATIONS_SETTINGS_PATH, '/settings/'),
    pageName: 'Notifications settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(NotificationsSettings),
      children: <Route path="*" element={<NotificationsSettings />} />,
    },
  },
  [SettingsRoutesEnum.PRIVACY_SECURITY_SETTINGS]: {
    path: deleteLineFromPath(PRIVACY_SECURITY_SETTINGS_PATH, '/settings/'),
    pageName: 'Privacy and security settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(PrivacySecuritySettings),
      children: <Route path="*" element={<PrivacySecuritySettings />} />,
    },
  },
  [SettingsRoutesEnum.TYPING_SETTINGS]: {
    path: deleteLineFromPath(TYPING_SETTINGS_PATH, '/settings/'),
    pageName: 'Typing settings',
    props: {
      element: withPageGuard([REGISTERED_USER])(KeyBindings),
      children: <Route path="*" element={<KeyBindings />} />,
    },
  },
};

export const routes = Object.values(SettingsRoutes);

export const preloadSettingsRoute = partialRight(preloadRouteComponent, routes);
