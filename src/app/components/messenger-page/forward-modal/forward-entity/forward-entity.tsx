import React, { useCallback } from 'react';
import './forward-entity.scss';

import { Avatar } from 'components';
import { getInterlocutorInitials } from 'app/utils/interlocutor-name-utils';

import SelectedSvg from 'icons/ic-check-filled.svg';
import UnSelectedSvg from 'icons/ic-check-outline.svg';
import { Chat } from 'store/chats/models';

namespace ForwardEntityNS {
  export interface Props {
    changeSelectedState?: (id: number) => void;
    isSelected?: boolean;
    chat: Chat;
    onClick?: (chat: Chat) => void;
  }
}

export const ForwardEntity = React.memo(({ changeSelectedState, chat, isSelected, onClick }: ForwardEntityNS.Props) => {
  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick(chat);
    }

    if (changeSelectedState) {
      changeSelectedState(chat.id);
    }
  }, [changeSelectedState, onClick]);

  return (
    <div onClick={onClickOnThisContact} className='forward-entity__friend'>
      {changeSelectedState && <div className='forward-entity__selected-holder'>{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}</div>}
      <Avatar className='forward-entity__avatar' src={chat.interlocutor?.avatar?.previewUrl || chat.groupChat?.avatar?.previewUrl}>
        {getInterlocutorInitials(chat)}
      </Avatar>
      <span className='forward-entity__friend-name'>
        {chat.interlocutor ? `${chat.interlocutor.firstName} ${chat.interlocutor.lastName}` : chat.groupChat?.name}
      </span>
    </div>
  );
});
