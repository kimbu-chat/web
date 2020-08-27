import React, { useRef, useCallback, useEffect } from 'react';
import './active-call.scss';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { useSelector } from 'react-redux';
import { getCallInterlocutorSelector, isFullScreen } from 'app/store/calls/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';
import { RootState } from 'app/store/root-reducer';
import { tracks } from 'app/store/calls/sagas';

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
	const isFullScreenEnabled = useSelector(isFullScreen);

	const isVideoOpened = videoConstraints.isOpened;
	const isAudioOpened = audioConstraints.isOpened;
	const activeAudioDevice = audioConstraints.deviceId;
	const activeVideoDevice = videoConstraints.deviceId;

	const changeVideoStatus = useActionWithDispatch(CallActions.changeVideoStatusAction);
	const changeAudioStatus = useActionWithDispatch(CallActions.changeAudioStatusAction);
	const cancelCall = useActionWithDispatch(CallActions.cancelCallAction);
	const changeScreenShareStatus = useActionWithDispatch(CallActions.changeScreenShareStatusAction);
	const switchDevice = useActionWithDispatch(CallActions.switchDeviceAction);
	const changeFullScreenStatus = useActionWithDispatch(CallActions.changeFullScreenStatusAction);

	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const remoteAudioRef = useRef<HTMLAudioElement>(null);

	const localVideoRef = useRef<HTMLVideoElement>(null);

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
	}, [isVideoOpened, isDisplayed, activeVideoDevice, isMediaSwitchingEnabled]);

	return (
		<div
			className={`${isDisplayed ? 'active-call' : 'completly-hidden'} ${
				isFullScreenEnabled ? 'active-call--big' : ''
			}`}
		>
			<div className='active-call__menu'>
				<button className='svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
						<path
							fillRule='evenodd'
							d='M7.952 1.2a6.269 6.269 0 0 0-6.266 6.266 6.22 6.22 0 0 0 1.506 4.068l-.001 1.616v.536a1.522 1.522 0 0 0 2.34 1.284L7.5 13.716a6.269 6.269 0 0 0 6.72-6.25A6.269 6.269 0 0 0 7.951 1.2zm-1.08 11.018L4.79 13.544v-2.246l.003-.008a.8.8 0 0 0-.22-.614 4.62 4.62 0 0 1-1.288-3.21A4.669 4.669 0 0 1 7.952 2.8a4.669 4.669 0 0 1 4.666 4.666A4.669 4.669 0 0 1 7.402 12.1a.8.8 0 0 0-.53.119z'
							clipRule='evenodd'
						></path>
					</svg>
				</button>
				<button onClick={changeFullScreenStatus} className='svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
						<path
							fillRule='nonzero'
							d='M7 9a.8.8 0 01.07 1.05l-.07.09-3.05 3.04H5.9c.4 0 .74.3.8.7v.1c0 .4-.3.74-.7.8H2.28a1.1 1.1 0 01-1.09-.98v-3.73a.8.8 0 011.59-.1v2.12L5.87 9A.8.8 0 017 9zm3.08-7.8h3.62a1.1 1.1 0 011.1.98v3.74a.8.8 0 01-1.6.1V3.89l-3.08 3.08a.8.8 0 01-1.04.08L9 6.97a.8.8 0 010-1.13l3.04-3.04h-1.95a.8.8 0 01-.1-1.6h3.72z'
						></path>
					</svg>
				</button>
			</div>
			<img src={interlocutor?.avatarUrl} alt='' className='active-call__bg' />
			<video
				autoPlay
				playsInline
				ref={remoteVideoRef}
				className={`active-call__remote-video ${isFullScreenEnabled ? 'active-call__remote-video--big' : ''} `}
			></video>
			{isVideoOpened && (
				<video
					autoPlay
					playsInline
					ref={localVideoRef}
					className={`active-call__local-video ${
						isFullScreenEnabled ? 'active-call__local-video--big' : ''
					} `}
				></video>
			)}
			<audio autoPlay playsInline ref={remoteAudioRef} className='active-call__remote-audio'></audio>
			<div className={`active-call__select-group ${isFullScreenEnabled ? 'active-call__select-group--big' : ''}`}>
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
			</div>

			<div className='active-call__bottom-menu'>
				{isAudioOpened ? (
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeAudioStatus}
						className='active-call__call-btn active-call__call-btn--microphone active-call__call-btn--microphone--active'
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M11.8 3.96a3.8 3.8 0 0 0-7.6 0v3.11a3.8 3.8 0 1 0 7.6 0v-3.1zm-1.6 0v3.11a2.2 2.2 0 0 1-4.4 0v-3.1a2.2 2.2 0 1 1 4.4 0zm2.6 3.47a4.79 4.79 0 0 1-4.81 4.73 4.79 4.79 0 0 1-4.82-4.73.8.8 0 1 0-1.6 0 6.3 6.3 0 0 0 5.4 6.26v1.28a1 1 0 1 0 2 0v-1.28a6.38 6.38 0 0 0 5.42-6.26.8.8 0 0 0-1.6 0z'
								></path>
							</svg>
						</div>
					</button>
				) : (
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeAudioStatus}
						className='active-call__call-btn active-call__call-btn--microphone'
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M11.8 3.96a3.8 3.8 0 0 0-7.6 0v3.11a3.8 3.8 0 1 0 7.6 0v-3.1zm-1.6 0v3.11a2.2 2.2 0 0 1-4.4 0v-3.1a2.2 2.2 0 1 1 4.4 0zm2.6 3.47a4.79 4.79 0 0 1-4.81 4.73 4.79 4.79 0 0 1-4.82-4.73.8.8 0 1 0-1.6 0 6.3 6.3 0 0 0 5.4 6.26v1.28a1 1 0 1 0 2 0v-1.28a6.38 6.38 0 0 0 5.42-6.26.8.8 0 0 0-1.6 0z'
								></path>
							</svg>
						</div>
					</button>
				)}
				<button className='active-call__call-btn active-call__call-btn--cancel' onClick={cancelCall}>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path
								fillRule='evenodd'
								d='M.18 8.24C.13 6.02 3.09 3.8 7.98 3.8c4.9 0 7.84 2.18 7.8 4.44v.56l.01.53a1.8 1.8 0 01-1.8 1.83h-1.58a1.8 1.8 0 01-1.8-1.68l-.07-1.12-.15-.03c-.63-.14-1.31-.24-2-.27H8c-.97 0-1.9.14-2.68.35l.2-.05-.07 1.13a1.8 1.8 0 01-1.8 1.67H2A1.8 1.8 0 01.2 9.4L.18 8.24zm12.9-1.55c-1.07-.8-2.77-1.29-5.1-1.29-2.34 0-4.03.5-5.12 1.31-.72.54-1.09 1.19-1.08 1.5l.02 1.16c0 .1.09.2.2.2h1.64c.1 0 .2-.09.2-.2l.1-1.34c.03-.54.4-1 .94-1.16a12.14 12.14 0 016.3 0c.52.15.9.62.94 1.17l.09 1.34c0 .1.1.18.2.18h1.58a.2.2 0 00.14-.06.2.2 0 00.06-.13l-.02-.84V8.2c.01-.35-.36-.99-1.08-1.52z'
								clipRule='evenodd'
							></path>
						</svg>
					</div>
				</button>
				{isVideoOpened ? (
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeVideoStatus}
						className='active-call__call-btn active-call__call-btn--video active-call__call-btn--video--active'
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M11.32 5a2.3 2.3 0 0 0-2.3-2.3H5.5a5.31 5.31 0 1 0 0 10.62h3.52a2.3 2.3 0 0 0 2.3-2.3V9.73l.84.62 1.55 1.15a1.3 1.3 0 0 0 2.07-1.04V5.52a1.3 1.3 0 0 0-2.06-1.05L12.16 5.6l-.84.62V5zm-1.6 0v6.02a.7.7 0 0 1-.7.7H5.5a3.71 3.71 0 0 1 0-7.42h3.52a.7.7 0 0 1 .7.7zm4.46 4.86l-1.07-.8-1.48-1.09L13.1 6.9l1.08-.79v3.75z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>
					</button>
				) : (
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeVideoStatus}
						className='active-call__call-btn active-call__call-btn--video'
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M1.67 1.52A.9.9 0 00.49 2.88l11.67 11.54.1.08a.9.9 0 001.17-1.36l-1.99-1.97V9.73l2.4 1.77a1.3 1.3 0 002.07-1.04V5.52a1.3 1.3 0 00-2.07-1.05l-2.4 1.75V5a2.3 2.3 0 00-2.3-2.3H5.64c-.79 0-1.56.17-2.25.5L1.76 1.6l-.1-.08zm2.96 2.92L9.85 9.6V5a.7.7 0 00-.7-.7H5.63c-.34 0-.68.04-1 .14zM.32 8c0-.74.15-1.46.44-2.12l1.26 1.25a3.73 3.73 0 003.6 4.58h1.02l1.61 1.6H5.63a5.31 5.31 0 01-5.31-5.3zm13.99-1.9v3.75l-2.55-1.89 2.55-1.86z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>
					</button>
				)}
				{isScreenSharingOpened ? (
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeScreenShareStatus}
						className='active-call__call-btn active-call__call-btn--video active-call__call-btn--video--active'
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M3.001 1.193h10.014a2.8 2.8 0 012.8 2.8v7.016a2.8 2.8 0 01-2.8 2.8H3a2.8 2.8 0 01-2.8-2.8V3.993a2.8 2.8 0 012.8-2.8zm10.014 1.6H3a1.2 1.2 0 00-1.2 1.2v7.016a1.2 1.2 0 001.2 1.2h10.014a1.2 1.2 0 001.2-1.2V3.993a1.2 1.2 0 00-1.2-1.2zM7.46 4.03a.8.8 0 011.042-.078l.09.078 2.234 2.235a.8.8 0 01-1.041 1.208l-.09-.077-.889-.889-.004 3.819a.8.8 0 01-1.594.098l-.006-.1.004-3.777-.851.851a.8.8 0 01-1.042.078l-.09-.078a.8.8 0 01-.077-1.041l.077-.09L7.46 4.03z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>
					</button>
				) : (
					<button
						disabled={!isMediaSwitchingEnabled}
						onClick={changeScreenShareStatus}
						className='active-call__call-btn active-call__call-btn--video'
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M3.001 1.193h10.014a2.8 2.8 0 012.8 2.8v7.016a2.8 2.8 0 01-2.8 2.8H3a2.8 2.8 0 01-2.8-2.8V3.993a2.8 2.8 0 012.8-2.8zm10.014 1.6H3a1.2 1.2 0 00-1.2 1.2v7.016a1.2 1.2 0 001.2 1.2h10.014a1.2 1.2 0 001.2-1.2V3.993a1.2 1.2 0 00-1.2-1.2zM7.46 4.03a.8.8 0 011.042-.078l.09.078 2.234 2.235a.8.8 0 01-1.041 1.208l-.09-.077-.889-.889-.004 3.819a.8.8 0 01-1.594.098l-.006-.1.004-3.777-.851.851a.8.8 0 01-1.042.078l-.09-.078a.8.8 0 01-.077-1.041l.077-.09L7.46 4.03z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>
					</button>
				)}
			</div>
		</div>
	);
};

export default ActiveCall;
