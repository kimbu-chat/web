import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import VideoSvg from '@icons/video.svg';
import PlaySvg from '@icons/play.svg';
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
import { getAudioVolume } from '@app/utils/get-audio-volume-size';
import { Dropdown } from '../../shared/dropdown/dropdown';

let videoTrack: MediaStreamTrack | undefined;
let audioTrack: MediaStreamTrack | undefined;

export const AudioVideoSettings = () => {
  const { t } = useContext(LocalizationContext);

  const videoRef = useRef<HTMLVideoElement>(null);

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
  const [audioOpened, setAudioOpened] = useState(false);

  const [microphoneIntensity, setMicrophoneIntensity] = useState(0);

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
    let stopAudioMeasurement: () => void;

    if (audioOpened) {
      (async () => {
        const localMediaStream = await navigator.mediaDevices.getUserMedia({
          audio: audioOpened && audioConstraints,
        });

        [audioTrack] = localMediaStream.getAudioTracks();
        spawnDeviceUpdateWatcher({ audioOpened });

        stopAudioMeasurement = await getAudioVolume(localMediaStream, (val) => {
          setMicrophoneIntensity(val);
        });
      })();
    } else {
      if (stopAudioMeasurement!) {
        stopAudioMeasurement();
      }
      killDeviceUpdateWatcher();
      audioTrack?.stop();
    }

    return () => {
      if (stopAudioMeasurement) {
        stopAudioMeasurement();
      }
      killDeviceUpdateWatcher();
      audioTrack?.stop();
    };
  }, [audioConstraints, audioOpened, setMicrophoneIntensity]);

  const getVideo = useCallback(() => {
    setVideoOpened(true);
  }, [setVideoOpened]);

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
          <PlaySvg viewBox='0 0 24 24' className='audio-video__subject-icon' />
          <h5 className='audio-video__subject-text'>{t('audioVideo.load-speaker')}</h5>
        </div>
        <div className='audio-video__intensity-indicator'>
          <div data-active className='audio-video__intensity-point' />
          <div data-active className='audio-video__intensity-point' />
          <div data-active className='audio-video__intensity-point' />
          <div data-active className='audio-video__intensity-point' />
          <div data-middle className='audio-video__intensity-point' />
          <div data-middle className='audio-video__intensity-point' />
          <div className='audio-video__intensity-point' />
          <div className='audio-video__intensity-point' />
          <div className='audio-video__intensity-point' />
          <div className='audio-video__intensity-point' />
        </div>
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
              setAudioOpened((oldState) => !oldState);
            }}
            viewBox='0 0 20 24'
            className='audio-video__subject-icon'
          />
          <h5 className='audio-video__subject-text'>{t('audioVideo.microphone')}</h5>
        </div>
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
      </div>
    </div>
  );
};
