import { useTranslation } from 'react-i18next';
import { ChatId } from '@store/chats/chat-id';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import './friend.scss';
import { Avatar, TimeUpdateable } from '@components/shared';
import { getUserSelector } from '@store/users/selectors';
import { getUserName } from '@utils/user-utils';

interface IFriendProps {
  friendId: number;
}

export const Friend: React.FC<IFriendProps> = React.memo(({ friendId }) => {
  const { t } = useTranslation();

  const friend = useSelector(getUserSelector(friendId));

  return (
    <Link to={`/chats/${friend ? ChatId.from(friend.id).id : ''}`} className="friend">
      {friend && <Avatar className="friend__avatar" user={friend} />}
      <div className="friend__contents">
        <div className="friend__name">{friend && getUserName(friend, t)}</div>

        {!friend?.deleted && (
          <div className="friend__status">
            {friend?.online ? (
              t('chatData.online')
            ) : (
              <>
                <span>{`${t('chatData.last-time')} `}</span>{' '}
                <TimeUpdateable timeStamp={friend?.lastOnlineTime} />
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
});
