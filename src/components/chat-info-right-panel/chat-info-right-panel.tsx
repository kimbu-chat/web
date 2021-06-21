import React, { useState, useCallback, useEffect } from 'react';
import './chat-info-right-panel.scss';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getInfoChatSelector, getIsInfoOpenedSelector } from '@store/chats/selectors';
import { Avatar } from '@components/avatar';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import { MediaModal } from '@components/image-modal';
import { FileType } from '@store/chats/models';
import { getUserSelector } from '@store/users/selectors';
import { getChatInfoAction } from '@store/chats/actions';

import { InterlocutorInfo } from './interlocutor-info/interlocutor-info';
import { ChatActions as ChatInfoActions } from './chat-actions/chat-actions';
import { ChatMembers } from './chat-members/chat-members';
import { ChatMedia } from './chat-media/chat-media';

const BLOCK_NAME = 'chat-info';

const ChatInfoRightPanel: React.FC = React.memo(() => {
  const chat = useSelector(getInfoChatSelector);

  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  const getChatInfo = useActionWithDispatch(getChatInfoAction);

  const [isAvatarMaximized, setIsAvatarMaximized] = useState(false);

  const getChatAvatar = useCallback((): string => {
    if (interlocutor) {
      return interlocutor.avatar?.previewUrl as string;
    }

    return chat?.groupChat?.avatar?.previewUrl as string;
  }, [interlocutor, chat?.groupChat?.avatar?.previewUrl]);

  const changeIsAvatarMaximizedState = useCallback(() => {
    if (getChatAvatar()) {
      setIsAvatarMaximized((oldState) => !oldState);
    }
  }, [setIsAvatarMaximized, getChatAvatar]);

  useEffect(() => {
    if (isInfoOpened && chat?.id) {
      getChatInfo(chat.id);
    }
  }, [getChatInfo, chat?.id, isInfoOpened]);

  const getChatFullSizeAvatar = useCallback((): string => {
    if (interlocutor?.avatar?.url) {
      return interlocutor.avatar.url as string;
    }

    return chat?.groupChat?.avatar?.url as string;
  }, [chat?.groupChat?.avatar?.url, interlocutor?.avatar?.url]);

  if (chat) {
    return (
      <CSSTransition in={isInfoOpened} timeout={200} classNames="chat-info-slide" unmountOnExit>
        <div className={`${BLOCK_NAME}__messenger-info`}>
          <>
            <div className={BLOCK_NAME}>
              <Avatar
                onClick={changeIsAvatarMaximizedState}
                className={`${BLOCK_NAME}__avatar`}
                size={148}
                user={interlocutor}
                groupChat={chat?.groupChat}
              />

              <InterlocutorInfo />

              <ChatInfoActions />

              {chat?.groupChat && <ChatMembers />}

              <ChatMedia />
            </div>

            <FadeAnimationWrapper isDisplayed={isAvatarMaximized}>
              <MediaModal
                attachmentsArr={[{ url: getChatFullSizeAvatar(), id: 1, type: FileType.Picture }]}
                attachmentId={1}
                onClose={changeIsAvatarMaximizedState}
              />
            </FadeAnimationWrapper>
          </>
        </div>
      </CSSTransition>
    );
  }
  return <div />;
});

ChatInfoRightPanel.displayName = 'ChatInfo';

export { ChatInfoRightPanel };
