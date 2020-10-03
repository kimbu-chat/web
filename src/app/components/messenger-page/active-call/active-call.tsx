import React, { useRef, useCallback, useEffect, useState } from 'react';
import './active-call.scss';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { useSelector } from 'react-redux';
import { getCallInterlocutorSelector } from 'app/store/calls/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';
import { RootState } from 'app/store/root-reducer';
import { tracks } from 'app/store/calls/sagas';
import moment from 'moment';
import { Rnd } from 'react-rnd';
import Avatar from 'app/components/shared/avatar/avatar';
import ReactDOM from 'react-dom';

//SVG
import MicrophoneEnableSvg from 'app/assets/icons/ic-microphone.svg';
import MicrophoneDisableSvg from 'app/assets/icons/ic-microphone-mute.svg';
import VideoEnableSvg from 'app/assets/icons/ic-video-call.svg';
import VideoDisableSvg from 'app/assets/icons/ic-video-call-mute.svg';
import ScreenSharingEnableSvg from 'app/assets/icons/ic-screen-share.svg';
import ScreenSharingDisableSvg from 'app/assets/icons/ic-screen-share-mute.svg';
import HangUpSvg from 'app/assets/icons/ic-call-out.svg';
import FullScreenSvg from 'app/assets/icons/ic-fullscreen.svg';
import ExitFullScreenSvg from 'app/assets/icons/ic-fullscreen-exit.svg';

namespace IActiveCall {
	export interface Props {
		isDisplayed: boolean;
	}
}

