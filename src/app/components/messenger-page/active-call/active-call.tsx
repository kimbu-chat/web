import React, { useRef, useCallback, useEffect } from 'react';
import './active-call.scss';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnection';
import { useSelector } from 'react-redux';
import { getCallInterlocutorSelector } from 'app/store/calls/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';
import { RootState } from 'app/store/root-reducer';

namespace IActiveCall {
	export interface Props {
		isDisplayed: boolean;
	}
}

const ActiveCall = ({ isDisplayed }: IActiveCall.Props) => {
	const cancelCall = useActionWithDispatch(CallActions.cancelCallAction);

	const interlocutor = useSelector(getCallInterlocutorSelector);
	const isVideoOpened = useSelector((state: RootState) => state.calls.isVideoOpened);
	const isAudioOpened = useSelector((state: RootState) => state.calls.isAudioOpened);
	const isMediaSwitchingEnabled = useSelector((state: RootState) => state.calls.isMediaSwitchingEnabled);

	const sendCandidates = useActionWithDispatch(CallActions.myCandidateAction);
	const changeVideoStatus = useActionWithDispatch(CallActions.changeVideoStatus);
	const changeAudioStatus = useActionWithDispatch(CallActions.changeAudioStatus);
	const negociate = useActionWithDispatch(CallActions.negociate);

	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const remoteAudioRef = useRef<HTMLAudioElement>(null);

	//peer connection callbacks
	const onIceCandidate = useCallback(
		(event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
				const request = {
					interlocutorId: interlocutor?.id || -1,
					candidate: event.candidate,
				};
				sendCandidates(request);
			}
		},
		[interlocutor, sendCandidates, peerConnection.connection],
	);

	const onTrack = useCallback(
		(event: RTCTrackEvent) => {
			console.log('Track received', event.track);

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
		[remoteVideoRef, remoteAudioRef, peerConnection.connection],
	);

	const onConnectionStateChange = useCallback(() => {
		if (peerConnection.connection.connectionState === 'connected') {
			console.log('peers connected');
		}
	}, [peerConnection.connection]);

	//binding peer connection events
	useEffect(() => {
		peerConnection.connection.addEventListener('icecandidate', onIceCandidate);

		peerConnection.connection.addEventListener('connectionstatechange', onConnectionStateChange);

		peerConnection.connection.addEventListener('track', onTrack);

		peerConnection.connection.addEventListener('negotiationneeded', negociate);
		//removing peer connection events
		return () => {
			peerConnection.connection.removeEventListener('icecandidate', onIceCandidate);

			peerConnection.connection.removeEventListener('connectionstatechange', onConnectionStateChange);

			peerConnection.connection.removeEventListener('track', onTrack);

			peerConnection.connection.removeEventListener('negotiationneeded', negociate);
		};
	});

	return (
		<div className={isDisplayed ? 'active-call' : 'completly-hidden'}>
			<img src={interlocutor?.avatarUrl} alt='' className='active-call__bg' />
			<video autoPlay playsInline ref={remoteVideoRef} className='active-call__remote-video'></video>
			<audio autoPlay playsInline ref={remoteAudioRef} className='active-call__remote-audio'></audio>
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
			</div>
		</div>
	);
};

export default ActiveCall;
