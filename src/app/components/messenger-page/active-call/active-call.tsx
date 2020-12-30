import React, { useRef, useCallback, useEffect, useState, useContext } from 'react';
import './active-call.scss';
import { useSelector } from 'react-redux';
import {
  amICalling,
  doIhaveCall,
  getAudioConstraints,
  getAudioDevices,
  getCallInterlocutorSelector,
  getIsInterlocutorBusy,
  getIsInterlocutorVideoEnabled,
  getIsScreenSharingEnabled,
  getVideoConstraints,
  getVideoDevices,
} from 'store/calls/selectors';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import moment from 'moment';
import { Rnd } from 'react-rnd';
import { Avatar } from 'components';
import { getUserInitials } from 'utils/interlocutor-name-utils';
import ReactDOM from 'react-dom';

// SVG
import MicrophoneEnableSvg from 'icons/ic-microphone.svg';
import MicrophoneDisableSvg from 'icons/ic-microphone-mute.svg';
import VideoEnableSvg from 'icons/ic-video-call.svg';
import VideoDisableSvg from 'icons/ic-video-call-mute.svg';
import ScreenSharingEnableSvg from 'icons/ic-screen-share.svg';
import ScreenSharingDisableSvg from 'icons/ic-screen-share-mute.svg';
import HangUpSvg from 'icons/ic-call-out.svg';
import FullScreenSvg from 'icons/ic-fullscreen.svg';
import ExitFullScreenSvg from 'icons/ic-fullscreen-exit.svg';
import VoiceCallSvg from 'icons/ic-call.svg';

// sounds
import callingBeep from 'app/assets/sounds/calls/outgoing-call.ogg';
import busySound from 'app/assets/sounds/calls/busy-sound.ogg';
import { LocalizationContext } from 'app/app';
import { IUserPreview } from 'store/my-profile/models';
import { interlocutorAudioTrack, interlocutorVideoTrack, tracks } from 'app/store/calls/utils/user-media';
import { InputType } from 'app/store/calls/common/enums/input-type';
import { Dropdown } from './dropdown/dropdown';

