import React, { useCallback, useState } from 'react';
import './interlocutor-info.scss';

import PhoneSvg from '@icons/phone-chat-info.svg';
import EditSvg from '@icons/crayon.svg';
import DogSvg from '@icons/@.svg';

import { useSelector } from 'react-redux';
import { getSelectedChatIdSelector, getSelectedInterlocutorSelector, getSelectedGroupChatSelector } from '@store/chats/selectors';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Link } from 'react-router-dom';
import { FadeAnimationWrapper } from '@components';
import { EditChatModal } from '../../edit-chat-modal/edit-chat-modal';

export const InterlocutorInfo = React.memo(() => {
  const selectedChatId = useSelector(getSelectedChatIdSelector);
  const interlocutor = useSelector(getSelectedInterlocutorSelector);
  const groupChat = useSelector(getSelectedGroupChatSelector);

  const [editGroupChatDisplayed, setEditGroupChatDisplayed] = useState(false);
  const changeEditGroupChatDisplayedState = useCallback(() => {
    setEditGroupChatDisplayed((oldState) => !oldState);
  }, [setEditGroupChatDisplayed]);

  return (
    <>
      <div className='interlocutor-info'>
        <div className='interlocutor-info__interlocutor-data'>
          <div />
          <div className='interlocutor-info__chat-data'>
            <div className='interlocutor-info__interlocutor'>{interlocutor ? `${interlocutor.firstName} ${interlocutor.lastName}` : groupChat?.name}</div>
            {groupChat?.description && <div className='interlocutor-info__description'>{groupChat?.description}</div>}
          </div>

          <div>
            <button type='button' onClick={changeEditGroupChatDisplayedState} className='interlocutor-info__rename-btn'>
              <EditSvg />
            </button>
          </div>
        </div>

        {interlocutor && (
          <div className='interlocutor-info__info-block'>
            <PhoneSvg className='interlocutor-info__info-svg' />
            <div className='interlocutor-info__data-value'>{parsePhoneNumber(interlocutor?.phoneNumber).formatInternational()}</div>
          </div>
        )}

        <div className='interlocutor-info__info-block'>
          <DogSvg className='interlocutor-info__info-svg' />
          <Link to={`/chats/${selectedChatId}`} className='interlocutor-info__data-value interlocutor-info__data-value--link'>{`${
            interlocutor ? `@${interlocutor?.nickname}` : `ravudi.com/chats/${selectedChatId}2`
          }`}</Link>
        </div>
      </div>

      <FadeAnimationWrapper isDisplayed={editGroupChatDisplayed}>
        <EditChatModal onClose={changeEditGroupChatDisplayedState} />
      </FadeAnimationWrapper>
    </>
  );
});
