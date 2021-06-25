import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import classNames from 'classnames';

import { ReactComponent as SoundOnSvg } from '@icons/sound_on.svg';
import { ReactComponent as ArrowLeftSvg } from '@icons/arrow_left.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as RepeatSvg } from '@icons/repeat.svg';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ArrowRightSvg } from '@icons/arrow_right.svg';
import { changeMusic, Origin, playSoundSafely } from '@utils/current-music';
import './audio-player.scss';
import { getSelectedChatAudioAttachmentsSelector } from '@store/chats/selectors';
import { CurrentAudio } from '@contexts/audioContext';

export const TopAudioPlayer: React.FC<
  CurrentAudio & {
    isPlayingAudio: boolean;
    setIsPlayingAudio: React.Dispatch<React.SetStateAction<boolean>>;
    closeAudio: () => void;
    moveAudio: (audioId: number) => void;
  }
> = ({ chatId, audioId, setIsPlayingAudio, isPlayingAudio, moveAudio, closeAudio }) => {
  const BLOCK_NAME = 'audio-player';

  const audioAttachmentsForChat = useSelector(getSelectedChatAudioAttachmentsSelector(chatId));

  const audioRef = useRef<AudioPlayer | null>(null);

  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);

  const currentAudioAttachment = useMemo(
    () => audioAttachmentsForChat.find(({ id }) => id === audioId),
    [audioId, audioAttachmentsForChat],
  );

  const handleNext = useCallback(() => {
    const currentIndex = audioAttachmentsForChat.findIndex(({ id }) => id === audioId);
    if (currentIndex < audioAttachmentsForChat.length - 1) {
      setIsPlayingAudio(true);
      moveAudio(audioAttachmentsForChat[currentIndex + 1].id);
    }
  }, [audioAttachmentsForChat, audioId, moveAudio, setIsPlayingAudio]);
  const handlePrev = useCallback(() => {
    const currentIndex = audioAttachmentsForChat.findIndex(({ id }) => id === audioId);
    if (currentIndex > 0) {
      setIsPlayingAudio(true);
      moveAudio(audioAttachmentsForChat[currentIndex - 1].id);
    }
  }, [audioAttachmentsForChat, audioId, moveAudio, setIsPlayingAudio]);
  const onPlay = useCallback(() => {
    setIsPlayingAudio(true);
  }, [setIsPlayingAudio]);
  const onEnd = useCallback(() => {
    if (!loop) {
      handleNext();
    }
  }, [handleNext, loop]);
  const onPause = useCallback(() => {
    setIsPlayingAudio(false);
  }, [setIsPlayingAudio]);

  const togglePlay = useCallback(() => setIsPlayingAudio((state) => !state), [setIsPlayingAudio]);
  const toggleMuted = useCallback(() => {
    setMuted((state) => {
      if (audioRef.current?.audio.current) {
        audioRef.current.audio.current.muted = !state;
      }

      return !state;
    });
  }, [setMuted]);
  const toggleLoop = useCallback(() => {
    setLoop((state) => {
      if (audioRef.current?.audio.current) {
        audioRef.current.audio.current.loop = !state;
      }

      return !state;
    });
  }, [setLoop]);

  useEffect(() => {
    if (audioRef.current?.audio.current) {
      if (isPlayingAudio) {
        playSoundSafely(audioRef.current?.audio.current);
        if (currentAudioAttachment?.id) {
          changeMusic(currentAudioAttachment.id, Origin.AudioPlayer, () =>
            setIsPlayingAudio(false),
          );
        }
      } else {
        audioRef.current?.audio.current?.pause();
      }
    }
  }, [isPlayingAudio, audioRef, currentAudioAttachment?.id, setIsPlayingAudio]);

  return (
    <div className={BLOCK_NAME}>
      <AudioPlayer
        ref={audioRef as React.RefObject<AudioPlayer>}
        src={currentAudioAttachment?.url}
        preload="metadata"
        showSkipControls={false}
        showJumpControls={false}
        autoPlayAfterSrcChange
        customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
        customControlsSection={[]}
        customAdditionalControls={[]}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnd}
      />
      <div className={`${BLOCK_NAME}__data`}>
        <h5 className={`${BLOCK_NAME}__audio-name`}>{currentAudioAttachment?.fileName}</h5>
        <div className={`${BLOCK_NAME}__audio-controls`}>
          <button
            type="button"
            onClick={toggleMuted}
            className={classNames(
              `${BLOCK_NAME}__audio-control`,
              `${BLOCK_NAME}__audio-control--mute`,
              { [`${BLOCK_NAME}__audio-control--active`]: !muted },
            )}>
            <SoundOnSvg />
          </button>
          <button onClick={handlePrev} type="button" className={`${BLOCK_NAME}__audio-control`}>
            <ArrowLeftSvg />
          </button>
          <button
            onClick={togglePlay}
            type="button"
            className={classNames(
              `${BLOCK_NAME}__audio-control`,
              `${BLOCK_NAME}__audio-control--play`,
            )}>
            {isPlayingAudio ? <PauseSvg /> : <PlaySvg />}
          </button>
          <button
            onClick={handleNext}
            type="button"
            className={classNames(`${BLOCK_NAME}__audio-control`)}>
            <ArrowRightSvg />
          </button>
          <button
            onClick={toggleLoop}
            type="button"
            className={classNames(
              `${BLOCK_NAME}__audio-control`,
              `${BLOCK_NAME}__audio-control--repeat`,
              { [`${BLOCK_NAME}__audio-control--active`]: loop },
            )}>
            <RepeatSvg />
          </button>
        </div>
        <div className={classNames(`${BLOCK_NAME}__duration`)}>
          {dayjs.utc((currentAudioAttachment?.duration || 0) * 1000).format('mm:ss')}
        </div>
        <button type="button" onClick={closeAudio} className="audio-player__audio-close">
          <CloseSvg />
        </button>
      </div>
    </div>
  );
};
