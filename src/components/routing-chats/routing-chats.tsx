import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ReactComponent as ContactSvg } from '@icons/contacts.svg';
import { ReactComponent as CallSvg } from '@icons/calls.svg';
import { ReactComponent as ChatsSvg } from '@icons/chats.svg';
import { ReactComponent as SettingsSvg } from '@icons/settings.svg';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { myProfileSelector } from '@store/my-profile/selectors';
import { Avatar } from '@components/avatar';
import { useToggledState } from '@hooks/use-toggled-state';

import { LogoutModal } from '../logout-modal/logout-modal';

import './routing-chats.scss';

export const RoutingChats = () => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const myProfile = useSelector(myProfileSelector);

  const [logoutDisplayed, displayLogout, hideLogout] = useToggledState(false);

  return (
    <div className="routing-chats">
      <Avatar className="routing-chats__my-photo" size={48} user={myProfile} />

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
        to="/settings"
        type="button"
        className="routing-chats__link routing-chats__link--settings"
        activeClassName="routing-chats__link routing-chats__link--active">
        <SettingsSvg />
      </NavLink>

      <button
        onClick={displayLogout}
        type="button"
        className="routing-chats__link routing-chats__link--logout">
        <LogoutSvg />
      </button>

      {logoutDisplayed && <LogoutModal onClose={hideLogout} />}
    </div>
  );
};