const ActiveCall = ({ isDisplayed }: IActiveCall.Props) => {
	const interlocutor = useSelector(getCallInterlocutorSelector);
	const videoConstraints = useSelector((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = useSelector((state: RootState) => state.calls.audioConstraints);
	const isScreenSharingOpened = useSelector((state: RootState) => state.calls.isScreenSharingOpened);
	const isMediaSwitchingEnabled = useSelector((state: RootState) => state.calls.isMediaSwitchingEnabled);
	const audioDevices = useSelector((state: RootState) => state.calls.audioDevicesList);
	const videoDevices = useSelector((state: RootState) => state.calls.videoDevicesList);
	const isInterlocutorVideoEnabled = useSelector((state: RootState) => state.calls.isInterlocutorVideoEnabled);

	const isVideoOpened = videoConstraints.isOpened;
	const isAudioOpened = audioConstraints.isOpened;
	const activeAudioDevice = audioConstraints.deviceId;
	const activeVideoDevice = videoConstraints.deviceId;

	const changeMediaStatus = useActionWithDispatch(CallActions.changeMediaStatusAction);
	const endCall = useActionWithDispatch(CallActions.endCallAction);
	const changeScreenShareStatus = useActionWithDispatch(CallActions.changeScreenShareStatusAction);
	const switchDevice = useActionWithDispatch(CallActions.switchDeviceAction);

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

	//!PEER connection callbacks

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

	//binding peer connection events
	useEffect(() => {
		peerConnection?.addEventListener('track', onTrack);

		//removing peer connection events
		return () => {
			peerConnection?.removeEventListener('track', onTrack);
		};
	}, [onTrack, isDisplayed]);

	//local video stream assigning
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
	}, [isVideoOpened, tracks.videoTracks[0]]);

	//component did mount effect
	useEffect(() => {
		if (isDisplayed) {
			setCallDuration(0);

			const callDurationIntervalCode = setInterval(() => setCallDuration((old) => old + 1), 1000);

			return () => {
				clearInterval(callDurationIntervalCode);
			};
		}

		return () => {};
	}, [isDisplayed]);

	useEffect(() => {
		dragRef.current?.updatePosition(
			isFullScreen ? { x: 0, y: 0 } : { x: window.innerWidth / 2 - 120, y: window.innerHeight / 2 - 120 },
		);
		dragRef.current?.updateSize(
			isDisplayed
				? isFullScreen
					? { width: window.innerWidth, height: window.innerHeight }
					: { width: 304, height: 264 }
				: { width: 0, height: 0 },
		);
	}, [isFullScreen, isDisplayed]);

	console.log('rere');

	return (
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
					<div className='active-call__duration'>{moment.utc(callDuration * 1000).format('HH:mm:ss')}</div>
				</div>

				<button onClick={changeFullScreenStatus} className='active-call__change-screen'>
					{isFullScreen ? <ExitFullScreenSvg viewBox='0 0 25 25' /> : <FullScreenSvg viewBox='0 0 25 25' />}
				</button>

				<audio autoPlay playsInline ref={remoteAudioRef} className='active-call__remote-audio'></audio>

				{isFullScreen && (
					<select
						onChange={(e) => switchDevice({ kind: 'audioinput', deviceId: e.target.value })}
						value={activeAudioDevice}
						disabled={!isMediaSwitchingEnabled || !isAudioOpened}
						className='active-call__select active-call__select--audio'
					>
						{audioDevices.map((device) => (
							<option value={device.deviceId} key={device.deviceId}>
								{device.label}
							</option>
						))}
					</select>
				)}

				{isFullScreen && (
					<select
						onChange={(e) => switchDevice({ kind: 'videoinput', deviceId: e.target.value })}
						value={activeVideoDevice}
						disabled={!isMediaSwitchingEnabled || !isVideoOpened}
						className='active-call__select active-call__select--video'
					>
						{videoDevices.map((device) => (
							<option value={device.deviceId} key={device.deviceId}>
								{device.label}
							</option>
						))}
					</select>
				)}

				{isInterlocutorVideoEnabled ? (
					<video
						autoPlay
						playsInline
						ref={remoteVideoRef}
						className={`active-call__remote-video ${isFullScreen ? 'active-call__remote-video--big' : ''}`}
					></video>
				) : (
					<Avatar
						className={`active-call__interlocutor-avatar ${
							isFullScreen ? 'active-call__interlocutor-avatar--big' : ''
						}`}
						src={interlocutor?.avatarUrl}
					>
						{/*getUserInitials(interlocutor)*/ 'AA'}
					</Avatar>
				)}

				{isVideoOpened && (
					<video
						autoPlay
						playsInline
						ref={localVideoRef}
						className={`active-call__local-video ${isFullScreen ? 'active-call__local-video--big' : ''}`}
					></video>
				)}

				<div className={`active-call__bottom-menu ${isFullScreen ? 'active-call__bottom-menu--big' : ''}`}>
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeAudioStatus}
						className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}
												${isAudioOpened ? 'active-call__call-btn--active' : ''}`}
					>
						{isAudioOpened ? (
							<MicrophoneEnableSvg viewBox='0 0 25 25' />
						) : (
							<MicrophoneDisableSvg viewBox='0 0 25 25' />
						)}
					</button>

					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeVideoStatus}
						className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}
												${isVideoOpened ? 'active-call__call-btn--active' : ''}`}
					>
						{isVideoOpened ? (
							<VideoEnableSvg viewBox='0 0 25 25' />
						) : (
							<VideoDisableSvg viewBox='0 0 25 25' />
						)}
					</button>

					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeScreenShareStatus}
						className={`active-call__call-btn 
												${isFullScreen ? 'active-call__call-btn--big' : ''}
												${isScreenSharingOpened ? 'active-call__call-btn--active' : ''}`}
					>
						{isScreenSharingOpened ? (
							<ScreenSharingEnableSvg viewBox='0 0 25 25' />
						) : (
							<ScreenSharingDisableSvg viewBox='0 0 25 25' />
						)}
					</button>

					<button
						className={`active-call__call-btn active-call__call-btn--end-call ${
							isFullScreen ? 'active-call__call-btn--big' : ''
						}`}
						onClick={() => endCall({ seconds: callDuration })}
					>
						<HangUpSvg viewBox='0 0 25 25' />
					</button>
				</div>
			</div>
		</Rnd>
	);
};

const ActiveCallPortal = (props: IActiveCall.Props) => {
	return ReactDOM.createPortal(
		<ActiveCall {...props} />,
		document.getElementById('root') || document.createElement('div'),
	);
};

export default ActiveCallPortal;
