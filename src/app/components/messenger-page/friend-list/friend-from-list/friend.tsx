import { LocalizationContext } from 'app/app';
import { Avatar } from 'components';
import { ChatId } from 'store/chats/chat-id';
import { IUserPreview } from 'store/my-profile/models';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import moment from 'moment';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserStatus } from 'app/store/models';
import './friend.scss';

interface IFriendProps {
  friend: IUserPreview;
}

export const Friend: React.FC<IFriendProps> = React.memo(({ friend }) => {
  const { t } = useContext(LocalizationContext);

  return (
    <NavLink to={`/contacts/${ChatId.from(friend.id).id}/`} className='friend' activeClassName='friend--active'>
      <div className='friend__active-line' />
      <Avatar className='friend__avatar' src={friend.avatar?.previewUrl}>
        {getUserInitials(friend)}
      </Avatar>
      <div className='friend__contents'>
        <div className='friend__heading'>
          <div className='friend__name'>{`${friend.firstName} ${friend.lastName}`}</div>
          <div className='friend__status'>
            {friend.status === UserStatus.Online
              ? t('chatData.online')
              : `${t('chatData.last-time')} ${moment.utc(friend.lastOnlineTime).local().startOf('minute').fromNow()}`}
          </div>
        </div>
      </div>
    </NavLink>
  );
});
