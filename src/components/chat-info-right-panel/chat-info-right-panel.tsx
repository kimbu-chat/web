import React, { useMemo, useEffect } from 'react';
import './chat-info-right-panel.scss';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getInfoChatSelector } from '@store/chats/selectors';
import { Avatar } from '@components/avatar';
import { MediaModal } from '@components/image-modal';
import { FileType } from '@store/chats/models';
import { getUserSelector } from '@store/users/selectors';
import { getChatInfoAction } from '@store/chats/actions';
import { useToggledState } from '@hooks/use-toggled-state';

import { InterlocutorInfo } from './interlocutor-info/interlocutor-info';
import { ChatActions as ChatInfoActions } from './chat-actions/chat-actions';
import { ChatMembers } from './chat-members/chat-members';
import { ChatMedia } from './chat-media/chat-media';

const BLOCK_NAME = 'chat-info';

const ChatInfoRightPanel: React.FC = React.memo(() => {
  const chat = useSelector(getInfoChatSelector);

  const interlocutor = useSelector(getUserSelector(chat?.interlocutorId));

  const getChatInfo = useActionWithDispatch(getChatInfoAction);

  const [isAvatarMaximized, maximizeAvatar, minimizeAvatrar] = useToggledState(false);

  const chatFullSizeAvatar = useMemo((): string => {
    if (interlocutor?.avatar?.url) {
      return interlocutor.avatar.url as string;
    }

    return chat?.groupChat?.avatar?.url as string;
  }, [chat?.groupChat?.avatar?.url, interlocutor?.avatar?.url]);

  useEffect(() => {
    if (chat?.id) {
      getChatInfo(chat.id);
    }
  }, [getChatInfo, chat?.id]);

  if (chat) {
    return (
      <>
        <div className={`${BLOCK_NAME}__messenger-info`}>
          <Avatar
            onClick={maximizeAvatar}
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

        {isAvatarMaximized && chatFullSizeAvatar && (
          <MediaModal
            attachmentsArr={[{ url: chatFullSizeAvatar, id: 1, type: FileType.Picture }]}
            attachmentId={1}
            onClose={minimizeAvatrar}
          />
        )}
      </>
    );
  }
  return <div />;
});

ChatInfoRightPanel.displayName = 'ChatInfo';

export { ChatInfoRightPanel };
