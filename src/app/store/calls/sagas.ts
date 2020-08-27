import { CallActions } from './actions';
import { SagaIterator, eventChannel, buffers } from 'redux-saga';
import { call, select, takeLatest, put, take, spawn } from 'redux-saga/effects';
import { getMyProfileSelector } from '../my-profile/selectors';
import { UserPreview } from '../my-profile/models';
import { CallsHttpRequests } from './http-requests';
import { peerConnection, peerConfiguration } from '../middlewares/webRTC/peerConnection';
import { RootState } from '../root-reducer';
import { ICompleteConstraints } from './models';
import { doIhaveCall, getCallInterlocutorSelector } from './selectors';

let localMediaStream: MediaStream;
export const tracks: {
	[thingName: string]: MediaStreamTrack[];
} = { videoTracks: [], audioTracks: [], screenSharingTracks: [] };

let videoSender: RTCRtpSender | null, audioSender: RTCRtpSender | null, screenSharingSender: RTCRtpSender | null;

const getUserMedia = async (constraints: ICompleteConstraints) => {
	try {
		localMediaStream = await navigator.mediaDevices.getUserMedia({
			video: constraints.video.isOpened && constraints.video,
			audio: constraints.audio.deviceId ? constraints.audio : constraints.audio.isOpened,
		});
	} catch (e) {
		alert('No device found, sorry...');
		console.log(e);
		try {
			localMediaStream = await navigator.mediaDevices.getUserMedia({
				audio: constraints.audio.deviceId ? constraints.audio : constraints.audio.isOpened,
			});
		} catch {}
	}

	if (localMediaStream) {
		tracks.videoTracks = localMediaStream.getVideoTracks();
		tracks.audioTracks = localMediaStream.getAudioTracks();

		if (tracks.videoTracks.length > 0) {
			videoSender = peerConnection.connection.addTrack(tracks.videoTracks[0], localMediaStream);
		}
		if (tracks.audioTracks.length > 0) {
			audioSender = peerConnection.connection.addTrack(tracks.audioTracks[0], localMediaStream);
		}
	}
};

const getMediaDevicesList = async (kind: string) => {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const deviceList = devices.filter((device) => device.kind === kind);
	return deviceList;
};

export function* outgoingCallSaga(action: ReturnType<typeof CallActions.outgoingCallAction>): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	//setup local stream
	yield call(getUserMedia, { video: videoConstraints, audio: audioConstraints });
	//---

	//gathering data about media devices
	if (action.payload.constraints.audio) {
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'audioinput', devices: audioDevices }));
	}
	if (action.payload.constraints.video) {
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));
	}

	const interlocutorId = action.payload.calling.id;
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	let offer: RTCSessionDescriptionInit = yield call(
		async () =>
			await peerConnection.connection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
	);
	yield call(async () => await peerConnection.connection.setLocalDescription(offer));

	const request = {
		offer,
		interlocutorId,
		caller: myProfile,
	};

	const httpRequest = CallsHttpRequests.call;
	httpRequest.call(yield call(() => httpRequest.generator(request)));
}

export function* cancelCallSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

	const request = {
		interlocutorId,
	};

	const httpRequest = CallsHttpRequests.cancelCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	peerConnection.connection.close();
	peerConnection.connection = new RTCPeerConnection(peerConfiguration);
	yield spawn(peerWatcher);

	if (localMediaStream) {
		const tracks = localMediaStream.getTracks();
		tracks.forEach((track) => track.stop());
	}
	if (tracks.screenSharingTracks) {
		tracks.screenSharingTracks.forEach((track) => track.stop());
	}
	yield put(CallActions.cancelCallSuccessAction());
}

export function* callEndedSaga(): SagaIterator {
	peerConnection.connection.close();
	peerConnection.connection = new RTCPeerConnection(peerConfiguration);
	yield spawn(peerWatcher);

	if (localMediaStream) {
		localMediaStream.getTracks().forEach((track) => track.stop());
	}
	if (tracks.screenSharingTracks) {
		tracks.screenSharingTracks.forEach((track) => track.stop());
	}
}

