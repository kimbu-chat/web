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

interface ISelectEntityProps {
  changeSelectedState?: (id: number) => void;
  isSelected?: boolean;
  chatOrUser: IChat | IUser;
  icon?: JSX.Element;
  onClick?: (chat: IChat | IUser) => void;
}

export const SelectEntity: React.FC<ISelectEntityProps> = ({
  changeSelectedState,
  chatOrUser,
  isSelected,
  onClick,
  icon,
}) => {
  const onClickOnThisContact = useCallback(() => {
    if (onClick) {
      onClick(chatOrUser);
    }

    if (changeSelectedState) {
      changeSelectedState(chatOrUser.id);
    }
  }, [changeSelectedState, onClick, chatOrUser]);

  const chatInterlocutor = useSelector(getUserSelector((chatOrUser as IChat).interlocutor));

  const interlocutor = chatInterlocutor || (chatOrUser as IUser);

  const groupChat = (chatOrUser as IChat)?.groupChat;

  const { t } = useTranslation();

  return (
    <div onClick={onClickOnThisContact} className="select-entity__friend">
      {groupChat ? (
        <div className="select-entity__avatar-container">
          <Avatar className="select-entity__avatar" groupChat={groupChat} />
        </div>
      ) : (
        <StatusBadge
          containerClassName="select-entity__avatar-container"
          additionalClassNames="select-entity__avatar"
          user={interlocutor}
        />
      )}

      <div className="select-entity__friend-data">
        <div className="select-entity__friend-name">
          {groupChat ? groupChat?.name : getUserName(interlocutor, t)}
        </div>
        {!groupChat && !interlocutor.deleted && (
          <div className="select-entity__friend-status">
            <TimeUpdateable timeStamp={interlocutor.lastOnlineTime} />
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
