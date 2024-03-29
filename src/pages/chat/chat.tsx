import React, { useCallback, useLayoutEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import { TopAudioPlayer } from '@components/audio-player/audio-player';
import { BlockedMessageInput } from '@components/blocked-message-input';
import { ChatList } from '@components/chat-list';
import { ChatTopBar } from '@components/chat-top-bar';
import { DragIndicator } from '@components/drag-indicator/drag-indicator';
import { CreateMessageInput } from '@components/message-input';
import { NotContact } from '@components/not-contact';
import { AudioContext, CurrentAudio } from '@contexts/audioContext';
import { useDragDrop } from '@hooks/use-drag-drop';
import { loadEmojiPicker } from '@routing/module-loader';
import {
  amIBlackListedByInterlocutorSelector,
  getSelectedChatIdSelector,
  isCurrentChatBlackListedSelector,
  isCurrentChatContactSelector,
  isCurrentChatDismissedAddToContactsSelector,
  isCurrentChatUserDeactivatedSelector,
  isCurrentChatUserDeletedSelector,
} from '@store/chats/selectors';
import { onKeyDown } from '@utils/on-key-down';

import './chat.scss';

const BLOCK_NAME = 'chat-page';

const ChatPage: React.FC = () => {
  const isCurrentChatBlackListed = useSelector(isCurrentChatBlackListedSelector);
  const isFriend = useSelector(isCurrentChatContactSelector);
  const isDismissed = useSelector(isCurrentChatDismissedAddToContactsSelector);
  const amIBlackListedByInterlocutor = useSelector(amIBlackListedByInterlocutorSelector);
  const isCurrentChatUserDeactivated = useSelector(isCurrentChatUserDeactivatedSelector);
  const isCurrentChatUserDeleted = useSelector(isCurrentChatUserDeletedSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector) as number;

  const { isDragging } = useDragDrop({ chatId: selectedChatId });

  useLayoutEffect(() => {
    loadEmojiPicker();
  }, []);

  const [currentAudio, setCurrentAudio] = useState<CurrentAudio>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const toggleAudio = useCallback(() => {
    setIsPlayingAudio((state) => !state);
  }, [setIsPlayingAudio]);

  const changeAudio = useCallback(
    (audioId: number) => {
      if (selectedChatId) {
        setCurrentAudio({ chatId: selectedChatId, audioId });
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
        <div className={BLOCK_NAME}>
          {isDragging && <DragIndicator />}
          {currentAudio && (
            <TopAudioPlayer
              {...currentAudio}
              moveAudio={moveAudio}
              isPlayingAudio={isPlayingAudio}
              setIsPlayingAudio={setIsPlayingAudio}
              closeAudio={closeAudio}
            />
          )}
          <Outlet /> {/* MessageList, Welcome */}
          {isCurrentChatBlackListed || amIBlackListedByInterlocutor || isCurrentChatUserDeactivated || isCurrentChatUserDeleted ? (
            <BlockedMessageInput
              isCurrentChatBlackListed={isCurrentChatBlackListed}
              amIBlackListedByInterlocutor={amIBlackListedByInterlocutor}
              isCurrentChatUserDeactivated={isCurrentChatUserDeactivated}
              isCurrentChatUserDeleted={isCurrentChatUserDeleted}
            />
          ) : (
            <CreateMessageInput />
          )}
          {!isDismissed && !isFriend && !isCurrentChatBlackListed && !amIBlackListedByInterlocutor && <NotContact />}
        </div>
        <ChatTopBar />
      </AudioContext.Provider>
    </>
  );
};

document.addEventListener('keydown', onKeyDown);

export default ChatPage;
