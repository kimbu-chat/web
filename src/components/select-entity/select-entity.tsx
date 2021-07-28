import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { TimeUpdateable } from '@components/time-updateable';
import { ReactComponent as SelectedSvg } from '@icons/checked.svg';
import { INormalizedChat } from '@store/chats/models';
import { getChatSelector } from '@store/chats/selectors';
import { IUser } from '@store/common/models';
import { getUserSelector } from '@store/users/selectors';
import { getUserName } from '@utils/user-utils';

import './select-entity.scss';

interface ISelectEntityProps {
  changeSelectedState?: (id: number) => void;
  isSelected?: boolean;
  chatId?: number;
  userId?: number;
  icon?: JSX.Element;
  onClick?: (chat: INormalizedChat | IUser) => void;
}

const BLOCK_NAME = 'select-entity';

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
  const chatInterlocutor = useSelector(getUserSelector(chat?.interlocutorId));

  const interlocutor = chatInterlocutor || userInterlocutor;

  const groupChat = chat?.groupChat;

  const { t } = useTranslation();

  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick((chat || interlocutor) as INormalizedChat | IUser);
    }

    if (changeSelectedState) {
      changeSelectedState((userId || chatId) as number);
    }
  }, [onClick, changeSelectedState, chat, interlocutor, userId, chatId]);

  return (
    <div onClick={onClickOnThisContact} className={`${BLOCK_NAME}__friend`}>
      <Avatar
        className={`${BLOCK_NAME}__avatar`}
        size={48}
        user={interlocutor}
        groupChat={groupChat}
      />

      <div className={`${BLOCK_NAME}__friend-data`}>
        <div className={`${BLOCK_NAME}__friend-name`}>
          {groupChat ? groupChat?.name : interlocutor && getUserName(interlocutor, t)}
        </div>
        {interlocutor && !interlocutor?.deleted && (
          <div className={`${BLOCK_NAME}__friend-status`}>
            {interlocutor.online ? (
              t('selectEntity.online')
            ) : (
              <TimeUpdateable timeStamp={interlocutor?.lastOnlineTime} />
            )}
          </div>
        )}
      </div>

      {icon && !interlocutor?.deleted && <div className={`${BLOCK_NAME}__icon-holder`}>{icon}</div>}
      {changeSelectedState &&
        (isSelected ? (
          <SelectedSvg className={`${BLOCK_NAME}__selected`} />
        ) : (
          <div className={`${BLOCK_NAME}__select`} />
        ))}
    </div>
  );
};
