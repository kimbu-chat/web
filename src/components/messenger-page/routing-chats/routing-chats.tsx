import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './routing-chats.scss';

import ContactSvg from '@icons/contacts.svg';
import CallSvg from '@icons/calls.svg';
import ChatsSvg from '@icons/chats.svg';
import SettingsSvg from '@icons/settings.svg';
import LogoutSvg from '@icons/logout.svg';

import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { useSelector } from 'react-redux';
import { myProfilePhotoSelector, myFullNameSelector } from '@store/my-profile/selectors';
import { Avatar, FadeAnimationWrapper } from '@components/shared';
import { getStringInitials } from '@utils/interlocutor-name-utils';
import { LogoutModal } from '../logout-modal/logout-modal';

export const RoutingChats = React.memo(() => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const myPhoto = useSelector(myProfilePhotoSelector);
  const myName = useSelector(myFullNameSelector);

  const [logoutDisplayed, setLogoutDisplayed] = useState(false);
  const changeLogoutDisplayedState = useCallback(
    () => setLogoutDisplayed((oldState) => !oldState),
    [setLogoutDisplayed],
  );

  return (
    <div className="routing-chats">
      <Avatar className="routing-chats__my-photo" src={myPhoto}>
        {getStringInitials(myName)}
      </Avatar>

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
});
