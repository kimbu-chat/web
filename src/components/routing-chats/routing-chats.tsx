import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import { ReactComponent as ContactSvg } from '@icons/contacts.svg';
import { ReactComponent as CallSvg } from '@icons/calls.svg';
import { ReactComponent as ChatsSvg } from '@icons/chats.svg';
import { ReactComponent as SettingsSvg } from '@icons/settings.svg';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { myProfileSelector } from '@store/my-profile/selectors';
import { Avatar } from '@components/avatar';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import {
  CALLS_PATH,
  CONTACTS_PATH,
  INSTANT_MESSAGING_PATH,
  PROFILE_SETTINGS_PATH,
  SETTINGS_PATH,
} from '@routing/routing.constants';
import { preloadMainRoute } from '@routing/routes/main-routes';
import { preloadSettingsRoute } from '@routing/routes/settings-routes';

import { LogoutModal } from '../logout-modal/logout-modal';

import './routing-chats.scss';

const BLOCK_NAME = 'routing-chats';

export const RoutingChats = () => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const myProfile = useSelector(myProfileSelector);

  const [logoutDisplayed, setLogoutDisplayed] = useState(false);
  const changeLogoutDisplayedState = useCallback(
    () => setLogoutDisplayed((oldState) => !oldState),
    [setLogoutDisplayed],
  );

  const preloadContacts = useCallback(() => preloadMainRoute(CONTACTS_PATH), []);
  const preloadIm = useCallback(() => preloadMainRoute(INSTANT_MESSAGING_PATH), []);
  const preloadSettings = useCallback(() => {
    preloadMainRoute(SETTINGS_PATH);
    preloadSettingsRoute(PROFILE_SETTINGS_PATH);
  }, []);
  const preloadCalls = useCallback(() => preloadMainRoute(CALLS_PATH), []);

  return (
    <div className={BLOCK_NAME}>
      <Avatar className={`${BLOCK_NAME}__my-photo`} size={48} user={myProfile} />

      <div className={`${BLOCK_NAME}__middle-group`}>
        <NavLink
          onMouseEnter={preloadContacts}
          className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`)}
          activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}
          to={CONTACTS_PATH}>
          <ContactSvg />
        </NavLink>
        <NavLink
          onMouseEnter={preloadIm}
          className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`)}
          activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}
          to={`${INSTANT_MESSAGING_PATH}${selectedChatId ? `/${selectedChatId}` : ''}`}>
          <ChatsSvg />
        </NavLink>
        <NavLink
          onMouseEnter={preloadCalls}
          className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`)}
          activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}
          to={CALLS_PATH}>
          <CallSvg />
        </NavLink>
      </div>

      <NavLink
        onMouseEnter={preloadSettings}
        to={SETTINGS_PATH}
        type="button"
        className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--settings`)}
        activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}>
        <SettingsSvg />
      </NavLink>

      <button
        onClick={changeLogoutDisplayedState}
        type="button"
        className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--logout`)}>
        <LogoutSvg />
      </button>

      <FadeAnimationWrapper isDisplayed={logoutDisplayed}>
        <LogoutModal onClose={changeLogoutDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
};
