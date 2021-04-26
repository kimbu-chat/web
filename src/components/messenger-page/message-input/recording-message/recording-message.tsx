import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { uploadAttachmentRequestAction } from '@store/chats/actions';
import { FileType } from '@store/chats/models';
import moment from 'moment';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';
import WaveSurfer from 'wavesurfer.js';
import useInterval from 'use-interval';
import './recording-message.scss';

let mediaRecorder: MediaRecorder | null = null;
let tracks: MediaStreamTrack[] = [];
let waveSurferInstance: WaveSurfer | null = null;

interface IRecordingMessageProps {
  hide: () => void;
}

export const RecordingMessage: React.FC<IRecordingMessageProps> = ({ hide }) => {
  const uploadAttachmentRequest = useActionWithDispatch(uploadAttachmentRequestAction);

  const [recordedSeconds, setRecordedSeconds] = useState(0);

  const waveformRef = useRef<HTMLDivElement>(null);

  useInterval(
    () => {
      setRecordedSeconds((x) => x + 1);
    },
    1000,
    true,
  );

  useEffect(() => {
    if (WaveSurfer && MicrophonePlugin && waveformRef.current) {
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

      waveSurferInstance = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#3f8ae0',
        interact: false,
        cursorWidth: 0,
        plugins: [MicrophonePlugin.create()],
        audioScriptProcessor: processor,
        audioContext: context,
        height: 30,
        hideScrollbar: true,
      });
      waveSurferInstance?.microphone.start();
      waveSurferInstance?.microphone.play();

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder?.start();
        tracks = stream.getTracks();

        const audioChunks: Blob[] = [];
        mediaRecorder?.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder?.addEventListener('stop', () => {
          tracks.forEach((track) => track.stop());
          tracks = [];

          if (audioChunks[0]?.size > 0) {
            const audioBlob = new Blob(audioChunks);
            const audioFile = new File([audioBlob], 'audio.mp3', {
              type: 'audio/mp3; codecs="opus"',
            });

            mediaRecorder = null;

            waveSurferInstance?.microphone.destroy();

            waveSurferInstance?.load(URL.createObjectURL(audioBlob));

            const onReady = (e: any) => {
              waveSurferInstance?.exportPCM(5, undefined, true).then((waveFormJson: string) => {
                uploadAttachmentRequest({
                  type: FileType.Voice,
                  file: audioFile as File,
                  attachmentId: new Date().getTime(),
                  waveFormJson,
                });
              });

              waveSurferInstance?.destroy();
              waveSurferInstance = null;
              hide();
            };

            waveSurferInstance?.on('ready', onReady);
          }

          setRecordedSeconds(0);
        });
      });
    }
  }, [uploadAttachmentRequest, hide]);

  const stopRecording = useCallback(() => {
    mediaRecorder?.stop();

    tracks.forEach((track) => track.stop());
    tracks = [];
  }, []);

  return (
    <div className="recording-message">
      <div className="recording-message__counter">
        {moment.utc(recordedSeconds * 1000).format('mm:ss')}
      </div>
      <div ref={waveformRef} className="recording-message__vaweform" />
      <button type="button" onClick={stopRecording} className="recording-message__voice-btn">
        <VoiceSvg viewBox="0 0 20 24" />
      </button>
    </div>
  );
};
