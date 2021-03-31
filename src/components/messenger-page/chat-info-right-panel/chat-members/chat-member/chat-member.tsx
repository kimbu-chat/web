import React, { useContext } from 'react';

import './chat-member.scss';

import { IUser, UserStatus } from '@store/common/models';
import { LocalizationContext } from '@contexts';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { StatusBadge, TimeUpdateable } from '@components/shared';

interface IMemberProps {
  member: IUser;
}

export const Member: React.FC<IMemberProps> = React.memo(({ member }) => {
  const { t } = useContext(LocalizationContext);

  const isOwner = member.firstName.includes('77');

  return (
    <div className="chat-member">
      <StatusBadge
        containerClassName={`chat-member__avatar-container ${
          isOwner ? 'chat-member__avatar-container--owner' : ''
        }`}
        additionalClassNames="chat-member__avatar"
        user={member}
      />

      <div className="chat-member__data">
        <div className="chat-member__name-line">
          <h3 className="chat-member__name">{`${member?.firstName} ${member?.lastName}`}</h3>
          {isOwner && <div className="chat-member__owner">{t('chatMember.owner')}</div>}
        </div>

        {member?.status === UserStatus.Offline ? (
          <span className="chat-member__status">{t('chatData.online')}</span>
        ) : (
          <span className="chat-member__status">
            <TimeUpdateable timeStamp={member?.lastOnlineTime} />
          </span>
        )}
      </div>
      {!isOwner && (
        <button type="button" className="chat-member__delete-user">
          <DeleteSvg viewBox="0 0 15 16" />
        </button>
      )}
    </div>
  );
});
