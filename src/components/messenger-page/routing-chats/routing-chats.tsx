import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './routing-chats.scss';

import { ReactComponent as ContactSvg } from '@icons/contacts.svg';
import { ReactComponent as CallSvg } from '@icons/calls.svg';
import { ReactComponent as ChatsSvg } from '@icons/chats.svg';
import { ReactComponent as SettingsSvg } from '@icons/settings.svg';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';

import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { useSelector } from 'react-redux';
import { myProfileSelector } from '@store/my-profile/selectors';
import { Avatar, FadeAnimationWrapper } from '@components/shared';
import { LogoutModal } from '../logout-modal/logout-modal';

export const RoutingChats = () => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const myProfile = useSelector(myProfileSelector);

  const [logoutDisplayed, setLogoutDisplayed] = useState(false);
  const changeLogoutDisplayedState = useCallback(
    () => setLogoutDisplayed((oldState) => !oldState),
    [setLogoutDisplayed],
  );

  return (
    <div className="routing-chats">
      <Avatar className="routing-chats__my-photo" user={myProfile} />

      <div className="routing-chats__middle-group">
        <NavLink
          className="routing-chats__link routing-chats__link--grouped"
          activeClassName="routing-chats__link routing-chats__link--active"
          to="/contacts">
          <ContactSvg />
        </NavLink>
        <NavLink
          className="routing-chats__link routing-chats__link--grouped"
          activeClassName="routing-chats__link routing-chats__link--active"
          to={`/chats${selectedChatId ? `/${selectedChatId}` : ''}`}>
          <ChatsSvg />
        </NavLink>
        <NavLink
          className="routing-chats__link routing-chats__link--grouped"
          activeClassName="routing-chats__link routing-chats__link--active"
          to="/calls">
          <CallSvg />
        </NavLink>
      </div>

      <NavLink
        to="/settings/profile"
        type="button"
        className="routing-chats__link routing-chats__link--settings"
        activeClassName="routing-chats__link routing-chats__link--active">
        <SettingsSvg />
      </NavLink>

      <button
        onClick={changeLogoutDisplayedState}
        type="button"
        className="routing-chats__link routing-chats__link--logout">
        <LogoutSvg />
      </button>

      <FadeAnimationWrapper isDisplayed={logoutDisplayed}>
        <LogoutModal onClose={changeLogoutDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
};
