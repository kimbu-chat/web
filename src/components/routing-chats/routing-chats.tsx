import React, { useCallback } from 'react';
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
import {
  CALLS_PATH,
  CONTACTS_PATH,
  INSTANT_MESSAGING_PATH,
  SETTINGS_PATH,
} from '@routing/routing.constants';
import { useToggledState } from '@hooks/use-toggled-state';

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
          className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`)}
          activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}
          to={CONTACTS_PATH}>
          <ContactSvg />
        </NavLink>
        <NavLink
          className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`)}
          activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}
          to={`${INSTANT_MESSAGING_PATH}${selectedChatId ? `/${selectedChatId}` : ''}`}>
          <ChatsSvg />
        </NavLink>
        <NavLink
          className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--grouped`)}
          activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}
          to={CALLS_PATH}>
          <CallSvg />
        </NavLink>
      </div>

      <NavLink
        to={SETTINGS_PATH}
        type="button"
        className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--settings`)}
        activeClassName={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--active`)}>
        <SettingsSvg />
      </NavLink>

      <button
        onClick={displayLogout}
        type="button"
        className={classnames(`${BLOCK_NAME}__link`, `${BLOCK_NAME}__link--logout`)}>
        <LogoutSvg />
      </button>

      {logoutDisplayed && <LogoutModal onClose={hideLogout} />}
    </div>
  );
};
