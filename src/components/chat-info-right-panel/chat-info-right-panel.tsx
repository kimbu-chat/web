import React, { useMemo, useEffect, useRef } from 'react';

import { AttachmentType } from 'kimbu-models';
import { useSelector } from 'react-redux';

import {
  INTERSECTION_THROTTLE_FOR_MEDIA,
  INTERSECTION_THRESHOLD_FOR_MEDIA,
} from '@common/constants/media';
import { Avatar } from '@components/avatar';
import { MediaModal } from '@components/image-modal';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useIntersectionObserver } from '@hooks/use-intersection-observer';
import { useToggledState } from '@hooks/use-toggled-state';
import { getChatInfoAction } from '@store/chats/actions';
import { getInfoChatSelector } from '@store/chats/selectors';
import { getUserSelector } from '@store/users/selectors';

import { ChatActions as ChatInfoActions } from './chat-actions/chat-actions';
import { ChatMedia } from './chat-media/chat-media';
import { ChatMembers } from './chat-members/chat-members';
import { InterlocutorInfo } from './interlocutor-info/interlocutor-info';

import './chat-info-right-panel.scss';

const BLOCK_NAME = 'chat-info';

const ChatInfoRightPanel: React.FC = React.memo(() => {
  const chat = useSelector(getInfoChatSelector);

  const rootRef = useRef<HTMLDivElement>(null);

  const { observe: observeIntersectionForMedia } = useIntersectionObserver({
    rootRef,
    throttleMs: INTERSECTION_THROTTLE_FOR_MEDIA,
    threshold: INTERSECTION_THRESHOLD_FOR_MEDIA,
  });

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
        <div className={`${BLOCK_NAME}__messenger-info`} ref={rootRef}>
          <Avatar
            onClick={maximizeAvatar}
            className={`${BLOCK_NAME}__avatar`}
            size={148}
            user={interlocutor}
            groupChat={chat?.groupChat}
          />

          <InterlocutorInfo />

          <ChatInfoActions />

          {chat?.groupChat && <ChatMembers rootRef={rootRef} />}

          <ChatMedia observeIntersection={observeIntersectionForMedia} rootRef={rootRef} />
        </div>

        {isAvatarMaximized && chatFullSizeAvatar && (
          <MediaModal
            attachmentsArr={[{ url: chatFullSizeAvatar, id: 1, type: AttachmentType.Picture }]}
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
