import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './routing-chats.scss';

import ContactSvg from 'icons/contacts.svg';
import CallSvg from 'icons/calls.svg';
import ChatsSvg from 'icons/chats.svg';
import SettingsSvg from 'icons/settings.svg';
import LogoutSvg from 'icons/logout.svg';

import { getSelectedChatIdSelector } from 'store/chats/selectors';
import { useSelector } from 'react-redux';
import { myProfilePhotoSelector, myFullNameSelector } from 'app/store/my-profile/selectors';
import { Avatar, FadeAnimationWrapper, SettingsModal } from 'app/components';
import { getStringInitials } from 'app/utils/interlocutor-name-utils';

export const RoutingChats = React.memo(() => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const myPhoto = useSelector(myProfilePhotoSelector);
  const myName = useSelector(myFullNameSelector);

  const [settingsDisplayed, setSettingsDisplayed] = useState(false);

  const logout = useCallback(() => window.location.replace('logout'), []);

  const changeSettingsDisplayedState = useCallback(() => setSettingsDisplayed((oldState) => !oldState), [setSettingsDisplayed]);

  return (
    <div className='routing-chats'>
      <Avatar className='routing-chats__my-photo' src={myPhoto}>
        {getStringInitials(myName)}
      </Avatar>

      <div className='routing-chats__middle-group'>
        <NavLink className='routing-chats__link routing-chats__link--grouped' activeClassName='routing-chats__link routing-chats__link--active' to='/contacts'>
          <ContactSvg />
        </NavLink>
        <NavLink
          className='routing-chats__link routing-chats__link--grouped'
          activeClassName='routing-chats__link routing-chats__link--active'
          to={`/chats${selectedChatId ? `/${selectedChatId}` : ''}`}
        >
          <ChatsSvg />
        </NavLink>
        <NavLink className='routing-chats__link routing-chats__link--grouped' activeClassName='routing-chats__link routing-chats__link--active' to='/calls'>
          <CallSvg />
        </NavLink>
      </div>

      <button onClick={changeSettingsDisplayedState} type='button' className='routing-chats__link routing-chats__link--settings'>
        <SettingsSvg />
      </button>

      <button onClick={logout} type='button' className='routing-chats__link routing-chats__link--logout'>
        <LogoutSvg />
      </button>

      <FadeAnimationWrapper isDisplayed={settingsDisplayed}>
        <SettingsModal />
      </FadeAnimationWrapper>
    </div>
  );
});
