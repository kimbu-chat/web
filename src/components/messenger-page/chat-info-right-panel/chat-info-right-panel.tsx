import React, { useState, useCallback, useEffect } from 'react';
import './chat-info-right-panel.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSelectedChatSelector } from '@store/chats/selectors';
import { Avatar, FadeAnimationWrapper } from '@components/shared';
import { MediaModal } from '@components/messenger-page';

import { getInterlocutorInitials } from '@utils/interlocutor-name-utils';

import { getChatInfoAction } from '@store/chats/actions';
import { FileType } from '@store/chats/models';
import { InterlocutorInfo } from './interlocutor-info/interlocutor-info';
import { ChatActions as ChatInfoActions } from './chat-actions/chat-actions';
import { ChatMembers } from './chat-members/chat-members';
import { ChatMedia } from './chat-media/chat-media';

const ChatInfoRightPanel: React.FC = React.memo(() => {
  const selectedChat = useSelector(getSelectedChatSelector);

  const getChatInfo = useActionWithDispatch(getChatInfoAction);

  const [isAvatarMaximized, setIsAvatarMaximized] = useState(false);

  const getChatAvatar = useCallback((): string => {
    if (selectedChat?.interlocutor) {
      return selectedChat.interlocutor.avatar?.previewUrl as string;
    }

    return selectedChat?.groupChat?.avatar?.previewUrl as string;
  }, [selectedChat?.interlocutor, selectedChat?.groupChat?.avatar?.previewUrl]);

  const changeIsAvatarMaximizedState = useCallback(() => {
    if (getChatAvatar()) {
      setIsAvatarMaximized((oldState) => !oldState);
    }
  }, [setIsAvatarMaximized, getChatAvatar]);

  useEffect(() => {
    getChatInfo();
  }, [getChatInfo]);

  const getChatFullSizeAvatar = useCallback((): string => {
    if (selectedChat?.interlocutor) {
      return selectedChat.interlocutor.avatar?.url as string;
    }

    return selectedChat?.groupChat?.avatar?.url as string;
  }, [selectedChat]);

  if (selectedChat) {
    return (
      <>
        <div className="chat-info">
          {selectedChat?.interlocutor ? (
            <Avatar
              onClick={changeIsAvatarMaximizedState}
              className="chat-info__avatar"
              src={getChatAvatar()}>
              {getInterlocutorInitials(selectedChat)}
            </Avatar>
          ) : (
            <div className="chat-info__avatar-group">
              <Avatar
                onClick={changeIsAvatarMaximizedState}
                className="chat-info__avatar"
                src={getChatAvatar()}>
                {getInterlocutorInitials(selectedChat)}
              </Avatar>
            </div>
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
});

ChatInfoRightPanel.displayName = 'ChatInfo';

export { ChatInfoRightPanel };
