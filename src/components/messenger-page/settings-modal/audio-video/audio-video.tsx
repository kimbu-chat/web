import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import VideoSvg from '@icons/video.svg';
import PlaySvg from '@icons/play.svg';
import PauseSvg from '@icons/pause.svg';
import MicrophoneSvg from '@icons/voice.svg';
import './audio-video.scss';
import { LocalizationContext } from '@app/contexts';
import { useActionWithDispatch } from '@app/hooks/use-action-with-dispatch';
import { InputType } from '@app/store/calls/common/enums/input-type';
import { getVideoConstraintsSelector, getAudioConstraintsSelector, getAudioDevicesSelector, getVideoDevicesSelector } from '@app/store/calls/selectors';
import { useSelector } from 'react-redux';
import * as CallActions from '@store/calls/actions';
import VideoCameraSvg from '@icons/video-camera.svg';
import { KillDeviceUpdateWatcher } from '@app/store/calls/features/device-watcher/kill-device-update-watcher';
import { SpawnDeviceUpdateWatcher } from '@app/store/calls/features/device-watcher/spawn-device-update-watcher';
import incomingCallSound from '@sounds/calls/imcoming-call.ogg';
import { getAudioVolume } from '@app/utils/get-audio-volume-size';
import { playSoundSafely } from '@app/utils/current-music';
import { Dropdown } from '../../shared/dropdown/dropdown';

let videoTrack: MediaStreamTrack | undefined;
let audioTrack: MediaStreamTrack | undefined;
let stopMicrophoneMeasurement: () => void;
let stopAudioMeasurement: () => void;

export const AudioVideoSettings = () => {
  const { t } = useContext(LocalizationContext);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const videoConstraints = useSelector(getVideoConstraintsSelector);
  const audioConstraints = useSelector(getAudioConstraintsSelector);
  const audioDevices = useSelector(getAudioDevicesSelector);
  const videoDevices = useSelector(getVideoDevicesSelector);

  const activeAudioDevice = audioConstraints.deviceId;
  const activeVideoDevice = videoConstraints.deviceId;

  const switchDevice = useActionWithDispatch(CallActions.switchDeviceAction);
  const killDeviceUpdateWatcher = useActionWithDispatch(KillDeviceUpdateWatcher.action);
  const spawnDeviceUpdateWatcher = useActionWithDispatch(SpawnDeviceUpdateWatcher.action);

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
  }, [videoConstraints, videoOpened]);

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
  }, [audioConstraints, microphoneOpened, setMicrophoneIntensity]);

  const getVideo = useCallback(() => {
    setVideoOpened(true);
  }, [setVideoOpened]);

  useEffect(() => {
    if (audioPlaying) {
      (async () => {
        if (audioRef.current) {
          const stream = ((audioRef.current as unknown) as { captureStream: () => MediaStream }).captureStream();
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

    return () => {
      setAudioIntensity(0);
      if (audioRef.current) {
        audioRef.current?.pause();
      }
      if (stopAudioMeasurement) {
        stopAudioMeasurement();
      }
    };
  }, [audioPlaying]);

  return (
    <div className='audio-video'>
      <h3 className='audio-video__title'>{t('audioVideo.title')}</h3>
      <div className='audio-video__subject-title'>
        <VideoSvg onClick={getVideo} viewBox='0 0 18 18' className='audio-video__subject-icon' />
        <h5 className='audio-video__subject-text'>{t('audioVideo.video')}</h5>
      </div>
      <div className='audio-video__dropdown-wrapper'>
        <Dropdown
          selectedString={videoDevices.find(({ deviceId }) => deviceId === activeVideoDevice)?.label || t('activeCall.default')}
          options={videoDevices.map((device) => ({
            title: device.label,
            onClick: () => switchDevice({ kind: InputType.VideoInput, deviceId: device.deviceId }),
          }))}
        />
      </div>
      <div className='audio-video__video-area'>
        <VideoCameraSvg className='audio-video__video-icon' viewBox='0 0 300 280' />
        {videoOpened && <video muted autoPlay playsInline ref={videoRef} className='audio-video__video' />}
        <button onClick={getVideo} type='button' className='audio-video__video-btn'>
          {t('audioVideo.test-video')}
        </button>
      </div>
      <div className='audio-video__intensity-wrapper'>
        <div className='audio-video__subject-title'>
          {audioPlaying ? (
            <PauseSvg
              onClick={() => {
                setAudioPlaying(false);
              }}
              viewBox='0 0 24 24'
              className='audio-video__subject-icon'
            />
          ) : (
            <PlaySvg
              onClick={() => {
                setAudioPlaying(true);
              }}
              viewBox='0 0 24 24'
              className='audio-video__subject-icon'
            />
          )}
          <audio src={incomingCallSound} hidden ref={audioRef} />
          <h5 className='audio-video__subject-text'>{t('audioVideo.load-speaker')}</h5>
        </div>
        {audioMeasurementAllowed && (
          <div className='audio-video__intensity-indicator'>
            <div data-active={audioIntensity >= 10} data-middle={audioIntensity >= 9} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 9} data-middle={audioIntensity >= 8} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 8} data-middle={audioIntensity >= 7} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 7} data-middle={audioIntensity >= 6} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 6} data-middle={audioIntensity >= 5} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 5} data-middle={audioIntensity >= 4} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 4} data-middle={audioIntensity >= 3} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 3} data-middle={audioIntensity >= 2} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 2} data-middle={audioIntensity >= 1} className='audio-video__intensity-point' />
            <div data-active={audioIntensity >= 1} className='audio-video__intensity-point' />
          </div>
        )}
      </div>
      <div className='audio-video__dropdown-wrapper'>
        <Dropdown
          selectedString={audioDevices.find(({ deviceId }) => deviceId === activeAudioDevice)?.label || t('activeCall.default')}
          options={audioDevices.map((device) => ({
            title: device.label,
            onClick: () => switchDevice({ kind: InputType.AudioInput, deviceId: device.deviceId }),
          }))}
        />
      </div>
      <div className='audio-video__intensity-wrapper audio-video__intensity-wrapper--microphone'>
        <div className='audio-video__subject-title'>
          <MicrophoneSvg
            onClick={() => {
              setMicrophoneOpened((oldState) => !oldState);
            }}
            viewBox='0 0 20 24'
            className='audio-video__subject-icon'
          />
          <h5 className='audio-video__subject-text'>{t('audioVideo.microphone')}</h5>
        </div>
        {audioMeasurementAllowed && (
          <div className='audio-video__intensity-indicator'>
            <div data-active={microphoneIntensity >= 10} data-middle={microphoneIntensity >= 9} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 9} data-middle={microphoneIntensity >= 8} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 8} data-middle={microphoneIntensity >= 7} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 7} data-middle={microphoneIntensity >= 6} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 6} data-middle={microphoneIntensity >= 5} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 5} data-middle={microphoneIntensity >= 4} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 4} data-middle={microphoneIntensity >= 3} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 3} data-middle={microphoneIntensity >= 2} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 2} data-middle={microphoneIntensity >= 1} className='audio-video__intensity-point' />
            <div data-active={microphoneIntensity >= 1} className='audio-video__intensity-point' />
          </div>
        )}
      </div>
    </div>
  );
};