export function* acceptCallSaga(action: ReturnType<typeof CallActions.acceptCallAction>): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	//setup local stream
	yield call(getUserMedia, { video: videoConstraints, audio: audioConstraints });
	//gathering data about media devices
	if (audioConstraints.isOpened) {
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'audioinput', devices: audioDevices }));
	}
	if (videoConstraints.isOpened) {
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));
	}
	//---

	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const offer: RTCSessionDescriptionInit = yield select((state: RootState) => state.calls.offer);

	peerConnection.connection.setRemoteDescription(new RTCSessionDescription(offer));
	const answer = yield call(async () => await peerConnection.connection.createAnswer());
	yield call(async () => await peerConnection.connection.setLocalDescription(answer));

	const request = {
		interlocutorId,
		answer,
	};

	const httpRequest = CallsHttpRequests.acceptCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	yield put(CallActions.acceptCallSuccessAction(action.payload));
}

export function* callAcceptedSaga(action: ReturnType<typeof CallActions.interlocutorAcceptedCallAction>): SagaIterator {
	const remoteDesc = new RTCSessionDescription(action.payload.answer);
	yield call(async () => await peerConnection.connection.setRemoteDescription(remoteDesc));
}

export function* candidateSaga(action: ReturnType<typeof CallActions.candidateAction>): SagaIterator {
	const checkIntervalCode = setInterval(async () => {
		if (peerConnection.connection.remoteDescription?.type) {
			try {
				await peerConnection.connection.addIceCandidate(new RTCIceCandidate(action.payload.candidate));
			} catch {}
			clearInterval(checkIntervalCode);
		}
	}, 100);
}

export function* changeAudioStatusSaga(): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	if (audioConstraints.isOpened) {
		if (tracks.audioTracks.length <= 0) {
			localMediaStream.getTracks().forEach((track) => track.stop());

			localMediaStream = yield call(
				async () =>
					await navigator.mediaDevices.getUserMedia({
						video: videoConstraints.isOpened && videoConstraints,
						audio: audioConstraints.deviceId ? audioConstraints : audioConstraints.isOpened,
					}),
			);

			tracks.videoTracks = localMediaStream.getVideoTracks();
			tracks.audioTracks = localMediaStream.getAudioTracks();

			if (videoConstraints.isOpened) {
				videoSender = peerConnection.connection.addTrack(tracks.videoTracks[0], localMediaStream);
			}
		}

		audioSender = peerConnection.connection.addTrack(tracks.audioTracks[0], localMediaStream);
	} else if (audioSender) {
		try {
			peerConnection.connection.removeTrack(audioSender);
		} catch (e) {
			console.warn(e);
		}

		audioSender = null;
	}
	yield put(CallActions.enableMediaSwitchingAction());
}

export function* changeVideoStatusSaga(): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	if (tracks.screenSharingTracks.length > 0) {
		tracks.screenSharingTracks.forEach((track) => track.stop());
		if (screenSharingSender) {
			try {
				peerConnection.connection.removeTrack(screenSharingSender);
			} catch (e) {
				console.warn(e);
			}
			screenSharingSender = null;
		}
	}

	if (videoConstraints.isOpened) {
		if (tracks.videoTracks.length <= 0) {
			localMediaStream.getTracks().forEach((track) => track.stop());

			try {
				localMediaStream = yield call(
					async () =>
						await navigator.mediaDevices.getUserMedia({
							video: videoConstraints.isOpened && videoConstraints,
							audio: audioConstraints.deviceId ? audioConstraints : audioConstraints.isOpened,
						}),
				);
			} catch (e) {
				console.log(e);
			}

			if (localMediaStream) {
				const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
				yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));

				tracks.videoTracks = localMediaStream.getVideoTracks();
				tracks.audioTracks = localMediaStream.getAudioTracks();

				if (audioConstraints.isOpened) {
					audioSender = peerConnection.connection.addTrack(tracks.audioTracks[0], localMediaStream);
				}
			}
		}
		if (tracks.videoTracks.length > 0) {
			videoSender = peerConnection.connection.addTrack(tracks.videoTracks[0], localMediaStream);
		}
	} else if (videoSender) {
		try {
			peerConnection.connection.removeTrack(videoSender);
		} catch (e) {
			console.warn(e);
		}
		videoSender = null;
	}
	yield put(CallActions.enableMediaSwitchingAction());
}

