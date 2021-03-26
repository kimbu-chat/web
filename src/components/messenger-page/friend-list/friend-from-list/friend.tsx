import { LocalizationContext } from '@contexts';
import { ChatId } from '@store/chats/chat-id';
import { IUser, UserStatus } from '@store/common/models';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './friend.scss';
import { StatusBadge, TimeUpdateable } from '@components';

interface IFriendProps {
  friend: IUser;
}

export const Friend: React.FC<IFriendProps> = React.memo(({ friend }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <Link to={`/chats/${ChatId.from(friend.id).id}`} className="friend">
      <StatusBadge containerClassName="friend__avatar-container" additionalClassNames="friend__avatar" user={friend} />
      <div className="friend__contents">
        <div className="friend__name">{`${friend.firstName} ${friend.lastName}`}</div>
        <div className="friend__status">
          {friend.status === UserStatus.Online ? (
            t('chatData.online')
          ) : (
            <>
              <span>{`${t('chatData.last-time')} `}</span> <TimeUpdateable timeStamp={friend.lastOnlineTime} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
});
