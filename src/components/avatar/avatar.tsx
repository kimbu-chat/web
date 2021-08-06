import React from 'react';

import classnames from 'classnames';
import { IGroupChat, IUser } from 'kimbu-models';

import { ReactComponent as DeletedSvg } from '@icons/deleted.svg';
import { getInterlocutorInitials } from '@utils/user-utils';

import { StatusBadge } from '../status-badge';

import './avatar.scss';

interface IAvatarProps {
  user?: IUser;
  groupChat?: IGroupChat;
  statusBadge?: boolean;
  size: number;
  onClick?: () => void;
  className?: string;
}

const BLOCK_NAME = 'avatar';
const BLOCK_NAME_WRAPPER = 'avatar-wrapper';

export const Avatar: React.FC<IAvatarProps> = ({
  user,
  groupChat,
  size,
  onClick,
  statusBadge,
  className,
}) => (
  <div className={className}>
    {user?.deleted ? (
      <div
        className={classnames(BLOCK_NAME, `${BLOCK_NAME}--deleted`)}
        style={{ height: `${size}px`, width: `${size}px` }}>
        <DeletedSvg />
      </div>
    ) : (
      <div className={BLOCK_NAME_WRAPPER}>
        {statusBadge && user?.online && <StatusBadge />}
        {user?.avatar?.previewUrl || groupChat?.avatar?.previewUrl ? (
          <img
            draggable={false}
            alt={getInterlocutorInitials({ user, groupChat })}
            src={user?.avatar?.previewUrl || groupChat?.avatar?.previewUrl}
            style={{ height: `${size}px`, width: `${size}px` }}
            onClick={onClick}
            className={BLOCK_NAME}
          />
        ) : (
          <div
            draggable={false}
            style={{ height: `${size}px`, width: `${size}px` }}
            onClick={onClick}
            className={BLOCK_NAME}>
            {getInterlocutorInitials({ user, groupChat })}
          </div>
        )}
      </div>
    )}
  </div>
);

Avatar.displayName = 'Avatar';
