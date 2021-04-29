import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getIsInfoOpenedSelector, getSelectedChatSelector } from '@store/chats/selectors';

import './chat-top-bar.scss';

import { useTranslation } from 'react-i18next';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { outgoingCallAction } from '@store/calls/actions';
import { IUser } from '@store/common/models';
import { Avatar, StatusBadge, TimeUpdateable } from '@components/shared';

import { ReactComponent as VoiceCallSvg } from '@icons/audio-call.svg';
import { ReactComponent as VideoCallSvg } from '@icons/video-call.svg';
import { ReactComponent as ChatInfoSvg } from '@icons/chat-info.svg';
import { ReactComponent as TypingSvg } from '@icons/typing.svg';

import { getChatInterlocutor } from '@utils/user-utils';
import { changeChatInfoOpenedAction } from '@store/chats/actions';
import { getUserSelector } from '@store/users/selectors';
import { MessagesSearch } from './messages-search/messages-search';

export const ChatTopBar = () => {
  const { t } = useTranslation();

  const selectedChat = useSelector(getSelectedChatSelector);
  const interlocutor = useSelector(getUserSelector(selectedChat?.interlocutor));
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  const callInterlocutor = useActionWithDispatch(outgoingCallAction);
  const openCloseChatInfo = useActionWithDispatch(changeChatInfoOpenedAction);

  const callWithVideo = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as IUser,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      }),
    [interlocutor, callInterlocutor],
  );

  const callWithAudio = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as IUser,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      }),
    [interlocutor, callInterlocutor],
  );

  const interlocutorStatus = interlocutor?.online ? (
    t('chatData.online')
  ) : (
    <>
      <span>{`${t('chatData.last-time')} `}</span>{' '}
      <TimeUpdateable timeStamp={interlocutor?.lastOnlineTime} />
    </>
  );

  const groupChatOrInterlocutorStatus = selectedChat?.groupChat
    ? `${selectedChat.groupChat.membersCount} ${t('chatData.members')}`
    : interlocutorStatus;

  if (selectedChat) {
    return (
      <div className="chat-data__chat-data">
        <button type="button" onClick={openCloseChatInfo} className="chat-data__contact-data">
          {interlocutor && (
            <StatusBadge
              containerClassName="chat-data__contact-img-container"
              additionalClassNames="chat-data__contact-img"
              user={interlocutor}
            />
          )}

          {selectedChat.groupChat && (
            <div className="chat-data__contact-img-container">
              <Avatar className="chat-data__contact-img" groupChat={selectedChat.groupChat} />
            </div>
          )}

          <div className="chat-data__chat-info">
            <h1 className="chat-data__chat-info__title">
              {getChatInterlocutor(interlocutor, selectedChat, t)}
            </h1>

            {!interlocutor?.deleted && (
              <div className="chat-data__chat-info__info">
                {selectedChat.typingInterlocutors &&
                selectedChat.typingInterlocutors?.length > 0 ? (
                  <div className="chat-data__chat-info__info__typing">
                    <TypingSvg viewBox="0 0 12 12" />
                    <span>{t('chatData.typing')}</span>
                  </div>
                ) : (
                  groupChatOrInterlocutorStatus
                )}
              </div>
            )}
          </div>
        </button>
        <div className="chat-data__buttons-group">
          {interlocutor && !interlocutor?.deleted && (
            <>
              <button type="button" className="chat-data__button" onClick={callWithAudio}>
                <VoiceCallSvg />
              </button>

              <button type="button" className="chat-data__button" onClick={callWithVideo}>
                <VideoCallSvg />
              </button>
            </>
          )}

          <MessagesSearch />

          <button
            type="button"
            onClick={openCloseChatInfo}
            className={`chat-data__button ${isInfoOpened ? 'chat-data__button--active' : ''}`}>
            <ChatInfoSvg />
          </button>
        </div>
      </div>
    );
  }
  return <div className="chat-data__chat-data" />;
};
