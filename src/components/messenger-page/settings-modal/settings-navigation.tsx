import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import React from 'react';
import './settings-navigation.scss';
import { ReactComponent as UserSvg } from '@icons/user-o.svg';
import { ReactComponent as TypeSvg } from '@icons/type.svg';
import { ReactComponent as LanguageSvg } from '@icons/language.svg';
import { ReactComponent as AppearanceSvg } from '@icons/theme.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PrivacySvg } from '@icons/privacy.svg';
import { ReactComponent as MuteSvg } from '@icons/mute.svg';
import { NavLink } from 'react-router-dom';

export const SettingsNavigation = React.memo(() => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

  return (
    <>
      <NavLink
        to="/settings/profile"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <UserSvg className="settings-navigation__icon" viewBox="0 0 24 24" />
        <span className="settings-navigation__text">{t('settings.edit_profile')}</span>
      </NavLink>

      <NavLink
        to="/settings/notifications"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <MuteSvg className="settings-navigation__icon" viewBox="0 0 18 18" />
        <span className="settings-navigation__text">{t('settings.notifications')} </span>
      </NavLink>

      <NavLink
        to="/settings/typing"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <TypeSvg className="settings-navigation__icon" viewBox="0 0 24 24" />
        <span className="settings-navigation__text">{t('settings.text_typing')} </span>
      </NavLink>

      <NavLink
        to="/settings/language"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <LanguageSvg className="settings-navigation__icon" viewBox="0 0 24 24" />
        <span className="settings-navigation__text">{t('settings.language')} </span>
      </NavLink>

      <NavLink
        to="/settings/appearance"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <AppearanceSvg className="settings-navigation__icon" viewBox="0 0 24 24" />
        <span className="settings-navigation__text">{t('settings.appearance')} </span>
      </NavLink>

      <NavLink
        to="/settings/audio-video"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <PlaySvg className="settings-navigation__icon" viewBox="0 0 24 24" />
        <span className="settings-navigation__text">{t('settings.audio-video')} </span>
      </NavLink>

      <NavLink
        to="/settings/privacy-security"
        className="settings-navigation__element"
        activeClassName="settings-navigation__element--active">
        <PrivacySvg className="settings-navigation__icon" viewBox="0 0 25 25" />
        <span className="settings-navigation__text">{t('settings.privacy-security')} </span>
      </NavLink>
    </>
  );
});
