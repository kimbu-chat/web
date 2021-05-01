import React, { useCallback } from 'react';

import { Avatar, StatusBadge, TimeUpdateable } from '@components/shared';
import { getUserName } from '@utils/user-utils';
import { ReactComponent as SelectedSvg } from '@icons/checked.svg';
import { IChat } from '@store/chats/models';
import { IUser } from '@store/common/models';
import './select-entity.scss';
import { useTranslation } from 'react-i18next';
import { getUserSelector } from '@store/users/selectors';
import { useSelector } from 'react-redux';
import { getChatSelector } from '@store/chats/selectors';

interface ISelectEntityProps {
  changeSelectedState?: (id: number) => void;
  isSelected?: boolean;
  chatId?: number;
  userId?: number;
  icon?: JSX.Element;
  onClick?: (chat: IChat | IUser) => void;
}

export const SelectEntity: React.FC<ISelectEntityProps> = ({
  changeSelectedState,
  userId,
  chatId,
  isSelected,
  onClick,
  icon,
}) => {
  const userInterlocutor = useSelector(getUserSelector(userId));
  const chat = useSelector(getChatSelector(chatId));
  const chatInterlocutor = useSelector(getUserSelector(chat?.interlocutor));

  const interlocutor = chatInterlocutor || userInterlocutor;

  const groupChat = chat?.groupChat;

  const { t } = useTranslation();

  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick((chat || interlocutor) as IChat | IUser);
    }

    if (changeSelectedState) {
      changeSelectedState((userId || chatId) as number);
    }
  }, [onClick, changeSelectedState, chat, interlocutor, userId, chatId]);

  return (
    <div onClick={onClickOnThisContact} className="select-entity__friend">
      {groupChat && (
        <div className="select-entity__avatar-container">
          <Avatar className="select-entity__avatar" groupChat={groupChat} />
        </div>
      )}
      {interlocutor && (
        <StatusBadge
          containerClassName="select-entity__avatar-container"
          additionalClassNames="select-entity__avatar"
          user={interlocutor}
        />
      )}

      <div className="select-entity__friend-data">
        <div className="select-entity__friend-name">
          {groupChat ? groupChat?.name : interlocutor && getUserName(interlocutor, t)}
        </div>
        {interlocutor && !interlocutor?.deleted && (
          <div className="select-entity__friend-status">
            <TimeUpdateable timeStamp={interlocutor?.lastOnlineTime} />
          </div>
        )}
      </div>

      {icon && <div className="select-entity__icon-holder">{icon}</div>}
      {changeSelectedState &&
        (isSelected ? (
          <SelectedSvg className="select-entity__selected" />
        ) : (
          <div className="select-entity__select" />
        ))}
    </div>
  );
};
