import React from 'react';
import { useSelector } from 'react-redux';

import {
  amIBlackListedByInterlocutorSelector,
  isCurrentChatBlackListedSelector,
  isCurrentChatDismissedAddToContactsSelector,
  isCurrentChatContactSelector,
  isCurrentChatUserDeactivatedSelector,
  isCurrentChatUserDeletedSelector,
} from '@store/chats/selectors';
import { DragIndicator } from '@components/drag-indicator/drag-indicator';
import { ChatInfoRightPanel } from '@components/chat-info-right-panel';
import { CreateMessageInput } from '@components/message-input';
import { ChatList } from '@components/chat-list';
import { ChatTopBar } from '@components/chat-top-bar';
import { MessageList } from '@components/message-list';
import { NotContact } from '@components/not-contact';
import { BlockedMessageInput } from '@components/blocked-message-input';

import './chat.scss';

type ChatPageProps = {
  isDragging: boolean;
};

const BLOCK_NAME = 'chat-page';

export const ChatPage: React.FC<ChatPageProps> = ({ isDragging }) => {
  const isCurrentChatBlackListed = useSelector(isCurrentChatBlackListedSelector);
  const isFriend = useSelector(isCurrentChatContactSelector);
  const isDismissed = useSelector(isCurrentChatDismissedAddToContactsSelector);
  const amIBlackListedByInterlocutor = useSelector(amIBlackListedByInterlocutorSelector);
  const isCurrentChatUserDeactivated = useSelector(isCurrentChatUserDeactivatedSelector);
  const isCurrentChatUserDeleted = useSelector(isCurrentChatUserDeletedSelector);

  return (
    <>
      <ChatList />
      {isDragging && <DragIndicator />}
      <div className={BLOCK_NAME}>
        <MessageList />
        {isCurrentChatBlackListed ||
        amIBlackListedByInterlocutor ||
        isCurrentChatUserDeactivated ||
        isCurrentChatUserDeleted ? (
          <BlockedMessageInput
            isCurrentChatBlackListed={isCurrentChatBlackListed}
            amIBlackListedByInterlocutor={amIBlackListedByInterlocutor}
            isCurrentChatUserDeactivated={isCurrentChatUserDeactivated}
            isCurrentChatUserDeleted={isCurrentChatUserDeleted}
          />
        ) : (
          <CreateMessageInput />
        )}
        {!isDismissed &&
          !isFriend &&
          !isCurrentChatBlackListed &&
          !amIBlackListedByInterlocutor && <NotContact />}
      </div>
      <ChatTopBar />
      <ChatInfoRightPanel />
    </>
  );
};
