import React, { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import dayjs from 'dayjs';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { IVoiceAttachment } from '@store/chats/models';
import './recording-attachment.scss';
import { changeMusic, Origin } from '@utils/current-music';

export const RecordingAttachment: React.FC<IVoiceAttachment> = ({ ...attachment }) => {
  const element = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (element.current) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      let context;
      let processor;

      if (isSafari) {
        // Safari 11 or newer automatically suspends new AudioContext's that aren't
        // created in response to a user-gesture, like a click or tap, so create one
        // here (inc. the script processor)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        processor = context.createScriptProcessor(1024, 1, 1);
      }

      wavesurfer.current = WaveSurfer.create({
        container: element.current,
        waveColor: '#3f8ae0',
        progressColor: '#ffff',
        backgroundColor: 'transparent',
        cursorWidth: 0,
        height: 40,
        barWidth: 1,
        audioScriptProcessor: processor,
        audioContext: context,
        hideScrollbar: true,
        barRadius: 1,
        barGap: 3,
        barMinHeight: 1,
      });

      wavesurfer.current?.on('audioprocess', (e) => {
        setProgress(e / (wavesurfer.current?.getDuration() || -1));
      });

      wavesurfer.current?.on('play', () => {
        setIsPlaying(true);
        changeMusic(attachment.id, Origin.Record, () => wavesurfer.current?.pause());
      });

      wavesurfer.current?.on('pause', () => {
        setIsPlaying(false);
      });

      wavesurfer.current?.on('seek', (e) => {
        setProgress(e);
      });

      wavesurfer.current?.on('finish', () => {
        setProgress(100);
        setIsPlaying(false);
      });

      wavesurfer.current?.load(attachment.url, JSON.parse(attachment.waveFormJson));
    }

    return () => wavesurfer.current?.pause();
  }, [attachment.url, setProgress, setIsPlaying, attachment.waveFormJson, attachment.id]);

  const playPause = useCallback(() => {
    wavesurfer.current?.playPause();
  }, []);

  return (
    <div className="recording-attachment">
      <button type="button" onClick={playPause} className="recording-attachment__play-pause">
        {isPlaying ? <PauseSvg /> : <PlaySvg />}
      </button>
      <div className="recording-attachment__vaweform-wrapper">
        <div style={{ width: `${progress * 100}%` }} className="recording-attachment__progress" />
        <div ref={element} className="recording-attachment__vaweform" />
      </div>
      <div className="recording-attachment__duration">
        {dayjs.utc(attachment.duration * 1000).format('mm:ss')}
      </div>
    </div>
  );
};
