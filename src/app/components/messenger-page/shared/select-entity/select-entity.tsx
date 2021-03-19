import React, { useCallback } from 'react';
import './select-entity.scss';

import { Avatar, StatusBadge } from 'components';
import { getInterlocutorInitials } from 'app/utils/interlocutor-name-utils';

import SelectedSvg from 'icons/checked.svg';
import UnSelectedSvg from 'icons/unchecked.svg';
import { IChat } from 'store/chats/models';
import { TimeUpdateable } from 'app/components/shared/time-updateable/time-updateable';
import { IUser } from 'app/store/common/models';

interface ISelectEntityProps {
  changeSelectedState?: (id: number) => void;
  isSelected?: boolean;
  chatOrUser: IChat | IUser;
  icon?: JSX.Element;
  onClick?: (chat: IChat | IUser) => void;
}

export const SelectEntity: React.FC<ISelectEntityProps> = React.memo(({ changeSelectedState, chatOrUser, isSelected, onClick, icon }) => {
  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick(chatOrUser);
    }

    if (changeSelectedState) {
      changeSelectedState(chatOrUser.id);
    }
  }, [changeSelectedState, onClick]);

  const interlocutor = (chatOrUser as IChat).interlocutor || (chatOrUser as IUser);
  const groupChat = (chatOrUser as IChat)?.groupChat;

  return (
    <div onClick={onClickOnThisContact} className='select-entity__friend'>
      {groupChat ? (
        <div className='select-entity__avatar-container'>
          <Avatar className='select-entity__avatar' src={groupChat.avatar?.previewUrl}>
            {getInterlocutorInitials(chatOrUser as IChat)}
          </Avatar>
        </div>
      ) : (
        <StatusBadge containerClassName='select-entity__avatar-container' additionalClassNames='select-entity__avatar' user={interlocutor} />
      )}

      <div className='select-entity__friend-data'>
        <div className='select-entity__friend-name'>{interlocutor ? `${interlocutor.firstName} ${interlocutor.lastName}` : groupChat?.name}</div>
        {interlocutor && (
          <div className='select-entity__friend-status'>
            <TimeUpdateable timeStamp={interlocutor.lastOnlineTime} />
          </div>
        )}
      </div>

      {icon && <div className='select-entity__icon-holder'>{icon}</div>}
      {changeSelectedState && <div className='select-entity__selected-holder'>{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}</div>}
    </div>
  );
});
