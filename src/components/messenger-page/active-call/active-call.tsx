import React, { useRef, useCallback, useEffect, useState } from 'react';
import './active-call.scss';
import { useSelector } from 'react-redux';
import {
  amICallingSelector,
  doIhaveCallSelector,
  getAudioConstraintsSelector,
  getAudioDevicesSelector,
  getCallInterlocutorSelector,
  getIsInterlocutorBusySelector,
  getIsInterlocutorVideoEnabledSelector,
  getIsInterlocutorAudioEnabledSelector,
  getIsScreenSharingEnabledSelector,
  getVideoConstraintsSelector,
  getVideoDevicesSelector,
} from '@store/calls/selectors';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import {
  cancelCallAction,
  changeMediaStatusAction,
  changeScreenShareStatusAction,
  endCallAction,
  outgoingCallAction,
  switchDeviceAction,
} from '@store/calls/actions';
import moment from 'moment';
import { Rnd } from 'react-rnd';
import { Avatar } from '@components/shared';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import ReactDOM from 'react-dom';

// SVG
import { ReactComponent as MicrophoneEnableSvg } from '@icons/ic-microphone.svg';
import { ReactComponent as MicrophoneDisableSvg } from '@icons/ic-microphone-mute.svg';
import { ReactComponent as VideoEnableSvg } from '@icons/ic-video-call.svg';
import { ReactComponent as VideoDisableSvg } from '@icons/ic-video-call-mute.svg';
import { ReactComponent as ScreenSharingEnableSvg } from '@icons/ic-screen-share.svg';
import { ReactComponent as ScreenSharingDisableSvg } from '@icons/ic-screen-share-mute.svg';
import { ReactComponent as HangUpSvg } from '@icons/ic-call-out.svg';
import { ReactComponent as FullScreenSvg } from '@icons/ic-fullscreen.svg';
import { ReactComponent as ExitFullScreenSvg } from '@icons/ic-fullscreen-exit.svg';
import { ReactComponent as VoiceCallSvg } from '@icons/ic-call.svg';

// sounds
import callingBeep from '@sounds/calls/outgoing-call.ogg';
import busySound from '@sounds/calls/busy-sound.ogg';

import { useTranslation } from 'react-i18next';
import { IUser } from '@store/common/models';
import {
  getInterlocutorAudioTrack,
  getInterlocutorVideoTrack,
  tracks,
} from '@store/calls/utils/user-media';
import { InputType } from '@store/calls/common/enums/input-type';
import { playSoundSafely } from '@utils/current-music';
import { Dropdown } from '../shared/dropdown/dropdown';

