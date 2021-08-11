import React, { useCallback, useState } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { TimeUpdateable } from '@components/time-updateable';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { ChatId } from '@store/chats/chat-id';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import { replaceInUrl } from '@utils/replace-in-url';
import { getUserName } from '@utils/user-utils';

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

  const myId = useSelector(myIdSelector);

  const itIsMe = member?.id === myId;

  return (
    <>
      <div className={BLOCK_NAME}>
        {member && (
          <Link
            data-not-clickable={itIsMe}
            to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', ChatId.from(memberId).id])}>
            <Avatar
              className={classnames(`${BLOCK_NAME}__avatar`, {
                [`${BLOCK_NAME}__avatar--owner`]: isOwner,
              })}
              size={isOwner ? 52 : 48}
              user={member}
            />
          </Link>
        )}

        <div className={`${BLOCK_NAME}__data`}>
          <Link
            data-not-clickable={itIsMe}
            to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', ChatId.from(memberId).id])}
            className={`${BLOCK_NAME}__name-line`}>
            <h3 className={`${BLOCK_NAME}__name`}>{member && getUserName(member, t)}</h3>
            {(isOwner || itIsMe) && (
              <div className={`${BLOCK_NAME}__owner`}>
                {isOwner ? t('chatMember.owner') : itIsMe && t('chatMember.me')}
              </div>
            )}
          </Link>

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
            <DeleteSvg />
          </button>
        )}
      </div>

      {member && removeChatMemberModalDisplayed && !itIsMe && (
        <DeleteChatMemberModal user={member} hide={changeRemoveChatMemberModalDisplayed} />
      )}
    </>
  );
};
