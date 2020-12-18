import React from 'react';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import './routing-chats.scss';

import ContactSvg from 'icons/ic-contacts.svg';
import CallSvg from 'icons/ic-call-filled.svg';
import ChatsSvg from 'icons/ic-chat.svg';
import SettingsSvg from 'icons/ic-settings.svg';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { useSelector } from 'react-redux';

export const RoutingChats = React.memo(() => {
  const selectedChatId = useSelector(getSelectedChatSelector)?.id;
  const location = useLocation();

  return (
    <div className='routing-chats'>
      <NavLink
        className='routing-chats__link'
        activeClassName='routing-chats__link routing-chats__link--active'
        to={location.pathname.replace(
          /\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
          (_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/contacts${selectedChatId ? `/${selectedChatId}` : ''}/${groupFour || ''}`,
        )}
      >
        <ContactSvg viewBox='0 0 25 25' />
      </NavLink>
      <NavLink
        className='routing-chats__link'
        activeClassName='routing-chats__link routing-chats__link--active'
        to={location.pathname.replace(
          /\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
          (_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/calls/${groupFour || ''}`,
        )}
      >
        <CallSvg viewBox='0 0 25 25' />
      </NavLink>
      <NavLink
        className='routing-chats__link'
        activeClassName='routing-chats__link routing-chats__link--active'
        to={location.pathname.replace(
          /\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
          (_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/chats${selectedChatId ? `/${selectedChatId}/${groupFour || ''}` : ''}`,
        )}
      >
        <ChatsSvg viewBox='0 0 25 25' />
      </NavLink>
      <NavLink
        className='routing-chats__link'
        activeClassName='routing-chats__link routing-chats__link--active'
        to={location.pathname.replace(
          /\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
          (_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/settings/${groupFour || ''}`,
        )}
      >
        <SettingsSvg viewBox='0 0 25 25' />
      </NavLink>
    </div>
  );
});
