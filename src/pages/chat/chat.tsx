import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  amIBlackListedByInterlocutorSelector,
  isCurrentChatBlackListedSelector,
  isCurrentChatDismissedAddToContactsSelector,
  isCurrentChatContactSelector,
  isCurrentChatUserDeactivatedSelector,
  isCurrentChatUserDeletedSelector,
  getSelectedChatIdSelector,
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
import { TopAudioPlayer } from '@components/audio-player/audio-player';
import { CurrentAudio, AudioContext } from '@contexts/audioContext';

type ChatPageProps = {
  isDragging: boolean;
};

const BLOCK_NAME = 'chat-page';

const ChatPage: React.FC<ChatPageProps> = ({ isDragging }) => {
  const isCurrentChatBlackListed = useSelector(isCurrentChatBlackListedSelector);
  const isFriend = useSelector(isCurrentChatContactSelector);
  const isDismissed = useSelector(isCurrentChatDismissedAddToContactsSelector);
  const amIBlackListedByInterlocutor = useSelector(amIBlackListedByInterlocutorSelector);
  const isCurrentChatUserDeactivated = useSelector(isCurrentChatUserDeactivatedSelector);
  const isCurrentChatUserDeleted = useSelector(isCurrentChatUserDeletedSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const [currentAudio, setCurrentAudio] = useState<CurrentAudio>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const toggleAudio = useCallback(() => {
    setIsPlayingAudio((state) => !state);
  }, [setIsPlayingAudio]);

  const changeAudio = useCallback(
    (audioId: number) => {
      if (selectedChatId) {
        setCurrentAudio({ chatId: selectedChatId, audioId });
        setIsPlayingAudio(false);
        setIsPlayingAudio(true);
      }
    },
    [selectedChatId],
  );
  const moveAudio = useCallback(
    (audioId: number) => {
      if (selectedChatId) {
        setCurrentAudio((oldState) => {
          if (oldState?.chatId) {
            return {
              chatId: oldState?.chatId,
              audioId,
            };
          }
          return oldState;
        });
      }
    },
    [selectedChatId],
  );
  const closeAudio = useCallback(() => {
    setCurrentAudio(null);
    setIsPlayingAudio(false);
  }, []);

  return (
    <>
      <AudioContext.Provider value={{ currentAudio, changeAudio, isPlayingAudio, toggleAudio }}>
        <ChatList />
        {isDragging && <DragIndicator />}
        <div className={BLOCK_NAME}>
          {currentAudio && (
            <TopAudioPlayer
              {...currentAudio}
              moveAudio={moveAudio}
              isPlayingAudio={isPlayingAudio}
              setIsPlayingAudio={setIsPlayingAudio}
              closeAudio={closeAudio}
            />
          )}
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
      </AudioContext.Provider>
    </>
  );
};

export default ChatPage;
