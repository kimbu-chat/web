import React from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { TimeUpdateable } from '@components/time-updateable';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { ChatId } from '@store/chats/chat-id';
import { getUserSelector } from '@store/users/selectors';
import { replaceInUrl } from '@utils/replace-in-url';
import { getUserName } from '@utils/user-utils';

import './friend.scss';

interface IFriendProps {
  friendId: number;
}

export const Friend: React.FC<IFriendProps> = React.memo(({ friendId }) => {
  const { t } = useTranslation();

  const friend = useSelector(getUserSelector(friendId));

  return (
    <Link
      to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, [
        'id?',
        friend ? ChatId.from(friend.id).id : '',
      ])}
      className="friend">
      {friend && <Avatar size={48} user={friend} />}
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
