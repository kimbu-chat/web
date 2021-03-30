import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { getIsInfoOpenedSelector, getSelectedChatSelector } from '@store/chats/selectors';

import './chat-top-bar.scss';
import { LocalizationContext } from '@contexts';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import * as CallActions from '@store/calls/actions';
import { IUser, UserStatus } from '@store/common/models';
import { Avatar, StatusBadge, TimeUpdateable } from '@components';

import VoiceCallSvg from '@icons/audio-call.svg';
import VideoCallSvg from '@icons/video-call.svg';
import ChatInfoSvg from '@icons/chat-info.svg';
import TypingSvg from '@icons/typing.svg';

import { getChatInterlocutor, getInterlocutorInitials } from '@utils/interlocutor-name-utils';
import { ChangeChatInfoOpened } from '@store/chats/features/change-chat-info-opened/change-chat-info-opened';
import { MessagesSearch } from './messages-search/messages-search';

export const ChatTopBar = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const selectedChat = useSelector(getSelectedChatSelector);
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);
  const openCloseChatInfo = useActionWithDispatch(ChangeChatInfoOpened.action);

  const callWithVideo = useCallback(
    () =>
      callInterlocutor({
        calling: selectedChat?.interlocutor as IUser,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      }),
    [selectedChat?.interlocutor, callInterlocutor],
  );

  const callWithAudio = useCallback(
    () =>
      callInterlocutor({
        calling: selectedChat?.interlocutor as IUser,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      }),
    [selectedChat?.interlocutor, callInterlocutor],
  );

  if (selectedChat) {
    return (
      <div className="chat-data__chat-data">
        <button type="button" onClick={openCloseChatInfo} className="chat-data__contact-data">
          {selectedChat.interlocutor && (
            <StatusBadge
              containerClassName="chat-data__contact-img-container"
              additionalClassNames="chat-data__contact-img"
              user={selectedChat.interlocutor}
            />
          )}

          {selectedChat.groupChat && (
            <div className="chat-data__contact-img-container">
              <Avatar
                className="chat-data__contact-img"
                src={selectedChat.groupChat?.avatar?.previewUrl}>
                {getInterlocutorInitials(selectedChat)}
              </Avatar>
            </div>
          )}

          <div className="chat-data__chat-info">
            <h1 className="chat-data__chat-info__title">{getChatInterlocutor(selectedChat)}</h1>
            <p className="chat-data__chat-info__info">
              {(selectedChat.typingInterlocutors?.length || 0) > 0 ? (
                <div className="chat-data__chat-info__info__typing">
                  <TypingSvg viewBox="0 0 12 12" />
                  <span>{t('chatData.typing')}</span>
                </div>
              ) : selectedChat.groupChat ? (
                `${selectedChat.groupChat.membersCount} ${t('chatData.members')}`
              ) : selectedChat?.interlocutor?.status === UserStatus.Online ? (
                t('chatData.online')
              ) : (
                <>
                  <span>{`${t('chatData.last-time')} `}</span>{' '}
                  <TimeUpdateable timeStamp={selectedChat?.interlocutor?.lastOnlineTime} />
                </>
              )}
            </p>
          </div>
        </button>
        <div className="chat-data__buttons-group">
          {selectedChat.interlocutor && (
            <button type="button" className="chat-data__button" onClick={callWithAudio}>
              <VoiceCallSvg />
            </button>
          )}
          {selectedChat.interlocutor && (
            <button type="button" className="chat-data__button" onClick={callWithVideo}>
              <VideoCallSvg />
            </button>
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
});
