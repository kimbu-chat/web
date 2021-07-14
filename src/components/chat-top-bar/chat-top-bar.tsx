import React, { useCallback, useLayoutEffect, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { ChatInfoRightPanel } from '@components/chat-info-right-panel';
import { TimeUpdateable } from '@components/time-updateable';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useAnimation } from '@hooks/use-animation';
import { ReactComponent as VoiceCallSvg } from '@icons/audio-call.svg';
import { ReactComponent as TypingSvg } from '@icons/typing.svg';
import { ReactComponent as VideoCallSvg } from '@icons/video-call.svg';
import { outgoingCallAction } from '@store/calls/actions';
import { changeChatInfoOpenedAction } from '@store/chats/actions';
import { getIsInfoOpenedSelector, getSelectedChatSelector } from '@store/chats/selectors';
import { getUserSelector } from '@store/users/selectors';
import { getChatInterlocutor } from '@utils/user-utils';

import { ChatInfoBtn } from './chat-info-btn/chat-info-btn';
import { MessagesSearch } from './messages-search/messages-search';

import './chat-top-bar.scss';

const BLOCK_NAME = 'chat-data';

export const ChatTopBar = () => {
  const { t } = useTranslation();

  const selectedChat = useSelector(getSelectedChatSelector);
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);
  const interlocutor = useSelector(getUserSelector(selectedChat?.interlocutorId));

  const callInterlocutor = useActionWithDispatch(outgoingCallAction);
  const openCloseChatInfo = useActionWithDispatch(changeChatInfoOpenedAction);

  const callWithVideo = useCallback(() => {
    if (interlocutor?.id) {
      callInterlocutor({
        callingUserId: interlocutor.id,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      });
    }
  }, [interlocutor, callInterlocutor]);

  const callWithAudio = useCallback(() => {
    if (interlocutor?.id) {
      callInterlocutor({
        callingUserId: interlocutor.id,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      });
    }
  }, [interlocutor, callInterlocutor]);

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

  const { rootClass, animatedClose } = useAnimation('chat-info', () =>
    openCloseChatInfo(undefined),
  );
  const toggleChatInfo = useCallback(() => {
    if (isInfoOpened) {
      animatedClose();
    } else {
      openCloseChatInfo(undefined);
    }
  }, [openCloseChatInfo, isInfoOpened, animatedClose]);
  const [animatedChatInfoOpened, setAnimatedChatInfoOpened] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      setAnimatedChatInfoOpened(isInfoOpened);
    }, 0);
  }, [isInfoOpened]);

  if (selectedChat) {
    return (
      <>
        <div className={`${BLOCK_NAME}__chat-data`}>
          <button type="button" onClick={toggleChatInfo} className={`${BLOCK_NAME}__contact-data`}>
            <Avatar
              className={`${BLOCK_NAME}__contact-img`}
              size={48}
              user={interlocutor}
              groupChat={selectedChat.groupChat}
            />

            <div className={`${BLOCK_NAME}__chat-info`}>
              <h1 className={`${BLOCK_NAME}__chat-info__title`}>
                {getChatInterlocutor(interlocutor, selectedChat, t)}
              </h1>

              {!interlocutor?.deleted && (
                <div className={`${BLOCK_NAME}__chat-info__info`}>
                  {selectedChat.typingInterlocutors &&
                  selectedChat.typingInterlocutors?.length > 0 ? (
                    <div className={`${BLOCK_NAME}__chat-info__info__typing`}>
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
          <div className={`${BLOCK_NAME}__buttons-group`}>
            <MessagesSearch />
            {interlocutor && !interlocutor?.deleted && (
              <>
                <button type="button" className={`${BLOCK_NAME}__button`} onClick={callWithAudio}>
                  <VoiceCallSvg />
                </button>

                <button type="button" className={`${BLOCK_NAME}__button`} onClick={callWithVideo}>
                  <VideoCallSvg />
                </button>
              </>
            )}
            <ChatInfoBtn toggleVisibility={toggleChatInfo} />
          </div>
        </div>

        {isInfoOpened && (
          <div className={classNames(rootClass, { 'chat-info--open': animatedChatInfoOpened })}>
            <ChatInfoRightPanel />
          </div>
        )}
      </>
    );
  }
  return <div className={`${BLOCK_NAME}__chat-data`} />;
};
