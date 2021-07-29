import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Dropdown } from '@components/dropdown';
import { HorizontalSeparator } from '@components/horizontal-separator';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as VideoSvg } from '@icons/attachment-video.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as VideoCameraSvg } from '@icons/video-camera.svg';
import { ReactComponent as MicrophoneSvg } from '@icons/voice.svg';
import { Button } from '@shared-components/button';
import incomingCallSound from '@sounds/calls/incoming-call.ogg';
import {
  killDeviceUpdateWatcherAction,
  spawnDeviceUpdateWatcherAction,
  switchDeviceAction,
} from '@store/calls/actions';
import { InputType } from '@store/calls/common/enums/input-type';
import {
  getVideoConstraintsSelector,
  getAudioConstraintsSelector,
  getAudioDevicesSelector,
  getVideoDevicesSelector,
} from '@store/calls/selectors';
import { playSoundSafely } from '@utils/current-music';
import { getAudioVolume } from '@utils/get-audio-volume-size';

import './audio-video.scss';

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

let videoStopped = false;

const AudioVideoSettings = () => {
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

  const { t } = useTranslation();

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const videoConstraints = useSelector(getVideoConstraintsSelector);
  const audioConstraints = useSelector(getAudioConstraintsSelector);
  const audioDevices = useSelector(getAudioDevicesSelector);
  const videoDevices = useSelector(getVideoDevicesSelector);

  const activeAudioDevice = audioConstraints.deviceId;
  const activeVideoDevice = videoConstraints.deviceId;

  const switchDevice = useActionWithDispatch(switchDeviceAction);
  const killDeviceUpdateWatcher = useActionWithDispatch(killDeviceUpdateWatcherAction);
  const spawnDeviceUpdateWatcher = useActionWithDispatch(spawnDeviceUpdateWatcherAction);

  const [videoOpened, setVideoOpened] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [requestingVideo, setRequestingVideo] = useState(false);

  const [audioMeasurementAllowed, setAudioMeasurementAllowed] = useState(true);

  const [microphoneIntensity, setMicrophoneIntensity] = useState(0);
  const [audioIntensity, setAudioIntensity] = useState(0);

  const toggleAudio = useCallback(() => setAudioPlaying((state) => !state), []);

  const startMicrophoneMeasurement = useCallback(async () => {
    const localMediaStream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints,
    });

    [audioTrack] = localMediaStream.getAudioTracks();
    spawnDeviceUpdateWatcher({ audioOpened: true, videoOpened: true });

    try {
      stopMicrophoneMeasurement = await getAudioVolume(localMediaStream, (val) => {
        setMicrophoneIntensity(val);
      });
    } catch {
      setAudioMeasurementAllowed(false);
    }
  }, [audioConstraints, spawnDeviceUpdateWatcher]);

  useEffect(() => {
    startMicrophoneMeasurement();

    return () => {
      if (stopMicrophoneMeasurement) {
        stopMicrophoneMeasurement();
      }
      killDeviceUpdateWatcher();
      audioTrack?.stop();
    };
  }, [
    audioConstraints,
    setMicrophoneIntensity,
    killDeviceUpdateWatcher,
    spawnDeviceUpdateWatcher,
    startMicrophoneMeasurement,
  ]);

  useEffect(() => {
    if (videoOpened) {
      videoStopped = false;
      navigator.mediaDevices
        .getUserMedia({
          video: videoOpened && videoConstraints,
        })
        .then((localMediaStream) => {
          [videoTrack] = localMediaStream.getVideoTracks();

          if (videoStopped) {
            videoTrack?.stop();
          } else {
            setRequestingVideo(false);
          }

          if (videoRef.current) {
            videoRef.current.srcObject = localMediaStream;
          }
        })
        .catch(() => {
          setRequestingVideo(false);
        });
    }

    return () => {
      videoTrack?.stop();
      videoStopped = true;
    };
  }, [videoConstraints, videoOpened]);

  const getVideo = useCallback(() => {
    setVideoOpened(true);
    setRequestingVideo(true);
  }, [setVideoOpened]);

  const stopVideo = useCallback(() => {
    setVideoOpened(false);
  }, [setVideoOpened]);

  useEffect(() => {
    if (audioPlaying) {
      (async () => {
        if (audioRef.current) {
          const stream = (
            audioRef.current as unknown as {
              captureStream: () => MediaStream;
            }
          ).captureStream();
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

  const selectedString = useMemo(
    () =>
      audioDevices.find(({ deviceId }) => deviceId === activeAudioDevice)?.label ||
      t('activeCall.default'),
    [activeAudioDevice, audioDevices, t],
  );

  return (
    <div className="audio-video">
      <h3 className="audio-video__title">{t('audioVideo.title')}</h3>
      <div className="audio-video__subject-title">
        <VideoSvg viewBox="0 0 18 18" className="audio-video__subject-icon" />
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
        {videoOpened && (
          <>
            <video muted autoPlay playsInline ref={videoRef} className="audio-video__video" />
            {!requestingVideo && (
              <Button onClick={stopVideo} type="button" className="audio-video__stop-video">
                {t('audioVideo.stop-video')}
              </Button>
            )}
          </>
        )}
        {(!videoOpened || requestingVideo) && (
          <>
            <VideoCameraSvg className="audio-video__video-icon" viewBox="0 0 300 280" />
            <Button
              loading={requestingVideo}
              onClick={getVideo}
              type="button"
              className="audio-video__video-btn">
              {t('audioVideo.test-video')}
            </Button>
          </>
        )}
      </div>
      <HorizontalSeparator />
      <div className="audio-video__intensity-wrapper">
        <div className="audio-video__subject-title">
          <MicrophoneSvg viewBox="0 0 20 24" className="audio-video__subject-icon" />
          <h5 className="audio-video__subject-text">{t('audioVideo.microphone')}</h5>
        </div>
        {audioMeasurementAllowed && <IntensityIndicator intensity={microphoneIntensity} />}
      </div>
      <div className="audio-video__dropdown-wrapper">
        <Dropdown
          selectedString={selectedString}
          options={audioDevices.map((device) => ({
            title: device.label,
            onClick: () => switchDevice({ kind: InputType.AudioInput, deviceId: device.deviceId }),
          }))}
        />
      </div>
      <HorizontalSeparator />
      <div className="audio-video__intensity-wrapper">
        <button
          type="button"
          onClick={toggleAudio}
          className="audio-video__subject-title audio-video__subject-title--button">
          {audioPlaying ? (
            <PauseSvg viewBox="0 0 24 24" className="audio-video__subject-icon" />
          ) : (
            <PlaySvg viewBox="0 0 24 24" className="audio-video__subject-icon" />
          )}
          <audio src={incomingCallSound} hidden ref={audioRef} />
          <h5 className="audio-video__subject-text">{t('audioVideo.load-speaker')}</h5>
        </button>
        {audioMeasurementAllowed && <IntensityIndicator intensity={audioIntensity} />}
      </div>
    </div>
  );
};

export default AudioVideoSettings;
