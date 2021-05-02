import React, { useCallback, useState } from 'react';

import './chat-member.scss';

import { useTranslation } from 'react-i18next';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { FadeAnimationWrapper, StatusBadge, TimeUpdateable } from '@components/shared';
import { MyProfileService } from '@services/my-profile-service';
import { getUserName } from '@utils/user-utils';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@store/users/selectors';
import { DeleteChatMemberModal } from '../delete-chat-member-modal/delete-chat-member-modal';

interface IMemberProps {
  memberId: number;
}

export const Member: React.FC<IMemberProps> = ({ memberId }) => {
  const { t } = useTranslation();

  const member = useSelector(getUserSelector(memberId));

  const [removeChatMemberModalDisplayed, setRemoveChatMemberModalDisplayed] = useState(false);
  const changeRemoveChatMemberModalDisplayed = useCallback(() => {
    setRemoveChatMemberModalDisplayed((oldState) => !oldState);
  }, [setRemoveChatMemberModalDisplayed]);

  const myId = new MyProfileService().myProfile.id;

  // TODO: isOwner logic is not implemented at all
  const isOwner = false;
  const itIsMe = member?.id === myId;

  return (
    <>
      <div className="chat-member">
        {member && (
          <StatusBadge
            containerClassName={`chat-member__avatar-container ${
              isOwner ? 'chat-member__avatar-container--owner' : ''
            }`}
            additionalClassNames="chat-member__avatar"
            user={member}
          />
        )}

        <div className="chat-member__data">
          <div className="chat-member__name-line">
            <h3 className="chat-member__name">{member && getUserName(member, t)}</h3>
            {isOwner && <div className="chat-member__owner">{t('chatMember.owner')}</div>}
          </div>

          {!member?.deleted &&
            (member?.online ? (
              <span className="chat-member__status">
                <TimeUpdateable timeStamp={member?.lastOnlineTime} />
              </span>
            ) : (
              <span className="chat-member__status">{t('chatData.online')}</span>
            ))}
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

      {member && (
        <FadeAnimationWrapper isDisplayed={removeChatMemberModalDisplayed}>
          <DeleteChatMemberModal user={member} hide={changeRemoveChatMemberModalDisplayed} />
        </FadeAnimationWrapper>
      )}
    </>
  );
};
