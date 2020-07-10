import React from 'react';
import './_FriendItem.scss';
import { UserPreview } from '../../../../store/contacts/types';
import { Avatar } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { markUserAsAddedToConferenceAction } from '../../../../store/friends/actions';

const OnlineBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))(Badge);

const OfflineBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#b70015',
    color: '#b70015',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
  }
}))(Badge);

namespace FriendItem {
  export interface Props {
    user: UserPreview;
  }
}

const getUserInitials = (user: UserPreview) => {
  const initials = `${user.firstName} ${user.lastName}`.split(' ').reduce((accum, current) => {
    return accum + current[0];
  }, '');

  const shortedInitials = initials.substr(0, 2);

  return shortedInitials;
};

const FriendItem = ({ user }: FriendItem.Props) => {
  const markUser = useActionWithDispatch(markUserAsAddedToConferenceAction);
  const selectUser = () => markUser(user.id || -1);
  return (
    <div className="messenger__friend-item" onClick={selectUser}>
      {user?.status === 1 ? (
        <OnlineBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          variant="dot"
        >
          <Avatar className="messenger__friend-item__avatar" src={user.avatarUrl}>
            {getUserInitials(user)}
          </Avatar>
        </OnlineBadge>
      ) : (
        <OfflineBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          variant="dot"
        >
          <Avatar className="messenger__friend-item__avatar" src={user.avatarUrl}>
            {getUserInitials(user)}
          </Avatar>
        </OfflineBadge>
      )}
      <div className="messenger__friend-item__name">{`${user.firstName} ${user.lastName}`}</div>
      <div
        className={
          user.supposedToAddIntoConference
            ? 'messenger__friend-item__supposed messenger__friend-item__supposed--true'
            : 'messenger__friend-item__supposed messenger__friend-item__supposed--false'
        }
      >
        <div className="svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M5.85 9.66l-.88-.98-.4-.45A.8.8 0 1 0 3.39 9.3l.4.44.87.98.73.82a1.5 1.5 0 0 0 2.28-.04l2.09-2.54 1.8-2.18.8-1a.8.8 0 0 0-1.23-1.01l-.81.99-1.8 2.18L6.5 10.4l-.65-.73z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FriendItem;
