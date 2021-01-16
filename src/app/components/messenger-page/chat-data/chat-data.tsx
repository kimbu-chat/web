import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsInfoOpenedSelector, getSelectedChatSelector } from 'store/chats/selectors';

import './chat-data.scss';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { IUserPreview, UserStatus } from 'app/store/models';
import { Avatar, SearchBox, StatusBadge } from 'components';

import VoiceCallSvg from 'icons/audio-call.svg';
import VideoCallSvg from 'icons/video-call.svg';
import SearchSvg from 'icons/search.svg';
import ChatInfoSvg from 'icons/chat-info.svg';

import { getChatInterlocutor, getInterlocutorInitials } from 'utils/interlocutor-name-utils';
import { GetMessages } from 'app/store/chats/features/get-messages/get-messages';
import { MESSAGES_LIMIT } from 'app/utils/pagination-limits';
import { TimeUpdateable } from 'app/components/shared/time-updateable/time-updateable';
import { ChangeChatInfoOpened } from 'app/store/chats/features/change-chat-info-opened/change-chat-info-opened';

export const ChatData = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const selectedChat = useSelector(getSelectedChatSelector);
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);
  const getMessages = useActionWithDispatch(GetMessages.action);
  const openCloseChatInfo = useActionWithDispatch(ChangeChatInfoOpened.action);

  const [isSearching, setIsSearching] = useState(false);
  const changeSearchingState = useCallback(() => {
    setIsSearching((oldState) => !oldState);
  }, [setIsSearching]);

  const callWithVideo = useCallback(
    () =>
      callInterlocutor({
        calling: selectedChat?.interlocutor as IUserPreview,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      }),
    [selectedChat?.interlocutor],
  );

  const callWithAudio = useCallback(
    () =>
      callInterlocutor({
        calling: selectedChat?.interlocutor as IUserPreview,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      }),
    [selectedChat?.interlocutor],
  );

  const searchMessages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pageData = {
      limit: MESSAGES_LIMIT,
      offset: 0,
    };

    getMessages({
      page: pageData,
      isFromSearch: true,
      searchString: e.target.value,
    });
  }, []);

  if (selectedChat) {
    return (
      <div className='chat-data__chat-data'>
        <button type='button' onClick={openCloseChatInfo} className='chat-data__contact-data'>
          {selectedChat.interlocutor && (
            <StatusBadge containerClassName='chat-data__contact-img-container' additionalClassNames='chat-data__contact-img' user={selectedChat.interlocutor} />
          )}

          {selectedChat.groupChat && (
            <div className='chat-data__contact-img-container'>
              <Avatar className='chat-data__contact-img' src={selectedChat.groupChat?.avatar?.previewUrl}>
                {getInterlocutorInitials(selectedChat)}
              </Avatar>
            </div>
          )}

          <div className='chat-data__chat-info'>
            <h1>{getChatInterlocutor(selectedChat)}</h1>
            <p>
              {selectedChat.groupChat ? (
                `${selectedChat.groupChat.membersCount} ${t('chatData.members')}`
              ) : selectedChat?.interlocutor?.status === UserStatus.Online ? (
                t('chatData.online')
              ) : (
                <>
                  <span>{`${t('chatData.last-time')} `}</span> <TimeUpdateable timeStamp={selectedChat?.interlocutor?.lastOnlineTime} />
                </>
              )}
            </p>
          </div>
        </button>
        <div className='chat-data__buttons-group'>
          {selectedChat.interlocutor && (
            <button type='button' className='chat-data__button' onClick={callWithAudio}>
              <VoiceCallSvg />
            </button>
          )}
          {selectedChat.interlocutor && (
            <button type='button' className='chat-data__button' onClick={callWithVideo}>
              <VideoCallSvg />
            </button>
          )}

          {(isSearching || (selectedChat.messages.searchString?.length || 0) > 0) && (
            <SearchBox value={selectedChat.messages.searchString || ''} onChange={searchMessages} />
          )}

          <button type='button' onClick={changeSearchingState} className='chat-data__button'>
            <SearchSvg />
          </button>

          <button type='button' onClick={openCloseChatInfo} className={`chat-data__button ${isInfoOpened ? 'chat-data__button--active' : ''}`}>
            <ChatInfoSvg />
          </button>
        </div>
      </div>
    );
  }
  return <div className='chat-data__chat-data' />;
});
