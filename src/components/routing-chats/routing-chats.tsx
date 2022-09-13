import React from 'react';

import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as CallSvg } from '@icons/calls.svg';
import { ReactComponent as ChatsSvg } from '@icons/chats.svg';
import { ReactComponent as ContactSvg } from '@icons/contacts.svg';
import { ReactComponent as LogoutSvg } from '@icons/logout.svg';
import { ReactComponent as SettingsSvg } from '@icons/settings.svg';
import { CALLS_PATH, CONTACTS_PATH, INSTANT_MESSAGING_PATH, SETTINGS_PATH } from '@routing/routing.constants';
import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { myProfileSelector } from '@store/my-profile/selectors';

import { LogoutModal } from '../logout-modal/logout-modal';

import './routing-chats.scss';

const BLOCK_NAME = 'routing-chats';

export const RoutingChats = () => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const myProfile = useSelector(myProfileSelector);

  const [logoutDisplayed, displayLogout, hideLogout] = useToggledState(false);

  return (
    <div className={BLOCK_NAME}>
      <Avatar className={`${BLOCK_NAME}__my-photo`} size={48} user={myProfile} />

      <div className={`${BLOCK_NAME}__middle-group`}>
        <NavLink
          className={({ isActive }) =>
            classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`, { [`${BLOCK_NAME}__link--active`]: isActive })
          }
          to={CONTACTS_PATH}>
          <ContactSvg />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`, { [`${BLOCK_NAME}__link--active`]: isActive })
          }
          to={`${INSTANT_MESSAGING_PATH}${selectedChatId ? `/${selectedChatId}` : ''}`}>
          <ChatsSvg />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`, { [`${BLOCK_NAME}__link--active`]: isActive })
          }
          to={CALLS_PATH}>
          <CallSvg />
        </NavLink>
      </div>

      <NavLink
        to={SETTINGS_PATH}
        type="button"
        className={({ isActive }) =>
          classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--settings`, { [`${BLOCK_NAME}__link--active`]: isActive })
        }>
        <SettingsSvg />
      </NavLink>

      <button onClick={displayLogout} type="button" className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--logout`)}>
        <LogoutSvg />
      </button>

      {logoutDisplayed && <LogoutModal onClose={hideLogout} />}
    </div>
  );
};
