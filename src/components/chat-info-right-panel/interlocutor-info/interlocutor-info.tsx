import React from 'react';

import classnames from 'classnames';
import { parsePhoneNumber } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as DogSvg } from '@icons/@.svg';
import { ReactComponent as EditSvg } from '@icons/crayon.svg';
import { ReactComponent as PhoneSvg } from '@icons/phone-chat-info.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { getInfoChatSelector } from '@store/chats/selectors';
import { getUserSelector } from '@store/users/selectors';
import { replaceInUrl } from '@utils/replace-in-url';
import { getChatInterlocutor } from '@utils/user-utils';

import { EditChatModal } from '../../edit-chat-modal/edit-chat-modal';

import './interlocutor-info.scss';

const BLOCK_NAME = 'interlocutor-info';

export const InterlocutorInfo = () => {
  const { t } = useTranslation();

  const chat = useSelector(getInfoChatSelector);
  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));
  const groupChat = chat?.groupChat;

  const [editGroupChatDisplayed, displayEditGroupChat, hideEditGroupChat] = useToggledState(false);

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
              onClick={displayEditGroupChat}
              className={`${BLOCK_NAME}__rename-btn`}>
              <EditSvg viewBox="0 0 16 16" />
            </button>
          )}
        </div>

        {interlocutor && !interlocutor.deleted && (
          <div className={`${BLOCK_NAME}__info-block`}>
            <PhoneSvg className={`${BLOCK_NAME}__info-svg`} />
            <div className={`${BLOCK_NAME}__data-value`}>
              {interlocutor?.phoneNumber &&
                parsePhoneNumber(interlocutor?.phoneNumber).formatInternational()}
            </div>
          </div>
        )}

        <div className={`${BLOCK_NAME}__info-block`}>
          <DogSvg className={`${BLOCK_NAME}__info-svg`} />
          <Link
            to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', chat?.id])}
            className={classnames(`${BLOCK_NAME}__data-value`, `${BLOCK_NAME}__data-value--link`)}>
            {`${
              interlocutor
                ? `@${interlocutor?.nickname}`
                : `${window.location.host}${replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, [
                    'id?',
                    chat?.id,
                  ])}`
            }`}
          </Link>
        </div>
      </div>

      {editGroupChatDisplayed && <EditChatModal onClose={hideEditGroupChat} />}
    </>
  );
};
