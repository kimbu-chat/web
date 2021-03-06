import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';

import { SECOND_DURATION } from '@common/constants';
import { Avatar } from '@components/avatar';
import { Dropdown } from '@components/dropdown';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as HangUpSvg } from '@icons/ic-call-out.svg';
import { ReactComponent as VoiceCallSvg } from '@icons/ic-call.svg';
import { ReactComponent as ExitFullScreenSvg } from '@icons/ic-fullscreen-exit.svg';
import { ReactComponent as FullScreenSvg } from '@icons/ic-fullscreen.svg';
import { ReactComponent as MicrophoneDisableSvg } from '@icons/ic-microphone-mute.svg';
import { ReactComponent as MicrophoneEnableSvg } from '@icons/ic-microphone.svg';
import { ReactComponent as ScreenSharingDisableSvg } from '@icons/ic-screen-share-mute.svg';
import { ReactComponent as ScreenSharingEnableSvg } from '@icons/ic-screen-share.svg';
import { ReactComponent as VideoDisableSvg } from '@icons/ic-video-call-mute.svg';
import { ReactComponent as VideoEnableSvg } from '@icons/ic-video-call.svg';
import busySound from '@sounds/calls/busy-sound.ogg';
import callingBeep from '@sounds/calls/outgoing-call.ogg';
import {
  cancelCallAction,
  changeMediaStatusAction,
  changeScreenShareStatusAction,
  endCallAction,
  outgoingCallAction,
  switchDeviceAction,
} from '@store/calls/actions';
import { InputType } from '@store/calls/common/enums/input-type';
import {
  amICallingSelector,
  doIhaveCallSelector,
  getAudioConstraintsSelector,
  getAudioDevicesSelector,
  getCallInterlocutorSelector,
  getIsInterlocutorAudioEnabledSelector,
  getIsInterlocutorBusySelector,
  getIsInterlocutorVideoEnabledSelector,
  getIsScreenSharingEnabledSelector,
  getVideoConstraintsSelector,
  getVideoDevicesSelector,
} from '@store/calls/selectors';
import {
  getInterlocutorAudioTrack,
  getInterlocutorVideoTrack,
  tracks,
} from '@store/calls/utils/user-media';
import { playSoundSafely } from '@utils/current-music';
import { getHourMinuteSecond } from '@utils/date-utils';

import './active-call.scss';

const BLOCK_NAME = 'active-call';

