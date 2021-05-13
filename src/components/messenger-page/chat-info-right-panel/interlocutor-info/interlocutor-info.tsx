import React, { useCallback, useState } from 'react';
import './interlocutor-info.scss';

import { ReactComponent as PhoneSvg } from '@icons/phone-chat-info.svg';
import { ReactComponent as EditSvg } from '@icons/crayon.svg';
import { ReactComponent as DogSvg } from '@icons/@.svg';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getInfoChatSelector } from '@store/chats/selectors';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Link } from 'react-router-dom';
import { FadeAnimationWrapper } from '@components/shared';
import { getChatInterlocutor } from '@utils/user-utils';
import { getUserSelector } from '@store/users/selectors';
import { EditChatModal } from '../../edit-chat-modal/edit-chat-modal';

export const InterlocutorInfo = () => {
  const { t } = useTranslation();

  const chat = useSelector(
    getInfoChatSelector,
    (prev, next) => prev === next || prev?.draftMessage !== next?.draftMessage,
  );
  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));
  const groupChat = chat?.groupChat;

  const [editGroupChatDisplayed, setEditGroupChatDisplayed] = useState(false);
  const changeEditGroupChatDisplayedState = useCallback(() => {
    setEditGroupChatDisplayed((oldState) => !oldState);
  }, [setEditGroupChatDisplayed]);

  return (
    <>
      <div className="interlocutor-info">
        <div className="interlocutor-info__interlocutor-data">
          <div className="interlocutor-info__chat-data">
            <div className="interlocutor-info__interlocutor">
              {getChatInterlocutor(interlocutor, chat, t)}
            </div>
            {groupChat?.description && (
              <div className="interlocutor-info__description">{groupChat?.description}</div>
            )}
          </div>

          {groupChat && (
            <button
              type="button"
              onClick={changeEditGroupChatDisplayedState}
              className="interlocutor-info__rename-btn">
              <EditSvg viewBox="0 0 16 16" />
            </button>
          )}
        </div>

        {interlocutor && !interlocutor.deleted && (
          <div className="interlocutor-info__info-block">
            <PhoneSvg className="interlocutor-info__info-svg" />
            <div className="interlocutor-info__data-value">
              {parsePhoneNumber(interlocutor?.phoneNumber).formatInternational()}
            </div>
          </div>
        )}

        <div className="interlocutor-info__info-block">
          <DogSvg className="interlocutor-info__info-svg" />
          <Link
            to={`/chats/${chat?.id}`}
            className="interlocutor-info__data-value interlocutor-info__data-value--link">
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
