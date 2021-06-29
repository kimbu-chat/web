import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import React, { useCallback } from 'react';

import { ReactComponent as UserSvg } from '@icons/user-o.svg';
import { ReactComponent as TypeSvg } from '@icons/type.svg';
import { ReactComponent as LanguageSvg } from '@icons/language.svg';
import { ReactComponent as AppearanceSvg } from '@icons/theme.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PrivacySvg } from '@icons/privacy.svg';
import { ReactComponent as MuteSvg } from '@icons/mute.svg';
import {
  APPEARANCE_SETTINGS_PATH,
  AUDIO_VIDEO_SETTINGS_PATH,
  LANGUAGE_SETTINGS_PATH,
  NOTIFICATIONS_SETTINGS_PATH,
  PRIVACY_SECURITY_SETTINGS_PATH,
  PROFILE_SETTINGS_PATH,
  TYPING_SETTINGS_PATH,
} from '@routing/routing.constants';
import { preloadSettingsRoute } from '@routing/routes/settings-routes';

import './settings-navigation.scss';

const BLOCK_NAME = 'settings-navigation';

const SettingsNavigation = () => {
  const { t } = useTranslation();

  const preloadProfileSettings = useCallback(() => preloadSettingsRoute(PROFILE_SETTINGS_PATH), []);
  const preloadNotificationSettings = useCallback(
    () => preloadSettingsRoute(NOTIFICATIONS_SETTINGS_PATH),
    [],
  );
  const preloadTypingSettings = useCallback(() => preloadSettingsRoute(TYPING_SETTINGS_PATH), []);
  const preloadLanguageSettings = useCallback(
    () => preloadSettingsRoute(LANGUAGE_SETTINGS_PATH),
    [],
  );
  const preloadAppearanceSettings = useCallback(
    () => preloadSettingsRoute(APPEARANCE_SETTINGS_PATH),
    [],
  );
  const preloadAudioVideoSettings = useCallback(
    () => preloadSettingsRoute(AUDIO_VIDEO_SETTINGS_PATH),
    [],
  );
  const preloadPrivacySecuritySettings = useCallback(
    () => preloadSettingsRoute(PRIVACY_SECURITY_SETTINGS_PATH),
    [],
  );
  return (
    <>
      <NavLink
        onMouseEnter={preloadProfileSettings}
        to={PROFILE_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <UserSvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 24 24" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.edit_profile')}</span>
      </NavLink>

      <NavLink
        onMouseEnter={preloadNotificationSettings}
        to={NOTIFICATIONS_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <MuteSvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 18 18" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.notifications')} </span>
      </NavLink>

      <NavLink
        onMouseEnter={preloadTypingSettings}
        to={TYPING_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <TypeSvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 24 24" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.text_typing')} </span>
      </NavLink>

      <NavLink
        onMouseEnter={preloadLanguageSettings}
        to={LANGUAGE_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <LanguageSvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 24 24" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.language')} </span>
      </NavLink>

      <NavLink
        onMouseEnter={preloadAppearanceSettings}
        to={APPEARANCE_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <AppearanceSvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 24 24" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.appearance')} </span>
      </NavLink>

      <NavLink
        onMouseEnter={preloadAudioVideoSettings}
        to={AUDIO_VIDEO_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <PlaySvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 24 24" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.audio-video')} </span>
      </NavLink>

      <NavLink
        onMouseEnter={preloadPrivacySecuritySettings}
        to={PRIVACY_SECURITY_SETTINGS_PATH}
        className={`${BLOCK_NAME}__element`}
        activeClassName={`${BLOCK_NAME}__element--active`}>
        <PrivacySvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 25 25" />
        <span className={`${BLOCK_NAME}__text`}>{t('settings.privacy-security')} </span>
      </NavLink>
    </>
  );
};

SettingsNavigation.displayName = 'SettingsNavigation';

export { SettingsNavigation };
