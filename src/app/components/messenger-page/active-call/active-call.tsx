import React, { useRef, useCallback, useEffect, useState, useContext } from 'react';
import './active-call.scss';
import { peerConnection } from 'store/middlewares/webRTC/peerConnectionFactory';
import { useSelector } from 'react-redux';
import { amICaling, doIhaveCall, getCallInterlocutorSelector } from 'store/calls/selectors';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { RootState } from 'store/root-reducer';
import { tracks } from 'store/calls/sagas';
import moment from 'moment';
import { Rnd } from 'react-rnd';
import { Avatar } from 'components';
import { getUserInitials } from 'utils/functions/interlocutor-name-utils';
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
import { UserPreview } from 'store/my-profile/models';
import { Dropdown } from './dropdown/dropdown';

namespace IActiveCall {
  export interface Props {
    isDisplayed: boolean;
  }
}

export const ActiveCall: React.FC<IActiveCall.Props> = ({ isDisplayed }) => {
  const interlocutor = useSelector(getCallInterlocutorSelector);
  const videoConstraints = useSelector((state: RootState) => state.calls.videoConstraints);
  const audioConstraints = useSelector((state: RootState) => state.calls.audioConstraints);
  const isScreenSharingOpened = useSelector((state: RootState) => state.calls.isScreenSharingOpened);
  const audioDevices = useSelector((state: RootState) => state.calls.audioDevicesList);
  const videoDevices = useSelector((state: RootState) => state.calls.videoDevicesList);
  const isInterlocutorVideoEnabled = useSelector((state: RootState) => state.calls.isInterlocutorVideoEnabled);
  const amICalingSomebody = useSelector(amICaling);
  const amISpeaking = useSelector(doIhaveCall);
  const isInterlocutorBusy = useSelector((state: RootState) => state.calls.isInterlocutorBusy);

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
    changeMediaStatus({ kind: 'audioinput' });
  }, []);

  const changeVideoStatus = useCallback(() => {
    changeMediaStatus({ kind: 'videoinput' });
  }, []);

  //! PEER connection callbacks

  const onTrack = useCallback(
    (event: RTCTrackEvent) => {
      if (event.track.kind === 'video' && remoteVideoRef.current) {
        const remoteVideoStream = new MediaStream();
        remoteVideoStream.addTrack(event.track);
        remoteVideoRef.current.pause();
        remoteVideoRef.current.srcObject = remoteVideoStream;
        remoteVideoRef.current.play();
      }

      if (event.track.kind === 'audio' && remoteAudioRef.current) {
        const remoteAudioStream = new MediaStream();
        remoteAudioStream.addTrack(event.track);
        remoteAudioRef.current.pause();
        remoteAudioRef.current.srcObject = remoteAudioStream;
        remoteAudioRef.current.play();
      }
    },
    [remoteVideoRef, remoteAudioRef, peerConnection],
  );

  // binding peer connection events
  useEffect(() => {
    peerConnection?.addEventListener('track', onTrack);

    // removing peer connection events
    return () => {
      peerConnection?.removeEventListener('track', onTrack);
    };
  }, [onTrack, isDisplayed, peerConnection]);

  // local video stream assigning
  useEffect(() => {
    if (isVideoOpened) {
      const localVideoStream = new MediaStream();
      if (tracks.videoTracks[0]) {
        localVideoStream.addTrack(tracks.videoTracks[0]);
        if (localVideoRef.current) {
          localVideoRef.current.pause();
          localVideoRef.current.srcObject = localVideoStream;
          localVideoRef.current.play();
        }
      }
    }
  }, [isVideoOpened, tracks.videoTracks[0]?.id]);

  // component did mount effect
  useEffect(() => {
    if (isDisplayed && amISpeaking) {
      setCallDuration(0);

      const callDurationIntervalCode = setInterval(() => setCallDuration((old) => old + 1), 1000);

      return () => {
        clearInterval(callDurationIntervalCode);
        setIsFullScreen(false);
      };
    }

    return () => {};
  }, [isDisplayed, amISpeaking]);

  // audio playing when outgoing call
  useEffect(() => {
    if (amICalingSomebody && !isInterlocutorBusy) {
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
  }, [amICalingSomebody, isInterlocutorBusy]);

  useEffect(
    () => () => {
      setIsFullScreen(false);
    },
    [isDisplayed],
  );

  useEffect(() => {
    dragRef.current?.updatePosition(isFullScreen ? { x: 0, y: 0 } : { x: window.innerWidth / 2 - 120, y: window.innerHeight / 2 - 120 });
    dragRef.current?.updateSize(
      isDisplayed ? (isFullScreen ? { width: window.innerWidth, height: window.innerHeight } : { width: 304, height: 328 }) : { width: 0, height: 0 },
    );
  }, [isFullScreen, isDisplayed]);

  const reCallWithVideo = useCallback(
    () =>
      callInterlocutor({
        calling: interlocutor as UserPreview,
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
        calling: interlocutor as UserPreview,
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
      <div
        className={`${isDisplayed ? 'active-call' : 'completly-hidden'}
										${isFullScreen ? 'active-call--big' : ''}`}
      >
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
                onClick: () => switchDevice({ kind: 'audioinput', deviceId: device.deviceId }),
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
                onClick: () => switchDevice({ kind: 'videoinput', deviceId: device.deviceId }),
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
              if (amICalingSomebody || isInterlocutorBusy) {
                cancelCall();
              } else {
                endCall({ seconds: callDuration });
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