export function* changeScreenSharingStatus(): SagaIterator {
	const screenSharingState = yield select((state: RootState) => state.calls.isScreenSharingOpened);

	if (videoSender) {
		try {
			peerConnection.connection.removeTrack(videoSender);
		} catch (e) {
			console.warn(e);
		}
		videoSender = null;
	}

	if (screenSharingState) {
		try {
			//@ts-ignore
			const localVideoStream = yield call(async () => await navigator.mediaDevices.getDisplayMedia());
			tracks.screenSharingTracks = localVideoStream.getTracks();

			screenSharingSender = peerConnection.connection.addTrack(tracks.screenSharingTracks[0], localMediaStream);

			yield put(CallActions.enableMediaSwitchingAction());
		} catch (e) {
			console.log(e);
		}
	} else if (tracks.screenSharingTracks.length > 0) {
		tracks.screenSharingTracks.forEach((track) => track.stop());
		if (screenSharingSender) {
			try {
				peerConnection.connection.removeTrack(screenSharingSender);
			} catch (e) {
				console.warn(e);
			}
			screenSharingSender = null;
		}
		yield put(CallActions.enableMediaSwitchingAction());
	}
}

export function* negociationSaga(action: ReturnType<typeof CallActions.incomingCallAction>): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const isCallActive: boolean = yield select(doIhaveCall);

	if (isCallActive && interlocutorId === action.payload.caller.id) {
		peerConnection.connection.setRemoteDescription(new RTCSessionDescription(action.payload.offer));
		const answer = yield call(async () => await peerConnection.connection.createAnswer());
		yield call(async () => await peerConnection.connection.setLocalDescription(answer));

		const request = {
			interlocutorId,
			answer,
		};

		const httpRequest = CallsHttpRequests.acceptCall;
		httpRequest.call(yield call(() => httpRequest.generator(request)));
	}
}

export function* switchDeviceSaga(action: ReturnType<typeof CallActions.switchDeviceAction>): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	if (action.payload.kind === 'videoinput') {
		if (videoConstraints.isOpened) {
			localMediaStream.getTracks().forEach((track) => track.stop());

			try {
				localMediaStream = yield call(
					async () =>
						await navigator.mediaDevices.getUserMedia({
							video: videoConstraints.isOpened && videoConstraints,
							audio: audioConstraints.deviceId ? audioConstraints : audioConstraints.isOpened,
						}),
				);
			} catch (e) {
				console.log(e);
			}

			if (localMediaStream) {
				tracks.videoTracks = localMediaStream.getVideoTracks();
				tracks.audioTracks = localMediaStream.getAudioTracks();
			}

			if (audioConstraints.isOpened && tracks.audioTracks.length >= 0) {
				audioSender = peerConnection.connection.addTrack(tracks.audioTracks[0], localMediaStream);
			}

			if (tracks.videoTracks.length > 0) {
				videoSender = peerConnection.connection.addTrack(tracks.videoTracks[0], localMediaStream);
			}

			yield put(CallActions.enableMediaSwitchingAction());
		}
	}

	if (action.payload.kind === 'audioinput') {
		if (audioConstraints.isOpened) {
			localMediaStream.getTracks().forEach((track) => track.stop());

			try {
				localMediaStream = yield call(
					async () =>
						await navigator.mediaDevices.getUserMedia({
							video: videoConstraints.isOpened && videoConstraints,
							audio: audioConstraints.deviceId ? audioConstraints : audioConstraints.isOpened,
						}),
				);
			} catch (e) {
				console.log(e);
			}

			if (localMediaStream) {
				tracks.videoTracks = localMediaStream.getVideoTracks();
				tracks.audioTracks = localMediaStream.getAudioTracks();
			}

			if (audioConstraints.isOpened && tracks.audioTracks.length >= 0) {
				audioSender = peerConnection.connection.addTrack(tracks.audioTracks[0], localMediaStream);
			}
			if (tracks.videoTracks.length > 0) {
				videoSender = peerConnection.connection.addTrack(tracks.videoTracks[0], localMediaStream);
			}
		}
	}
}

