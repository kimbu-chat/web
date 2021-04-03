import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ReactComponent as VideoSvg } from '@icons/video.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as MicrophoneSvg } from '@icons/voice.svg';
import './audio-video.scss';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { InputType } from '@store/calls/common/enums/input-type';
import {
  getVideoConstraintsSelector,
  getAudioConstraintsSelector,
  getAudioDevicesSelector,
  getVideoDevicesSelector,
} from '@store/calls/selectors';
import { useSelector } from 'react-redux';
import { ReactComponent as VideoCameraSvg } from '@icons/video-camera.svg';
import * as CallActions from '@store/calls/actions';
import incomingCallSound from '@sounds/calls/imcoming-call.ogg';
import { getAudioVolume } from '@utils/get-audio-volume-size';
import { playSoundSafely } from '@utils/current-music';
import { Dropdown } from '../../shared/dropdown/dropdown';

interface IIntensityPointProps {
  dataActive?: boolean;
  dataMiddle?: boolean;
}

interface IIntensityIndicatorProps {
  intensity: number;
}

let videoTrack: MediaStreamTrack | undefined;
let audioTrack: MediaStreamTrack | undefined;
let stopMicrophoneMeasurement: () => void;
let stopAudioMeasurement: () => void;

export const AudioVideoSettings = () => {
  const IntensityPoint: React.FC<IIntensityPointProps> = ({ dataActive, dataMiddle }) => (
    <div
      data-active={dataActive}
      data-middle={dataMiddle}
      className="audio-video__intensity-point"
    />
  );

  const IntensityIndicator: React.FC<IIntensityIndicatorProps> = ({ intensity }) => (
    <div className="audio-video__intensity-indicator">
      <IntensityPoint dataActive={intensity >= 9} dataMiddle={intensity >= 8} />
      <IntensityPoint dataActive={intensity >= 8} dataMiddle={intensity >= 7} />
      <IntensityPoint dataActive={intensity >= 7} dataMiddle={intensity >= 6} />
      <IntensityPoint dataActive={intensity >= 6} dataMiddle={intensity >= 5} />
      <IntensityPoint dataActive={intensity >= 5} dataMiddle={intensity >= 4} />
      <IntensityPoint dataActive={intensity >= 4} dataMiddle={intensity >= 3} />
      <IntensityPoint dataActive={intensity >= 3} dataMiddle={intensity >= 2} />
      <IntensityPoint dataActive={intensity >= 2} dataMiddle={intensity >= 1} />
      <IntensityPoint dataActive={intensity >= 1} />
    </div>
  );

  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const videoConstraints = useSelector(getVideoConstraintsSelector);
  const audioConstraints = useSelector(getAudioConstraintsSelector);
  const audioDevices = useSelector(getAudioDevicesSelector);
  const videoDevices = useSelector(getVideoDevicesSelector);

  const activeAudioDevice = audioConstraints.deviceId;
  const activeVideoDevice = videoConstraints.deviceId;

  const switchDevice = useActionWithDispatch(CallActions.switchDeviceAction);
  const killDeviceUpdateWatcher = useActionWithDispatch(CallActions.killDeviceUpdateWatcher);
  const spawnDeviceUpdateWatcher = useActionWithDispatch(CallActions.spawnDeviceUpdateWatcher);

  const [videoOpened, setVideoOpened] = useState(false);
  const [microphoneOpened, setMicrophoneOpened] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const [audioMeasurementAllowed, setAudioMeasurementAllowed] = useState(true);

  const [microphoneIntensity, setMicrophoneIntensity] = useState(0);
  const [audioIntensity, setAudioIntensity] = useState(0);

  useEffect(() => {
    if (videoOpened) {
      navigator.mediaDevices
        .getUserMedia({
          video: videoOpened && videoConstraints,
        })
        .then((localMediaStream) => {
          if (videoRef.current) {
            [videoTrack] = localMediaStream.getVideoTracks();

            videoRef.current.srcObject = localMediaStream;
            spawnDeviceUpdateWatcher({ videoOpened });
          }
        });
    }

    return () => {
      videoTrack?.stop();
      killDeviceUpdateWatcher();
    };
  }, [videoConstraints, videoOpened, killDeviceUpdateWatcher, spawnDeviceUpdateWatcher]);

  useEffect(() => {
    if (microphoneOpened) {
      (async () => {
        const localMediaStream = await navigator.mediaDevices.getUserMedia({
          audio: microphoneOpened && audioConstraints,
        });

        [audioTrack] = localMediaStream.getAudioTracks();
        spawnDeviceUpdateWatcher({ audioOpened: microphoneOpened });

        try {
          stopMicrophoneMeasurement = await getAudioVolume(localMediaStream, (val) => {
            setMicrophoneIntensity(val);
          });
        } catch {
          setAudioMeasurementAllowed(false);
        }
      })();
    } else {
      killDeviceUpdateWatcher();
      setMicrophoneIntensity(0);
      audioTrack?.stop();
    }

    return () => {
      if (stopMicrophoneMeasurement) {
        stopMicrophoneMeasurement();
      }
      killDeviceUpdateWatcher();
      audioTrack?.stop();
    };
  }, [
    audioConstraints,
    microphoneOpened,
    setMicrophoneIntensity,
    killDeviceUpdateWatcher,
    spawnDeviceUpdateWatcher,
  ]);

  const getVideo = useCallback(() => {
    setVideoOpened(true);
  }, [setVideoOpened]);

  useEffect(() => {
    if (audioPlaying) {
      (async () => {
        if (audioRef.current) {
          const stream = ((audioRef.current as unknown) as {
            captureStream: () => MediaStream;
          }).captureStream();
          playSoundSafely(audioRef.current);

          try {
            stopAudioMeasurement = await getAudioVolume(stream, (val) => {
              setAudioIntensity(val);
            });
          } catch {
            setAudioMeasurementAllowed(false);
          }
        }
      })();
    }

    const audioElement = audioRef.current;

    return () => {
      setAudioIntensity(0);
      if (audioElement) {
        audioElement.pause();
      }
      if (stopAudioMeasurement) {
        stopAudioMeasurement();
      }
    };
  }, [audioPlaying]);

  return (
    <div className="audio-video">
      <h3 className="audio-video__title">{t('audioVideo.title')}</h3>
      <div className="audio-video__subject-title">
        <VideoSvg onClick={getVideo} viewBox="0 0 18 18" className="audio-video__subject-icon" />
        <h5 className="audio-video__subject-text">{t('audioVideo.video')}</h5>
      </div>
      <div className="audio-video__dropdown-wrapper">
        <Dropdown
          selectedString={
            videoDevices.find(({ deviceId }) => deviceId === activeVideoDevice)?.label ||
            t('activeCall.default')
          }
          options={videoDevices.map((device) => ({
            title: device.label,
            onClick: () => switchDevice({ kind: InputType.VideoInput, deviceId: device.deviceId }),
          }))}
        />
      </div>
      <div className="audio-video__video-area">
        <VideoCameraSvg className="audio-video__video-icon" viewBox="0 0 300 280" />
        {videoOpened && (
          <video muted autoPlay playsInline ref={videoRef} className="audio-video__video" />
        )}
        <button onClick={getVideo} type="button" className="audio-video__video-btn">
          {t('audioVideo.test-video')}
        </button>
      </div>
      <div className="audio-video__intensity-wrapper">
        <div className="audio-video__subject-title">
          {audioPlaying ? (
            <PauseSvg
              onClick={() => {
                setAudioPlaying(false);
              }}
              viewBox="0 0 24 24"
              className="audio-video__subject-icon"
            />
          ) : (
            <PlaySvg
              onClick={() => {
                setAudioPlaying(true);
              }}
              viewBox="0 0 24 24"
              className="audio-video__subject-icon"
            />
          )}
          <audio src={incomingCallSound} hidden ref={audioRef} />
          <h5 className="audio-video__subject-text">{t('audioVideo.load-speaker')}</h5>
        </div>
        {audioMeasurementAllowed && <IntensityIndicator intensity={audioIntensity} />}
      </div>
      <div className="audio-video__dropdown-wrapper">
        <Dropdown
          selectedString={
            audioDevices.find(({ deviceId }) => deviceId === activeAudioDevice)?.label ||
            t('activeCall.default')
          }
          options={audioDevices.map((device) => ({
            title: device.label,
            onClick: () => switchDevice({ kind: InputType.AudioInput, deviceId: device.deviceId }),
          }))}
        />
      </div>
      <div className="audio-video__intensity-wrapper audio-video__intensity-wrapper--microphone">
        <div className="audio-video__subject-title">
          <MicrophoneSvg
            onClick={() => {
              setMicrophoneOpened((oldState) => !oldState);
            }}
            viewBox="0 0 20 24"
            className="audio-video__subject-icon"
          />
          <h5 className="audio-video__subject-text">{t('audioVideo.microphone')}</h5>
        </div>
        {audioMeasurementAllowed && <IntensityIndicator intensity={microphoneIntensity} />}
      </div>
    </div>
  );
};
