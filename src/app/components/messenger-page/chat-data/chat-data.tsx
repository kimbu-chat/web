import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'store/chats/selectors';

import './chat-data.scss';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { IUserPreview, UserStatus } from 'app/store/models';
import { Avatar, SearchBox } from 'components';

import VoiceCallSvg from 'icons/ic-call.svg';
import VideoCallSvg from 'icons/ic-video-call.svg';
import SearchSvg from 'icons/ic-search.svg';
import ChatInfoSvg from 'icons/ic-info.svg';
import { useLocation } from 'react-router';
import { Link, NavLink } from 'react-router-dom';

import { getChatInterlocutor, getInterlocutorInitials } from 'utils/interlocutor-name-utils';
import { GetMessages } from 'app/store/chats/features/get-messages/get-messages';
import { MESSAGES_LIMIT } from 'app/utils/pagination-limits';
import { TimeUpdateable } from 'app/components/shared/time-updateable/time-updateable';

export const ChatData = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const location = useLocation();

  const selectedChat = useSelector(getSelectedChatSelector);

  const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);
  const getMessages = useActionWithDispatch(GetMessages.action);

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
    const imageUrl: string = selectedChat.groupChat?.avatar?.previewUrl || selectedChat?.interlocutor?.avatar?.previewUrl || '';

    return (
      <div className='chat-data__chat-data'>
        <Link
          to={
            location.pathname.includes('info')
              ? location.pathname.replace(/info\/?(photo|video|files|audio-recordings|audios)?\/?/, '')
              : location.pathname.replace(
                  /(chats|contacts|settings|calls)\/?([0-9]{1,}|edit-profile|notifications|language|typing)?\/?/,
                  (_all, groupOne, groupTwo) => `${groupOne}${groupTwo ? `/${groupTwo}` : ''}/info`,
                )
          }
          className='chat-data__contact-data'
        >
          <Avatar className='chat-data__contact-img' src={imageUrl}>
            {getInterlocutorInitials(selectedChat)}
          </Avatar>

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
        </Link>
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

          {isSearching && <SearchBox onChange={searchMessages} />}

          <button type='button' onClick={changeSearchingState} className='chat-data__button'>
            <SearchSvg />
          </button>

          <NavLink
            to={
              location.pathname.includes('info')
                ? location.pathname.replace(/info\/?(photo|video|files|audio-recordings|audios)?\/?/, '')
                : location.pathname.replace(
                    /(chats|contacts|settings|calls)\/?([0-9]{1,}|edit-profile|notifications|language|typing)?\/?/,
                    (_all, groupOne, groupTwo) => `${groupOne}${groupTwo ? `/${groupTwo}` : ''}/info`,
                  )
            }
            isActive={(match, location) => {
              if (match && location.pathname.includes('info')) {
                return true;
              }
              return false;
            }}
            className='chat-data__button'
            activeClassName='chat-data__button--active'
          >
            <ChatInfoSvg />
          </NavLink>
        </div>
      </div>
    );
  }
  return <div className='chat-data__chat-data' />;
});
