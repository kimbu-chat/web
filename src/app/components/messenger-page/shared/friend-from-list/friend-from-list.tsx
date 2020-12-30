import React, { useCallback } from 'react';
import './friend-from-list.scss';

import { Avatar } from 'components';
import { IUserPreview } from 'store/my-profile/models';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';

import SelectedSvg from 'icons/ic-check-filled.svg';
import UnSelectedSvg from 'icons/ic-check-outline.svg';

namespace FriendFromListNS {
  export interface IProps {
    changeSelectedState?: (id: number) => void;
    isSelected?: boolean;
    friend: IUserPreview;
    onClick?: (user: IUserPreview) => void;
  }
}

export const FriendFromList = React.memo(({ changeSelectedState, friend, isSelected, onClick }: FriendFromListNS.IProps) => {
  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick(friend);
    }

    if (changeSelectedState) {
      changeSelectedState(friend.id);
    }
  }, [changeSelectedState, onClick]);

  return (
    <div onClick={onClickOnThisContact} className='friend-from-list__friend'>
      {changeSelectedState && <div className='friend-from-list__selected-holder'>{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}</div>}
      <Avatar className='friend-from-list__avatar' src={friend.avatar?.previewUrl}>
        {getUserInitials(friend)}
      </Avatar>
      <span className='friend-from-list__friend-name'>{`${friend.firstName} ${friend.lastName}`}</span>
    </div>
  );
});
