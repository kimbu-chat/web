import React, { useCallback, useEffect, useRef, useState } from 'react';

import WaveSurfer from 'wavesurfer.js';

import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { changeMusic, Origin } from '@utils/current-music';
import { getMinutesSeconds } from '@utils/date-utils';
import { createWaveForm } from '@utils/get-waveform';

import type { IVoiceAttachment } from 'kimbu-models';

import './recording.scss';

interface IRecording extends IVoiceAttachment {
  clientId?: number;
  createdByInterlocutor?: boolean;
}

const BLOCK_NAME = 'recording';

export const Recording: React.FC<IRecording> = ({
  clientId,
  id,
  createdByInterlocutor,
  waveFormJson,
  duration,
  url,
}) => {
  const waveRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const wavesurfer = useRef<WaveSurfer | null>(null);

  const idForUse = clientId || id;

  useEffect(() => {
    if (waveRef.current) {
      const progressColor = createdByInterlocutor ? '#000' : '#3f8ae0';
      wavesurfer.current = createWaveForm({ container: waveRef.current, progressColor });

      wavesurfer.current?.on('play', () => {
        setIsPlaying(true);
        changeMusic(idForUse, Origin.Record, () => wavesurfer.current?.pause());
      });

      wavesurfer.current?.on('pause', () => {
        setIsPlaying(false);
      });

      wavesurfer.current?.on('finish', () => {
        setIsPlaying(false);
      });

      if (url && waveFormJson) {
        wavesurfer.current?.load(url, JSON.parse(waveFormJson));
      }
    }

    return () => {
      wavesurfer.current?.pause();
    };
  }, [url, setIsPlaying, waveFormJson, idForUse, createdByInterlocutor]);

  const playPause = useCallback(() => {
    wavesurfer.current?.playPause();
  }, []);

  return (
    <div className={BLOCK_NAME}>
      <button type="button" onClick={playPause} className={`${BLOCK_NAME}__play-pause`}>
        {isPlaying ? <PauseSvg /> : <PlaySvg />}
      </button>
      <span className={`${BLOCK_NAME}__waveform-wrapper`}>
        <div ref={waveRef} className={`${BLOCK_NAME}__waveform`} />
      </span>
      <span className={`${BLOCK_NAME}__duration`}>{getMinutesSeconds(duration)}</span>
    </div>
  );
};
