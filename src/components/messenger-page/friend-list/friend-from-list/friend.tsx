import { useTranslation } from 'react-i18next';
import { ChatId } from '@store/chats/chat-id';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import './friend.scss';
import { StatusBadge, TimeUpdateable } from '@components/shared';
import { getUserSelector } from '@store/users/selectors';

interface IFriendProps {
  friendId: number;
}

export const Friend: React.FC<IFriendProps> = ({ friendId }) => {
  const { t } = useTranslation();

  const friend = useSelector(getUserSelector(friendId));

  return (
    <Link to={`/chats/${friend ? ChatId.from(friend.id).id : ''}`} className="friend">
      {friend && (
        <StatusBadge
          containerClassName="friend__avatar-container"
          additionalClassNames="friend__avatar"
          user={friend}
        />
      )}
      <div className="friend__contents">
        <div className="friend__name">{`${friend?.firstName} ${friend?.lastName}`}</div>

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
};
