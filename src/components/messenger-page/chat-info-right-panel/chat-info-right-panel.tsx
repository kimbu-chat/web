import React, { useState, useCallback, useEffect } from 'react';
import './chat-info-right-panel.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSelectedChatSelector } from '@store/chats/selectors';
import { Avatar, FadeAnimationWrapper } from '@components/shared';
import { MediaModal } from '@components/messenger-page';

import { getChatInfoAction } from '@store/chats/actions';
import { FileType } from '@store/chats/models';
import { getUserSelector } from '@store/users/selectors';
import { InterlocutorInfo } from './interlocutor-info/interlocutor-info';
import { ChatActions as ChatInfoActions } from './chat-actions/chat-actions';
import { ChatMembers } from './chat-members/chat-members';
import { ChatMedia } from './chat-media/chat-media';

const ChatInfoRightPanel: React.FC = () => {
  const selectedChat = useSelector(getSelectedChatSelector);

  const getChatInfo = useActionWithDispatch(getChatInfoAction);
  const interlocutor = useSelector(getUserSelector(selectedChat?.interlocutor));

  const [isAvatarMaximized, setIsAvatarMaximized] = useState(false);

  const getChatAvatar = useCallback((): string => {
    if (interlocutor) {
      return interlocutor.avatar?.previewUrl as string;
    }

    return selectedChat?.groupChat?.avatar?.previewUrl as string;
  }, [interlocutor, selectedChat?.groupChat?.avatar?.previewUrl]);

  const changeIsAvatarMaximizedState = useCallback(() => {
    if (getChatAvatar()) {
      setIsAvatarMaximized((oldState) => !oldState);
    }
  }, [setIsAvatarMaximized, getChatAvatar]);

  useEffect(() => {
    getChatInfo();
  }, [getChatInfo]);

  const getChatFullSizeAvatar = useCallback((): string => {
    if (interlocutor?.avatar?.url) {
      return interlocutor.avatar.url as string;
    }

    return selectedChat?.groupChat?.avatar?.url as string;
  }, [selectedChat?.groupChat?.avatar?.url, interlocutor?.avatar?.url]);

  if (selectedChat) {
    return (
      <>
        <div className="chat-info">
          {interlocutor && (
            <Avatar
              onClick={changeIsAvatarMaximizedState}
              className="chat-info__avatar"
              user={interlocutor}
            />
          )}
          {selectedChat?.groupChat && (
            <Avatar
              onClick={changeIsAvatarMaximizedState}
              className="chat-info__avatar"
              groupChat={selectedChat.groupChat}
            />
          )}

          <InterlocutorInfo />

          <ChatInfoActions />

          {selectedChat?.groupChat && <ChatMembers />}

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
    );
  }
  return <div />;
};

ChatInfoRightPanel.displayName = 'ChatInfo';

export { ChatInfoRightPanel };
