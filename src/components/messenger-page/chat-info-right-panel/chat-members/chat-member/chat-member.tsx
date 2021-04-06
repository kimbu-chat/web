import React, { useCallback, useState } from 'react';

import './chat-member.scss';

import { IUser, UserStatus } from '@store/common/models';

import { useTranslation } from 'react-i18next';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { FadeAnimationWrapper, StatusBadge, TimeUpdateable } from '@components/shared';
import { MyProfileService } from '@services/my-profile-service';
import { DeleteChatMemberModal } from '../delete-chat-member-modal/delete-chat-member-modal';

interface IMemberProps {
  member: IUser;
}

export const Member: React.FC<IMemberProps> = React.memo(({ member }) => {
  const { t } = useTranslation();

  const [removeChatMemberModalDisplayed, setRemoveChatMemberModalDisplayed] = useState(false);
  const changeRemoveChatMemberModalDisplayed = useCallback(() => {
    setRemoveChatMemberModalDisplayed((oldState) => !oldState);
  }, [setRemoveChatMemberModalDisplayed]);

  const myId = new MyProfileService().myProfile.id;

  // TODO: isOwner logic is not implemented at all
  const isOwner = false;
  const itIsMe = member.id === myId;

  return (
    <>
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
        {!isOwner && !itIsMe && (
          <button
            onClick={changeRemoveChatMemberModalDisplayed}
            type="button"
            className="chat-member__delete-user">
            <DeleteSvg viewBox="0 0 15 16" />
          </button>
        )}
      </div>

      <FadeAnimationWrapper isDisplayed={removeChatMemberModalDisplayed}>
        <DeleteChatMemberModal user={member} hide={changeRemoveChatMemberModalDisplayed} />
      </FadeAnimationWrapper>
    </>
  );
});