const ActiveCall: React.FC = () => {
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

  const reCallWithVideo = useCallback(() => {
    if (interlocutor?.id) {
      callInterlocutor({
        callingUserId: interlocutor.id,
        constraints: {
          videoEnabled: true,
          audioEnabled: true,
        },
      });
    }
  }, [interlocutor, callInterlocutor]);

  const reCallWithAudio = useCallback(() => {
    if (interlocutor?.id) {
      callInterlocutor({
        callingUserId: interlocutor.id,
        constraints: {
          videoEnabled: false,
          audioEnabled: true,
        },
      });
    }
  }, [interlocutor, callInterlocutor]);

  const selectedAudioString = useMemo(
    () =>
      audioDevices.find(({ deviceId }) => deviceId === activeAudioDevice)?.label ||
      t('activeCall.default'),
    [audioDevices, t, activeAudioDevice],
  );

  const selectedVideoString = useMemo(
    () =>
      videoDevices.find(({ deviceId }) => deviceId === activeVideoDevice)?.label ||
      t('activeCall.default'),
    [activeVideoDevice, t, videoDevices],
  );

  return ReactDOM.createPortal(
    <Rnd
      ref={dragRef}
      className={classNames(`${BLOCK_NAME}__drag`, { [`${BLOCK_NAME}__drag--big`]: isFullScreen })}
      default={{
        x: window.innerWidth / 2 - 120,
        y: window.innerHeight / 2 - 120,
        width: 304,
        height: 328,
      }}
      bounds="body"
      disableDragging={isFullScreen}>
      <div
        className={classNames(BLOCK_NAME, {
          [`${BLOCK_NAME}--big`]: isFullScreen,
        })}>
        <div
          className={classNames(`${BLOCK_NAME}__top`, {
            [`${BLOCK_NAME}__top--big`]: isFullScreen,
          })}>
          <div className={`${BLOCK_NAME}__main-data`}>
            <h3
              className={classNames(
                `${BLOCK_NAME}__interlocutor-name`,
              )}>{`${interlocutor?.firstName} ${interlocutor?.lastName}`}</h3>
            {amISpeaking && (
              <div className={`${BLOCK_NAME}__duration`}>
                {getHourMinuteSecond(callDuration * SECOND_DURATION)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={changeFullScreenStatus}
            className={`${BLOCK_NAME}__change-screen`}>
            {isFullScreen ? <ExitFullScreenSvg /> : <FullScreenSvg />}
          </button>
        </div>

        <audio
          autoPlay
          playsInline
          ref={remoteAudioRef}
          className={`${BLOCK_NAME}__remote-audio`}
        />

        {isFullScreen && (
          <div
            className={classNames(
              `${BLOCK_NAME}__dropdown-wrapper`,
              `${BLOCK_NAME}__dropdown-wrapper--audio`,
            )}>
            <Dropdown
              selectedString={selectedAudioString}
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
          <div
            className={classNames(
              `${BLOCK_NAME}__dropdown-wrapper`,
              `${BLOCK_NAME}__dropdown-wrapper--video`,
            )}>
            <Dropdown
              selectedString={selectedVideoString}
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
              className={classNames(`${BLOCK_NAME}__remote-video`, {
                [`${BLOCK_NAME}__remote-video--big`]: isFullScreen,
              })}
            />
            <div className={`${BLOCK_NAME}__gradient`} />
          </>
        ) : (
          <Avatar className={`${BLOCK_NAME}__interlocutor-avatar`} size={100} user={interlocutor} />
        )}

        {isInterlocutorBusy && <span>{t('activeCall.busy')}</span>}

        {isVideoOpened && (
          <video
            autoPlay
            playsInline
            ref={localVideoRef}
            className={classNames(`${BLOCK_NAME}__local-video`, {
              [`${BLOCK_NAME}__local-video--big`]: isFullScreen,
            })}
          />
        )}

        <div
          className={classNames(`${BLOCK_NAME}__bottom-menu`, {
            [`${BLOCK_NAME}__bottom-menu--big`]: isFullScreen,
          })}>
          {amISpeaking && !isInterlocutorBusy && (
            <button
              type="button"
              onClick={changeAudioStatus}
              className={classNames(`${BLOCK_NAME}__call-btn`, {
                [`${BLOCK_NAME}__call-btn--big`]: isFullScreen,
              })}>
              {isAudioOpened ? <MicrophoneEnableSvg /> : <MicrophoneDisableSvg />}
            </button>
          )}

          {amISpeaking && !isInterlocutorBusy && (
            <button
              type="button"
              onClick={changeVideoStatus}
              className={classNames(`${BLOCK_NAME}__call-btn`, {
                [`${BLOCK_NAME}__call-btn--big`]: isFullScreen,
              })}>
              {isVideoOpened ? <VideoEnableSvg /> : <VideoDisableSvg />}
            </button>
          )}

          {amISpeaking && !isInterlocutorBusy && (
            <button
              type="button"
              onClick={changeScreenShareStatus}
              className={classNames(`${BLOCK_NAME}__call-btn`, {
                [`${BLOCK_NAME}__call-btn--big`]: isFullScreen,
              })}>
              {isScreenSharingOpened ? <ScreenSharingEnableSvg /> : <ScreenSharingDisableSvg />}
            </button>
          )}

          {amISpeaking && isInterlocutorBusy && (
            <button
              type="button"
              onClick={reCallWithVideo}
              className={classNames(`${BLOCK_NAME}__call-btn`, {
                [`${BLOCK_NAME}__call-btn--big`]: isFullScreen,
              })}>
              <VideoEnableSvg />
            </button>
          )}

          {isInterlocutorBusy && (
            <button
              type="button"
              onClick={reCallWithAudio}
              className={classNames(`${BLOCK_NAME}__call-btn`, {
                [`${BLOCK_NAME}__call-btn--big`]: isFullScreen,
              })}>
              <VoiceCallSvg />
            </button>
          )}

          <button
            type="button"
            className={classNames(`${BLOCK_NAME}__call-btn`, `${BLOCK_NAME}__call-btn--end-call`, {
              [`${BLOCK_NAME}__call-btn--big`]: isFullScreen,
            })}
            onClick={() => {
              if (amICallingSelectorSomebody || isInterlocutorBusy) {
                cancelCall();
              } else {
                endCall();
              }
            }}>
            <HangUpSvg />
          </button>
        </div>
      </div>
    </Rnd>,

    document.getElementById('root') || document.createElement('div'),
  );
};

ActiveCall.displayName = 'ActiveCall';

export { ActiveCall };
