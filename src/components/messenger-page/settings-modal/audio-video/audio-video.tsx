import React, { useContext } from 'react';
import { ReactComponent as VideoSvg } from '@icons/video.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as MicrophoneSvg } from '@icons/voice.svg';
import './audio-video.scss';
import { LocalizationContext } from '@contexts';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { InputType } from '@store/calls/common/enums/input-type';
import {
  getVideoConstraintsSelector,
  getAudioConstraintsSelector,
  getAudioDevicesSelector,
  getVideoDevicesSelector,
} from '@store/calls/selectors';
import { useSelector } from 'react-redux';
import * as CallActions from '@store/calls/actions';
import { ReactComponent as VideoCameraSvg } from '@icons/video-camera.svg';
import { Dropdown } from '../../shared/dropdown/dropdown';

export const AudioVideoSettings = () => {
  const { t } = useContext(LocalizationContext);

  const videoConstraints = useSelector(getVideoConstraintsSelector);
  const audioConstraints = useSelector(getAudioConstraintsSelector);
  const audioDevices = useSelector(getAudioDevicesSelector);
  const videoDevices = useSelector(getVideoDevicesSelector);

  const activeAudioDevice = audioConstraints.deviceId;
  const activeVideoDevice = videoConstraints.deviceId;

  const switchDevice = useActionWithDispatch(CallActions.switchDeviceAction);

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
        <VideoCameraSvg className="audio-video__video-icon" viewBox="0 0 300 280" />
        <button type="button" className="audio-video__video-btn">
          {t('audioVideo.test-video')}
        </button>
      </div>
      <div className="audio-video__intensity-wrapper">
        <div className="audio-video__subject-title">
          <PlaySvg viewBox="0 0 24 24" className="audio-video__subject-icon" />
          <h5 className="audio-video__subject-text">{t('audioVideo.load-speaker')}</h5>
        </div>
        <div className="audio-video__intensity-indicator">
          <div data-active className="audio-video__intensity-point" />
          <div data-active className="audio-video__intensity-point" />
          <div data-active className="audio-video__intensity-point" />
          <div data-active className="audio-video__intensity-point" />
          <div data-middle className="audio-video__intensity-point" />
          <div data-middle className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
        </div>
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
          <MicrophoneSvg viewBox="0 0 20 24" className="audio-video__subject-icon" />
          <h5 className="audio-video__subject-text">{t('audioVideo.microphone')}</h5>
        </div>
        <div className="audio-video__intensity-indicator">
          <div data-active className="audio-video__intensity-point" />
          <div data-active className="audio-video__intensity-point" />
          <div data-active className="audio-video__intensity-point" />
          <div data-active className="audio-video__intensity-point" />
          <div data-middle className="audio-video__intensity-point" />
          <div data-middle className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
          <div className="audio-video__intensity-point" />
        </div>
      </div>
    </div>
  );
};
