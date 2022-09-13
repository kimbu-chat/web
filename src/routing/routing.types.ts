import type { LazyExoticComponent, ComponentType } from 'react';

import { ANONYMOUS_USER, PROSPECT_USER, REGISTERED_USER } from './routing.constants';

export type UserStatus = typeof ANONYMOUS_USER | typeof PROSPECT_USER | typeof REGISTERED_USER;

export type RoutePropsType = {
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element: React.FC;
  index?: boolean;
  path?: string;
};

export type RouteObject = {
  path: string;
  pageName: string;
  props: RoutePropsType;
};

export enum RoutesEnum {
  LOGIN = 'LOGIN',
  SIGN_UP = 'SIGN_UP',
  CODE_CONFIRMATION = 'CODE_CONFIRMATION',
}

export enum MainRoutesEnum {
  INSTANT_MESSAGING_CHAT = 'INSTANT_MESSAGING_CHAT',
  CALLS = 'CALLS',
  CONTACTS = 'CONTACTS',
  SETTINGS = 'SETTINGS',
  LOGOUT = 'LOGOUT',
}

export enum SettingsRoutesEnum {
  PROFILE_SETTINGS = 'PROFILE_SETTINGS',
  NOTIFICATIONS_SETTINGS = 'NOTIFICATIONS_SETTINGS',
  TYPING_SETTINGS = 'TYPING_SETTINGS',
  LANGUAGE_SETTINGS = 'LANGUAGE_SETTINGS',
  APPEARANCE_SETTINGS = 'APPEARANCE_SETTINGS',
  AUDIO_VIDEO_SETTINGS = 'AUDIO_VIDEO_SETTINGS',
  PRIVACY_SECURITY_SETTINGS = 'PRIVACY_SECURITY_SETTINGS',
}

export type RoutesObject = {
  [key in RoutesEnum]: RouteObject;
};

export type SettingsRoutesObject = {
  [key in SettingsRoutesEnum]: RouteObject;
};

export type MainRoutesObject = {
  [key in MainRoutesEnum]: RouteObject;
};

export type ImportStatement = () => Promise<{
  default: ComponentType<any>;
}>;

export type Preload = {
  preload?: ImportStatement;
};

export type PreloadableComponent = LazyExoticComponent<ComponentType<any>> & Preload;