export const ActiveCall: React.FC = () => {
  const interlocutor = useSelector(getCallInterlocutorSelector);
  const videoConstraints = useSelector(getVideoConstraintsSelector);
  const audioConstraints = useSelector(getAudioConstraintsSelector);
  const isScreenSharingOpened = useSelector(getIsScreenSharingEnabledSelector);
  const audioDevices = useSelector(getAudioDevicesSelector);
  const videoDevices = useSelector(getVideoDevicesSelector);
  const isInterlocutorVideoEnabled = useSelector(getIsInterlocutorVideoEnabledSelector);
  const isInterlocutorAudioEnabled = useSelector(getIsInterlocutorAudioEnabledSelector);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);
  const isInterlocutorBusy = useSelector(getIsInterlocutorBusySelector);

  const { t } = useTranslation();

  const isVideoOpened = videoConstraints.isOpened;
  const isAudioOpened = audioConstraints.isOpened;
  const activeAudioDevice = audioConstraints.deviceId;
  const activeVideoDevice = videoConstraints.deviceId;

  const changeMediaStatus = useActionWithDispatch(changeMediaStatusAction);
  const endCall = useActionWithDispatch(endCallAction);
  const callInterlocutor = useActionWithDispatch(outgoingCallAction);
  const changeScreenShareStatus = useActionWithDispatch(changeScreenShareStatusAction);
  const switchDevice = useActionWithDispatch(switchDeviceAction);
  const cancelCall = useActionWithDispatch(cancelCallAction);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<Rnd>(null);

  const [callDuration, setCallDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const changeFullScreenStatus = useCallback(() => {
    setIsFullScreen((oldStatus) => !oldStatus);
  }, [setIsFullScreen]);

  const changeAudioStatus = useCallback(() => {
    changeMediaStatus({ kind: InputType.AudioInput });
  }, [changeMediaStatus]);

  const changeVideoStatus = useCallback(() => {
    changeMediaStatus({ kind: InputType.VideoInput });
  }, [changeMediaStatus]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      const videoTrack = getInterlocutorVideoTrack();
      if (videoTrack) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(videoTrack);
        remoteVideoRef.current.srcObject = mediaStream;
      }
    }
  }, [isInterlocutorVideoEnabled, remoteVideoRef]);

  useEffect(() => {
    if (remoteAudioRef.current) {
      const audioTrack = getInterlocutorAudioTrack();
      if (audioTrack) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(audioTrack);
        remoteAudioRef.current.srcObject = mediaStream;
      }
    }
  }, [isInterlocutorAudioEnabled, remoteAudioRef]);

  // local video stream assigning
  useEffect(() => {
    const localVideoStream = new MediaStream();
    if (isVideoOpened && videoConstraints.deviceId && tracks.videoTrack) {
      localVideoStream.addTrack(tracks.videoTrack);
      if (localVideoRef.current) {
        localVideoRef.current.pause();
        localVideoRef.current.srcObject = localVideoStream;
        localVideoRef.current.play();
      }
    }
  }, [isVideoOpened, videoConstraints.deviceId]);

  // component did mount effect
  useEffect(() => {
    if (amISpeaking) {
      setCallDuration(0);

      const callDurationIntervalCode = setInterval(() => setCallDuration((old) => old + 1), 1000);

      return () => {
        clearInterval(callDurationIntervalCode);
        setIsFullScreen(false);
      };
    }

    return undefined;
  }, [amISpeaking]);

  // audio playing when outgoing call
  useEffect(() => {
    if (amICallingSelectorSomebody && !isInterlocutorBusy) {
      const audio = new Audio(callingBeep);

      audio.addEventListener('ended', audio.play, false);

      playSoundSafely(audio);

      return () => {
        audio.pause();
        audio.removeEventListener('ended', audio.play);
        audio.currentTime = 0;
      };
    }

    if (isInterlocutorBusy) {
      const audio = new Audio(busySound);
      audio.play();

      return () => {
        audio.pause();
      };
    }

    return undefined;
  }, [amICallingSelectorSomebody, isInterlocutorBusy]);

  const reCallWithVideo = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as IUser,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      }),
    [interlocutor, callInterlocutor],
  );

  const reCallWithAudio = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as IUser,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      }),
    [interlocutor, callInterlocutor],
  );

  return ReactDOM.createPortal(
    <Rnd
      ref={dragRef}
      className={`active-call__drag ${isFullScreen ? 'active-call__drag--big' : ''}`}
      default={{
        x: window.innerWidth / 2 - 120,
        y: window.innerHeight / 2 - 120,
        width: 304,
        height: 328,
      }}
      bounds="body"
      disableDragging={isFullScreen}>
      <div className={`active-call ${isFullScreen ? 'active-call--big' : ''}`}>
        <div
          className={`active-call__main-data ${isFullScreen ? 'active-call__main-data--big' : ''}`}>
          <h3 className="active-call__interlocutor-name">{`${interlocutor?.firstName} ${interlocutor?.lastName}`}</h3>
          {amISpeaking && (
            <div className="active-call__duration">
              {moment.utc(callDuration * 1000).format('HH:mm:ss')}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={changeFullScreenStatus}
          className="active-call__change-screen">
          {isFullScreen ? (
            <ExitFullScreenSvg viewBox="0 0 25 25" />
          ) : (
            <FullScreenSvg viewBox="0 0 25 25" />
          )}
        </button>

        <audio autoPlay playsInline ref={remoteAudioRef} className="active-call__remote-audio" />

        {isFullScreen && (
          <div className="active-call__dropdown-wrapper active-call__dropdown-wrapper--audio">
            <Dropdown
              selectedString={
                audioDevices.find(({ deviceId }) => deviceId === activeAudioDevice)?.label ||
                t('activeCall.default')
              }
              disabled={!isAudioOpened}
              options={audioDevices.map((device) => ({
                title: device.label,
                onClick: () =>
                  switchDevice({ kind: InputType.AudioInput, deviceId: device.deviceId }),
              }))}
            />
          </div>
        )}

        {isFullScreen && (
          <div className="active-call__dropdown-wrapper active-call__dropdown-wrapper--video">
            <Dropdown
              selectedString={
                videoDevices.find(({ deviceId }) => deviceId === activeVideoDevice)?.label ||
                t('activeCall.default')
              }
              disabled={!isVideoOpened}
              options={videoDevices.map((device) => ({
                title: device.label,
                onClick: () =>
                  switchDevice({ kind: InputType.VideoInput, deviceId: device.deviceId }),
              }))}
            />
          </div>
        )}

        {isInterlocutorVideoEnabled ? (
          <>
            <video
              autoPlay
              playsInline
              ref={remoteVideoRef}
              className={`active-call__remote-video ${
                isFullScreen ? 'active-call__remote-video--big' : ''
              }`}
            />
            <div className="active-call__gradient" />
          </>
        ) : (
          <Avatar
            className="active-call__interlocutor-avatar"
            src={interlocutor?.avatar?.previewUrl}>
            {getUserInitials(interlocutor)}
          </Avatar>
        )}

        {isInterlocutorBusy && <span>{t('activeCall.busy')}</span>}

        {isVideoOpened && (
          <video
            autoPlay
            playsInline
            ref={localVideoRef}
            className={`active-call__local-video ${
              isFullScreen ? 'active-call__local-video--big' : ''
            }`}
          />
        )}

        <div
          className={`active-call__bottom-menu ${
            isFullScreen ? 'active-call__bottom-menu--big' : ''
          }`}>
          {amISpeaking && !isInterlocutorBusy && (
            <button
              type="button"
              onClick={changeAudioStatus}
              className={`active-call__call-btn
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}>
              {isAudioOpened ? (
                <MicrophoneEnableSvg viewBox="0 0 25 25" />
              ) : (
                <MicrophoneDisableSvg viewBox="0 0 25 25" />
              )}
            </button>
          )}

          {amISpeaking && !isInterlocutorBusy && (
            <button
              type="button"
              onClick={changeVideoStatus}
              className={`active-call__call-btn
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}>
              {isVideoOpened ? (
                <VideoEnableSvg viewBox="0 0 25 25" />
              ) : (
                <VideoDisableSvg viewBox="0 0 25 25" />
              )}
            </button>
          )}

          {amISpeaking && !isInterlocutorBusy && (
            <button
              type="button"
              onClick={changeScreenShareStatus}
              className={`active-call__call-btn
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}>
              {isScreenSharingOpened ? (
                <ScreenSharingEnableSvg viewBox="0 0 25 25" />
              ) : (
                <ScreenSharingDisableSvg viewBox="0 0 25 25" />
              )}
            </button>
          )}

          {amISpeaking && isInterlocutorBusy && (
            <button
              type="button"
              onClick={reCallWithVideo}
              className={`active-call__call-btn
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}>
              <VideoEnableSvg viewBox="0 0 25 25" />
            </button>
          )}

          {isInterlocutorBusy && (
            <button
              type="button"
              onClick={reCallWithAudio}
              className={`active-call__call-btn
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}>
              <VoiceCallSvg viewBox="0 0 25 25" />
            </button>
          )}

          <button
            type="button"
            className={`active-call__call-btn active-call__call-btn--end-call ${
              isFullScreen ? 'active-call__call-btn--big' : ''
            }`}
            onClick={() => {
              if (amICallingSelectorSomebody || isInterlocutorBusy) {
                cancelCall();
              } else {
                endCall();
              }
            }}>
            <HangUpSvg viewBox="0 0 25 25" />
          </button>
        </div>
      </div>
    </Rnd>,

    document.getElementById('root') || document.createElement('div'),
  );
};
