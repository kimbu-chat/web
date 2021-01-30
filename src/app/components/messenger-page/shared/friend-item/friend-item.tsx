import React, { useCallback } from 'react';
import './friend-item.scss';

import { Avatar } from 'components';
import { IUser } from 'app/store/common/models';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';

import SelectedSvg from 'icons/ic-check-filled.svg';
import UnSelectedSvg from 'icons/ic-check-outline.svg';

interface IFriendItemProps {
  changeSelectedState?: (id: number) => void;
  isSelected?: boolean;
  friend: IUser;
  onClick?: (user: IUser) => void;
}

export const FriendItem: React.FC<IFriendItemProps> = React.memo(({ changeSelectedState, friend, isSelected, onClick }) => {
  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick(friend);
    }

    if (changeSelectedState) {
      changeSelectedState(friend.id);
    }
  }, [changeSelectedState, onClick]);

  return (
    <div onClick={onClickOnThisContact} className='friend-item__friend'>
      {changeSelectedState && <div className='friend-item__selected-holder'>{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}</div>}
      <Avatar className='friend-item__avatar' src={friend.avatar?.previewUrl}>
        {getUserInitials(friend)}
      </Avatar>
      <span className='friend-item__friend-name'>{`${friend.firstName} ${friend.lastName}`}</span>
    </div>
  );
});
