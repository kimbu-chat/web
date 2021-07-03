import partialRight from 'lodash/partialRight';

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

const ProfileSettings = LazyPreload(() => import('@pages/settings/edit-profile'));
const NotificationsSettings = LazyPreload(() => import('@pages/settings/notifications-settings'));
const LanguageSettings = LazyPreload(() => import('@pages/settings/language-settings'));
const KeyBindings = LazyPreload(() => import('@pages/settings/key-bindings'));
const AppearanceSettings = LazyPreload(() => import('@pages/settings/appearance'));
const PrivacySecuritySettings = LazyPreload(() => import('@pages/settings/privacy-security'));
const AudioVideoSettings = LazyPreload(() => import('@pages/settings/audio-video'));

const SettingsRoutes: SettingsRoutesObject = {
  [SettingsRoutesEnum.PROFILE_SETTINGS]: {
    path: PROFILE_SETTINGS_PATH,
    pageName: 'Profile settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(ProfileSettings),
      exact: true,
    },
  },
  [SettingsRoutesEnum.APPEARANCE_SETTINGS]: {
    path: APPEARANCE_SETTINGS_PATH,
    pageName: 'Appearance settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(AppearanceSettings),
      exact: true,
    },
  },
  [SettingsRoutesEnum.AUDIO_VIDEO_SETTINGS]: {
    path: AUDIO_VIDEO_SETTINGS_PATH,
    pageName: 'Audio video settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(AudioVideoSettings),
      exact: true,
    },
  },
  [SettingsRoutesEnum.LANGUAGE_SETTINGS]: {
    path: LANGUAGE_SETTINGS_PATH,
    pageName: 'Language settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(LanguageSettings),
      exact: true,
    },
  },
  [SettingsRoutesEnum.NOTIFICATIONS_SETTINGS]: {
    path: NOTIFICATIONS_SETTINGS_PATH,
    pageName: 'Notifications settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(NotificationsSettings),
      exact: true,
    },
  },
  [SettingsRoutesEnum.PRIVACY_SECURITY_SETTINGS]: {
    path: PRIVACY_SECURITY_SETTINGS_PATH,
    pageName: 'Privacy and security settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(PrivacySecuritySettings),
      exact: true,
    },
  },
  [SettingsRoutesEnum.TYPING_SETTINGS]: {
    path: TYPING_SETTINGS_PATH,
    pageName: 'Typing settings',
    props: {
      component: withPageGuard([REGISTERED_USER])(KeyBindings),
      exact: true,
    },
  },
};

export const routes = Object.values(SettingsRoutes);

export const preloadSettingsRoute = partialRight(preloadRouteComponent, routes);