function createPeerConnectionChannel() {
	return eventChannel((emit) => {
		const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
			console.log('icecandidate');
			emit({ type: 'icecandidate', event });
		};

		const onNegotiationNeeded = () => {
			emit({ type: 'negotiationneeded' });
		};

		const onConnectionStateChange = () => {
			if (peerConnection.connection.connectionState === 'connected') {
				console.log('peers connected');
			}
		};

		peerConnection.connection.addEventListener('icecandidate', onIceCandidate);
		peerConnection.connection.addEventListener('negotiationneeded', onNegotiationNeeded);
		peerConnection.connection.addEventListener('connectionstatechange', onConnectionStateChange);

		return () => {
			peerConnection.connection.removeEventListener('icecandidate', onIceCandidate);
			peerConnection.connection.removeEventListener('negotiationneeded', onNegotiationNeeded);
			peerConnection.connection.removeEventListener('connectionstatechange', onConnectionStateChange);
		};
	}, buffers.expanding(100));
}

export function* peerWatcher() {
	const channel = createPeerConnectionChannel();
	while (true) {
		const action = yield take(channel);

		console.log(action.type);

		switch (action.type) {
			case 'icecandidate':
				{
					const interlocutor = yield select(getCallInterlocutorSelector);

					if (action.event.candidate) {
						const request = {
							interlocutorId: interlocutor?.id || -1,
							candidate: action.event.candidate,
						};
						const httpRequest = CallsHttpRequests.candidate;
						httpRequest.call(yield call(() => httpRequest.generator(request)));
					}
				}
				break;
			case 'negotiationneeded': {
				const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
				const myProfile: UserPreview = yield select(getMyProfileSelector);
				const isCallActive: boolean = yield select(doIhaveCall);
				if (isCallActive) {
					let offer: RTCSessionDescriptionInit;
					offer = yield call(
						async () =>
							await peerConnection.connection.createOffer({
								offerToReceiveAudio: true,
								offerToReceiveVideo: true,
							}),
					);
					yield call(async () => await peerConnection.connection.setLocalDescription(offer));

					const request = {
						offer,
						interlocutorId,
						caller: myProfile,
					};

					const httpRequest = CallsHttpRequests.call;
					httpRequest.call(yield call(() => httpRequest.generator(request)));
				}
			}
		}
	}
}

export const CallsSagas = [
	takeLatest(CallActions.outgoingCallAction, outgoingCallSaga),
	takeLatest(CallActions.cancelCallAction, cancelCallSaga),
	takeLatest(CallActions.acceptCallAction, acceptCallSaga),
	takeLatest(CallActions.interlocutorAcceptedCallAction, callAcceptedSaga),
	takeLatest(CallActions.candidateAction, candidateSaga),
	takeLatest(CallActions.interlocutorCanceledCallAction, callEndedSaga),
	takeLatest(CallActions.changeAudioStatusAction, changeAudioStatusSaga),
	takeLatest(CallActions.changeVideoStatusAction, changeVideoStatusSaga),
	takeLatest(CallActions.changeScreenShareStatusAction, changeScreenSharingStatus),
	takeLatest(CallActions.switchDeviceAction, switchDeviceSaga),
	takeLatest(CallActions.incomingCallAction, negociationSaga),
];
