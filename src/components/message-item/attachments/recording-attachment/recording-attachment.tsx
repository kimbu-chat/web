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

export const RecordingAttachment: React.FC<IVoiceAttachment> = ({ ...attachment }) => {
  const element = useRef<HTMLDivElement>(null);

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
        waveColor: '#ffff',
        progressColor: '#3f8ae0',
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
        changeMusic(attachment.id, Origin.Record, () => wavesurfer.current?.pause());
      });

      wavesurfer.current?.on('pause', () => {
        setIsPlaying(false);
      });

      wavesurfer.current?.on('finish', () => {
        setIsPlaying(false);
      });

      if (attachment.url && attachment.waveFormJson) {
        wavesurfer.current?.load(attachment.url, JSON.parse(attachment.waveFormJson));
      }
    }

    return () => {
      wavesurfer.current?.pause();
    };
  }, [attachment.url, setIsPlaying, attachment.waveFormJson, attachment.id]);

  const playPause = useCallback(() => {
    wavesurfer.current?.playPause();
  }, []);

  return (
    <div className={BLOCK_NAME}>
      <button
        type="button"
        onClick={playPause}
        className={classNames(`${BLOCK_NAME}__play-pause`, {
          [`${BLOCK_NAME}__play-pause--play`]: isPlaying,
        })}>
        {isPlaying ? <PauseSvg /> : <PlaySvg />}
      </button>
      <div className={`${BLOCK_NAME}__vaweform-wrapper`}>
        <div ref={element} className={`${BLOCK_NAME}__vaweform`} />
      </div>
      <div className={`${BLOCK_NAME}__duration`}>{getMinutesSeconds(attachment.duration)}</div>
    </div>
  );
};
