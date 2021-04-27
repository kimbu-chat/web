import { IGroupChat } from '@store/chats/models';
import { IUser } from '@store/common/models';
import { getInterlocutorInitials } from '@utils/user-utils';
import React from 'react';
import { ReactComponent as DeletedSvg } from '@icons/deleted.svg';

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
}) => {
  if (user?.deleted) {
    return (
      <div className={`avatar avatar--deleted ${className || ''}`}>
        <DeletedSvg />
      </div>
    );
  }

  return (
    <>
      {user?.avatar?.previewUrl || groupChat?.avatar?.previewUrl ? (
        <img
          draggable={false}
          alt={getInterlocutorInitials({ user, groupChat })}
          src={user?.avatar?.previewUrl || groupChat?.avatar?.previewUrl}
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
};

Avatar.displayName = 'Avatar';
