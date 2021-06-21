import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { ReactComponent as PhoneSvg } from '@icons/phone-chat-info.svg';
import { ReactComponent as EditSvg } from '@icons/crayon.svg';
import { ReactComponent as DogSvg } from '@icons/@.svg';
import { getInfoChatSelector } from '@store/chats/selectors';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import { getChatInterlocutor } from '@utils/user-utils';
import { getUserSelector } from '@store/users/selectors';

import { EditChatModal } from '../../edit-chat-modal/edit-chat-modal';

import './interlocutor-info.scss';

const BLOCK_NAME = 'interlocutor-info';

export const InterlocutorInfo = () => {
  const { t } = useTranslation();

  const chat = useSelector(getInfoChatSelector);
  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));
  const groupChat = chat?.groupChat;

  const [editGroupChatDisplayed, setEditGroupChatDisplayed] = useState(false);
  const changeEditGroupChatDisplayedState = useCallback(() => {
    setEditGroupChatDisplayed((oldState) => !oldState);
  }, [setEditGroupChatDisplayed]);

  return (
    <>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__interlocutor-data`}>
          <div className={`${BLOCK_NAME}__chat-data`}>
            <div className={`${BLOCK_NAME}__interlocutor`}>
              {getChatInterlocutor(interlocutor, chat, t)}
            </div>
            {groupChat?.description && (
              <div className={`${BLOCK_NAME}__description`}>{groupChat?.description}</div>
            )}
          </div>

          {groupChat && (
            <button
              type="button"
              onClick={changeEditGroupChatDisplayedState}
              className={`${BLOCK_NAME}__rename-btn`}>
              <EditSvg viewBox="0 0 16 16" />
            </button>
          )}
        </div>

        {interlocutor && !interlocutor.deleted && (
          <div className={`${BLOCK_NAME}__info-block`}>
            <PhoneSvg className={`${BLOCK_NAME}__info-svg`} />
            <div className={`${BLOCK_NAME}__data-value`}>
              {parsePhoneNumber(interlocutor?.phoneNumber).formatInternational()}
            </div>
          </div>
        )}

        <div className={`${BLOCK_NAME}__info-block`}>
          <DogSvg className={`${BLOCK_NAME}__info-svg`} />
          <Link
            to={`/chats/${chat?.id}`}
            className={classnames(`${BLOCK_NAME}__data-value`, `${BLOCK_NAME}__data-value--link`)}>
            {`${interlocutor ? `@${interlocutor?.nickname}` : ` kimbu.io/chats/${chat?.id}2`}`}
          </Link>
        </div>
      </div>

      <FadeAnimationWrapper isDisplayed={editGroupChatDisplayed}>
        <EditChatModal onClose={changeEditGroupChatDisplayedState} />
      </FadeAnimationWrapper>
    </>
  );
};
