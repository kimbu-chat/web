import React, { useEffect, useState, useRef, useCallback } from 'react';

import useInterval from 'use-interval';
import { Peaks } from 'wavesurfer.js/types/backend';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useReferState } from '@hooks/use-referred-state';
import { ReactComponent as DeleteSvg } from '@icons/remove-chat.svg';
import { ReactComponent as SendSvg } from '@icons/send.svg';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
import { uploadVoiceAttachmentAction } from '@store/chats/actions';
import { getMinutesSeconds } from '@utils/date-utils';
import { generateLiveWaveform, stopGenerating } from '@utils/generate-live-waveform';
import { getWaveform } from '@utils/get-waveform';

import './recording-message.scss';

import { getRecordAudioStream } from '../../../utils/record-audio-stream';

let mediaRecorder: MediaRecorder | null = null;
let tracks: MediaStreamTrack[] = [];
let canceled = false;

interface IRecordingMessageProps {
  hide: () => void;
}

export const RecordingMessage: React.FC<IRecordingMessageProps> = ({ hide }) => {
  const uploadVoiceAttachment = useActionWithDispatch(uploadVoiceAttachmentAction);

  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const referedRecordedSeconds = useReferState(recordedSeconds);

  const waveformRef = useRef<HTMLDivElement>(null);

  useInterval(
    () => {
      setRecordedSeconds((x) => x + 1);
    },
    1000,
    true,
  );

  useEffect(() => {
    canceled = false;
    const stream = getRecordAudioStream();

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder?.start();
    tracks = stream.getTracks();

    if (waveformRef.current) {
      generateLiveWaveform(stream, waveformRef.current);
    }

    const audioChunks: Blob[] = [];
    mediaRecorder?.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder?.addEventListener('stop', () => {
      if (canceled) {
        hide();
        stopGenerating();
        return;
      }

      tracks.forEach((track) => track.stop());
      tracks = [];

      if (audioChunks[0]?.size > 0) {
        const audioBlob = new Blob(audioChunks);
        const audioFile = new File([audioBlob], 'audio.mp3', {
          type: 'audio/mp3; codecs="opus"',
        });

        mediaRecorder = null;

        const recordingUrl = URL.createObjectURL(audioBlob);

        const onReady = (waveForm: Peaks) => {
          uploadVoiceAttachment({
            file: audioFile as File,
            id: new Date().getTime(),
            waveFormJson: JSON.stringify(waveForm),
            duration: referedRecordedSeconds.current,
            url: recordingUrl,
          });

          hide();
          stopGenerating();
        };

        getWaveform(recordingUrl, referedRecordedSeconds.current).then(onReady);
      }
    });
  }, [hide, uploadVoiceAttachment, referedRecordedSeconds]);

  const stopRecording = useCallback(() => {
    mediaRecorder?.stop();
    tracks.forEach((track) => track.stop());
    tracks = [];
  }, []);

  const cancelRecording = useCallback(() => {
    canceled = true;
    mediaRecorder?.stop();
    tracks.forEach((track) => track.stop());
    tracks = [];
  }, []);

  return (
    <div className="recording-message">
      <button type="button" className="recording-message__voice-btn">
        <VoiceSvg />
      </button>
      <div ref={waveformRef} className="recording-message__vaweform" />
      <div className="recording-message__counter">{getMinutesSeconds(recordedSeconds)}</div>

      <button type="button" onClick={cancelRecording} className="recording-message__delete-btn">
        <DeleteSvg height="24px" width="24px" />
      </button>
      <button type="button" onClick={stopRecording} className="recording-message__send-btn">
        <SendSvg />
      </button>
    </div>
  );
};
