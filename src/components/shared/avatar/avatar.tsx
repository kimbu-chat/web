import { IGroupChat } from '@store/chats/models';
import { IUser } from '@store/common/models';
import { getInterlocutorInitials } from '@utils/user-utils';
import React from 'react';
import deletedIcon from '@icons/deleted.png';

import './avatar.scss';

interface IAvatarProps {
  user?: IUser;
  groupChat?: IGroupChat;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<IAvatarProps> = ({
  user,
  groupChat,
  className,
  onClick,
  ...props
}) => (
  <>
    {user?.avatar?.previewUrl || groupChat?.avatar?.previewUrl || user?.deleted ? (
      <img
        draggable={false}
        alt={getInterlocutorInitials({ user, groupChat })}
        src={
          !user?.deleted ? user?.avatar?.previewUrl || groupChat?.avatar?.previewUrl : deletedIcon
        }
        {...props}
        onClick={onClick}
        className={`avatar ${className || ''}`}
      />
    ) : (
      <div draggable={false} {...props} onClick={onClick} className={`avatar ${className || ''}`}>
        {getInterlocutorInitials({ user, groupChat })}
      </div>
    )}
  </>
);

Avatar.displayName = 'Avatar';
