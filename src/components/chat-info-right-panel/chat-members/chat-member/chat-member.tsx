import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { TimeUpdateable } from '@components/time-updateable';
import { Avatar } from '@components/avatar';
import { MyProfileService } from '@services/my-profile-service';
import { getUserName } from '@utils/user-utils';
import { getUserSelector } from '@store/users/selectors';

import { DeleteChatMemberModal } from '../delete-chat-member-modal/delete-chat-member-modal';

import './chat-member.scss';

interface IMemberProps {
  memberId: number;
  isOwner: boolean;
}

const BLOCK_NAME = 'chat-member';

export const Member: React.FC<IMemberProps> = ({ memberId, isOwner }) => {
  const { t } = useTranslation();

  const member = useSelector(getUserSelector(memberId));

  const [removeChatMemberModalDisplayed, setRemoveChatMemberModalDisplayed] = useState(false);
  const changeRemoveChatMemberModalDisplayed = useCallback(() => {
    setRemoveChatMemberModalDisplayed((oldState) => !oldState);
  }, [setRemoveChatMemberModalDisplayed]);

  const myId = new MyProfileService().myProfile.id;

  const itIsMe = member?.id === myId;

  return (
    <>
      <div className={BLOCK_NAME}>
        {member && (
          <Avatar
            className={classnames(`${BLOCK_NAME}__avatar`, {
              [`${BLOCK_NAME}__avatar--owner`]: isOwner,
            })}
            size={isOwner ? 52 : 48}
            user={member}
          />
        )}

        <div className={`${BLOCK_NAME}__data`}>
          <div className={`${BLOCK_NAME}__name-line`}>
            <h3 className={`${BLOCK_NAME}__name`}>{member && getUserName(member, t)}</h3>
            {isOwner && <div className={`${BLOCK_NAME}__owner`}>{t('chatMember.owner')}</div>}
          </div>

          {!member?.deleted &&
            (member?.online ? (
              <span className={`${BLOCK_NAME}__status`}>{t('chatData.online')}</span>
            ) : (
              <span className={`${BLOCK_NAME}__status`}>
                <TimeUpdateable timeStamp={member?.lastOnlineTime} />
              </span>
            ))}
        </div>

        {!isOwner && !itIsMe && (
          <button
            onClick={changeRemoveChatMemberModalDisplayed}
            type="button"
            className={`${BLOCK_NAME}__delete-user`}>
            <DeleteSvg viewBox="0 0 15 16" />
          </button>
        )}
      </div>

      {member && removeChatMemberModalDisplayed && (
        <DeleteChatMemberModal user={member} hide={changeRemoveChatMemberModalDisplayed} />
      )}
    </>
  );
};