export const ActiveCall: React.FC = () => {
  const interlocutor = useSelector(getCallInterlocutorSelector);
  const videoConstraints = useSelector(getVideoConstraints);
  const audioConstraints = useSelector(getAudioConstraints);
  const isScreenSharingOpened = useSelector(getIsScreenSharingEnabled);
  const audioDevices = useSelector(getAudioDevices);
  const videoDevices = useSelector(getVideoDevices);
  const isInterlocutorVideoEnabled = useSelector(getIsInterlocutorVideoEnabled);
  const amICallingSomebody = useSelector(amICalling);
  const amISpeaking = useSelector(doIhaveCall);
  const isInterlocutorBusy = useSelector(getIsInterlocutorBusy);

  const { t } = useContext(LocalizationContext);

  const isVideoOpened = videoConstraints.isOpened;
  const isAudioOpened = audioConstraints.isOpened;
  const activeAudioDevice = audioConstraints.deviceId;
  const activeVideoDevice = videoConstraints.deviceId;

  const changeMediaStatus = useActionWithDispatch(CallActions.changeMediaStatusAction);
  const endCall = useActionWithDispatch(CallActions.endCallAction);
  const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);
  const changeScreenShareStatus = useActionWithDispatch(CallActions.changeScreenShareStatusAction);
  const switchDevice = useActionWithDispatch(CallActions.switchDeviceAction);
  const cancelCall = useActionWithDispatch(CallActions.cancelCallAction);

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
    changeMediaStatus({ kind: InputType.audioInput });
  }, [changeMediaStatus]);

  const changeVideoStatus = useCallback(() => {
    changeMediaStatus({ kind: InputType.videoInput });
  }, [changeMediaStatus]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      if (interlocutorVideoTrack) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(interlocutorVideoTrack);
        remoteVideoRef.current.pause();
        remoteVideoRef.current.srcObject = mediaStream;
        remoteVideoRef.current.play();
        console.log('video');
      }
    }
  }, [interlocutorVideoTrack, isInterlocutorVideoEnabled, remoteVideoRef]);

  useEffect(() => {
    if (remoteAudioRef.current) {
      if (interlocutorAudioTrack) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(interlocutorAudioTrack);
        remoteAudioRef.current.pause();
        remoteAudioRef.current.srcObject = mediaStream;
        remoteAudioRef.current.play();
        console.log('audio');
      }
    }
  }, [interlocutorAudioTrack, remoteAudioRef]);

  // local video stream assigning
  useEffect(() => {
    const localVideoStream = new MediaStream();
    if (tracks.videoTrack) {
      localVideoStream.addTrack(tracks.videoTrack);
      if (localVideoRef.current) {
        localVideoRef.current.pause();
        localVideoRef.current.srcObject = localVideoStream;
        localVideoRef.current.play();
      }
    }
  }, [tracks.videoTrack]);

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

    return () => {};
  }, [amISpeaking]);

  // audio playing when outgoing call
  useEffect(() => {
    if (amICallingSomebody && !isInterlocutorBusy) {
      const audio = new Audio(callingBeep);

      audio.addEventListener('ended', audio.play, false);

      audio.play();

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

    return () => {};
  }, [amICallingSomebody, isInterlocutorBusy]);

  useEffect(() => {
    dragRef.current?.updatePosition(isFullScreen ? { x: 0, y: 0 } : { x: window.innerWidth / 2 - 120, y: window.innerHeight / 2 - 120 });
    dragRef.current?.updateSize(isFullScreen ? { width: window.innerWidth, height: window.innerHeight } : { width: 304, height: 328 });
  }, [isFullScreen]);

  const reCallWithVideo = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as IUserPreview,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      }),
    [interlocutor],
  );

  const reCallWithAudio = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as IUserPreview,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      }),
    [interlocutor],
  );

  return ReactDOM.createPortal(
    <Rnd
      ref={dragRef}
      default={{
        x: window.innerWidth / 2 - 120,
        y: window.innerHeight / 2 - 120,
        width: 0,
        height: 0,
      }}
      bounds='body'
      disableDragging={isFullScreen}
    >
      <div className={`active-call ${isFullScreen ? 'active-call--big' : ''}`}>
        <div className={`active-call__main-data ${isFullScreen ? 'active-call__main-data--big' : ''}`}>
          <h3 className='active-call__interlocutor-name'>{`${interlocutor?.firstName} ${interlocutor?.lastName}`}</h3>
          {amISpeaking && <div className='active-call__duration'>{moment.utc(callDuration * 1000).format('HH:mm:ss')}</div>}
        </div>

        <button type='button' onClick={changeFullScreenStatus} className='active-call__change-screen'>
          {isFullScreen ? <ExitFullScreenSvg viewBox='0 0 25 25' /> : <FullScreenSvg viewBox='0 0 25 25' />}
        </button>

        <audio autoPlay playsInline ref={remoteAudioRef} className='active-call__remote-audio' />

        {isFullScreen && (
          <div className='active-call__dropdown-wrapper active-call__dropdown-wrapper--audio'>
            <Dropdown
              selectedString={audioDevices.find(({ deviceId }) => deviceId === activeAudioDevice)?.label || t('activeCall.default')}
              disabled={!isAudioOpened}
              options={audioDevices.map((device) => ({
                title: device.label,
                onClick: () => switchDevice({ kind: InputType.audioInput, deviceId: device.deviceId }),
              }))}
            />
          </div>
        )}

        {isFullScreen && (
          <div className='active-call__dropdown-wrapper active-call__dropdown-wrapper--video'>
            <Dropdown
              selectedString={videoDevices.find(({ deviceId }) => deviceId === activeVideoDevice)?.label || t('activeCall.default')}
              disabled={!isVideoOpened}
              options={videoDevices.map((device) => ({
                title: device.label,
                onClick: () => switchDevice({ kind: InputType.videoInput, deviceId: device.deviceId }),
              }))}
            />
          </div>
        )}

        {isInterlocutorVideoEnabled ? (
          <>
            <video autoPlay playsInline ref={remoteVideoRef} className={`active-call__remote-video ${isFullScreen ? 'active-call__remote-video--big' : ''}`} />
            <div className='active-call__gradient' />
          </>
        ) : (
          <Avatar className='active-call__interlocutor-avatar' src={interlocutor?.avatar?.previewUrl}>
            {getUserInitials(interlocutor)}
          </Avatar>
        )}

        {isInterlocutorBusy && <span>{t('activeCall.busy')}</span>}

        {isVideoOpened && (
          <video autoPlay playsInline ref={localVideoRef} className={`active-call__local-video ${isFullScreen ? 'active-call__local-video--big' : ''}`} />
        )}

        <div className={`active-call__bottom-menu ${isFullScreen ? 'active-call__bottom-menu--big' : ''}`}>
          {amISpeaking && !isInterlocutorBusy && (
            <button
              type='button'
              onClick={changeAudioStatus}
              className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}
            >
              {isAudioOpened ? <MicrophoneEnableSvg viewBox='0 0 25 25' /> : <MicrophoneDisableSvg viewBox='0 0 25 25' />}
            </button>
          )}

          {amISpeaking && !isInterlocutorBusy && (
            <button
              type='button'
              onClick={changeVideoStatus}
              className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}
            >
              {isVideoOpened ? <VideoEnableSvg viewBox='0 0 25 25' /> : <VideoDisableSvg viewBox='0 0 25 25' />}
            </button>
          )}

          {amISpeaking && !isInterlocutorBusy && (
            <button
              type='button'
              onClick={changeScreenShareStatus}
              className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}
            >
              {isScreenSharingOpened ? <ScreenSharingEnableSvg viewBox='0 0 25 25' /> : <ScreenSharingDisableSvg viewBox='0 0 25 25' />}
            </button>
          )}

          {amISpeaking && isInterlocutorBusy && (
            <button
              type='button'
              onClick={reCallWithVideo}
              className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}
            >
              <VideoEnableSvg viewBox='0 0 25 25' />
            </button>
          )}

          {isInterlocutorBusy && (
            <button
              type='button'
              onClick={reCallWithAudio}
              className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}`}
            >
              <VoiceCallSvg viewBox='0 0 25 25' />
            </button>
          )}

          <button
            type='button'
            className={`active-call__call-btn active-call__call-btn--end-call ${isFullScreen ? 'active-call__call-btn--big' : ''}`}
            onClick={() => {
              if (amICallingSomebody || isInterlocutorBusy) {
                cancelCall();
              } else {
                endCall();
              }
            }}
          >
            <HangUpSvg viewBox='0 0 25 25' />
          </button>
        </div>
      </div>
    </Rnd>,

    document.getElementById('root') || document.createElement('div'),
  );
};
