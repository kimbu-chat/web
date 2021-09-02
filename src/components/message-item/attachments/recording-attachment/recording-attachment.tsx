import React, { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { IVoiceAttachment } from 'kimbu-models';
import WaveSurfer from 'wavesurfer.js';

import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { changeMusic, Origin } from '@utils/current-music';
import { getMinutesSeconds } from '@utils/date-utils';

import './recording-attachment.scss';

const BLOCK_NAME = 'recording-attachment';

export const RecordingAttachment: React.FC<
  IVoiceAttachment & { clientId?: number; createdByInterlocutor?: boolean }
> = ({ id, clientId, url, waveFormJson, duration, createdByInterlocutor }) => {
  const element = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const wavesurfer = useRef<WaveSurfer | null>(null);

  const idForUse = clientId || id;

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
        waveColor: '#ffff',
        // TODO: change color for recording that was created by interlocutor
        progressColor: createdByInterlocutor ? '#000' : '#3f8ae0',
        backgroundColor: 'transparent',
        cursorWidth: 0,
        height: 24,
        barWidth: 1,
        audioScriptProcessor: processor,
        audioContext: context,
        hideScrollbar: true,
        barRadius: 1,
        barGap: 3,
        barMinHeight: 1,
      });

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
  }, [url, setIsPlaying, waveFormJson, idForUse]);

  const playPause = useCallback(() => {
    wavesurfer.current?.playPause();
  }, []);

  return (
    <div className={BLOCK_NAME}>
      <button type="button" onClick={playPause} className={classNames(`${BLOCK_NAME}__play-pause`)}>
        {isPlaying ? <PauseSvg /> : <PlaySvg />}
      </button>
      <div className={`${BLOCK_NAME}__vaweform-wrapper`}>
        <div ref={element} className={`${BLOCK_NAME}__vaweform`} />
      </div>
      <div className={`${BLOCK_NAME}__duration`}>{getMinutesSeconds(duration)}</div>
    </div>
  );
};
