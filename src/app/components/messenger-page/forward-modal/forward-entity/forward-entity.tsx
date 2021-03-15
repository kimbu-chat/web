import React, { useCallback } from 'react';
import './forward-entity.scss';

import { Avatar, StatusBadge } from 'components';
import { getInterlocutorInitials } from 'app/utils/interlocutor-name-utils';

import SelectedSvg from 'icons/checked.svg';
import UnSelectedSvg from 'icons/unchecked.svg';
import { IChat } from 'store/chats/models';
import { TimeUpdateable } from 'app/components/shared/time-updateable/time-updateable';

interface IForwardEntityProps {
  changeSelectedState?: (id: number) => void;
  isSelected?: boolean;
  chat: IChat;
  onClick?: (chat: IChat) => void;
}

export const ForwardEntity: React.FC<IForwardEntityProps> = React.memo(({ changeSelectedState, chat, isSelected, onClick }) => {
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
      {chat.groupChat ? (
        <div className='forward-entity__avatar-container'>
          <Avatar className='forward-entity__avatar' src={chat.groupChat.avatar?.previewUrl}>
            {getInterlocutorInitials(chat)}
          </Avatar>
        </div>
      ) : (
        <StatusBadge containerClassName='forward-entity__avatar-container' additionalClassNames='forward-entity__avatar' user={chat.interlocutor!} />
      )}

      <div className='forward-entity__friend-data'>
        <div className='forward-entity__friend-name'>
          {chat.interlocutor ? `${chat.interlocutor.firstName} ${chat.interlocutor.lastName}` : chat.groupChat?.name}
        </div>
        {chat.interlocutor && (
          <div className='forward-entity__friend-status'>
            <TimeUpdateable timeStamp={chat.interlocutor.lastOnlineTime} />
          </div>
        )}
      </div>

      {changeSelectedState && <div className='forward-entity__selected-holder'>{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}</div>}
    </div>
  );
});
