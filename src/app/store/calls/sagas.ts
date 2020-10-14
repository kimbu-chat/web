import { CallActions } from './actions';
import { SagaIterator, eventChannel, buffers, END } from 'redux-saga';
import { call, select, takeLatest, put, take, spawn, delay, race, takeEvery } from 'redux-saga/effects';
import { getMyProfileSelector } from '../my-profile/selectors';
import { UserPreview } from '../my-profile/models';
import { CallsHttpRequests } from './http-requests';
import { peerConnection, createPeerConnection, resetPeerConnection } from '../middlewares/webRTC/peerConnectionFactory';
import { RootState } from '../root-reducer';
import { ICompleteConstraints } from './models';
import { doIhaveCall, getCallInterlocutorSelector } from './selectors';

let localMediaStream: MediaStream;
export const tracks: {
	[thingName: string]: MediaStreamTrack[];
} = { videoTracks: [], audioTracks: [], screenSharingTracks: [] };

let videoSender: RTCRtpSender | null, audioSender: RTCRtpSender | null;

const assignStreams = (stream: MediaStream) => {
	tracks.videoTracks.push(...stream.getVideoTracks());
	tracks.audioTracks.push(...stream.getAudioTracks());
};

const stopTracks = () => {
	tracks.videoTracks.forEach((track) => {
		track.stop();
	});
	tracks.audioTracks.forEach((track) => {
		track.stop();
	});
	tracks.screenSharingTracks.forEach((track) => {
		track.stop();
	});

	tracks.videoTracks = [];
	tracks.audioTracks = [];
	tracks.screenSharingTracks = [];
};

const getUserMedia = async (constraints: ICompleteConstraints) => {
	stopTracks();

	try {
		localMediaStream = await navigator.mediaDevices.getUserMedia({
			video: constraints.video.isOpened && constraints.video,
			audio: constraints.audio.deviceId ? constraints.audio : constraints.audio.isOpened,
		});
	} catch {
		try {
			localMediaStream = await navigator.mediaDevices.getUserMedia({
				audio: constraints.audio.deviceId ? constraints.audio : constraints.audio.isOpened,
			});
			console.log('reach');
			throw 'NO_VIDEO';
		} catch (e) {
			if (e === 'NO_VIDEO') throw e;
			throw 'NO_AUDIO';
		}
	}

	if (localMediaStream) {
		assignStreams(localMediaStream);

		if (tracks.videoTracks.length > 0) {
			videoSender = peerConnection?.addTrack(tracks.videoTracks[0], localMediaStream) as RTCRtpSender;
		}
		if (tracks.audioTracks.length > 0) {
			audioSender = peerConnection?.addTrack(tracks.audioTracks[0], localMediaStream) as RTCRtpSender;
		}
	}
};

const getMediaDevicesList = async (kind: string) => {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const deviceList = devices.filter((device) => device.kind === kind);
	return deviceList;
};

//!USED
export function* outgoingCallSaga(action: ReturnType<typeof CallActions.outgoingCallAction>): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	createPeerConnection();
	yield spawn(peerWatcher);
	yield spawn(deviceUpdateWatcher);

	//setup local stream
	try {
		yield call(getUserMedia, { video: videoConstraints, audio: audioConstraints });
	} catch (e) {
		if (e === 'NO_AUDIO') {
			yield put(CallActions.closeAudioStatusAction());
			yield put(CallActions.closeVideoStatusAction());
		}

		if (e === 'NO_VIDEO') {
			yield put(CallActions.closeVideoStatusAction());
		}
	}
	//---

	//gathering data about media devices
	if (action.payload.constraints.audio.isOpened) {
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'audioinput', devices: audioDevices }));
		yield put(CallActions.changeActiveDeviceIdAction({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
	}
	if (action.payload.constraints.video.isOpened) {
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));
		yield put(CallActions.changeActiveDeviceIdAction({ kind: 'videoinput', deviceId: videoDevices[0].deviceId }));
	}

	const interlocutorId = action.payload.calling.id;
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	let offer: RTCSessionDescriptionInit = yield call(
		async () => await peerConnection?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
	);
	yield call(async () => await peerConnection?.setLocalDescription(offer));

	const request = {
		offer,
		interlocutorId,
		caller: myProfile,
		isVideoEnabled: action.payload.constraints.video.isOpened,
	};

	const httpRequest = CallsHttpRequests.call;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	const { timeout } = yield race({
		canceled: take(CallActions.cancelCallAction),
		interlocutorCanceled: take(CallActions.interlocutorCanceledCallAction),
		answered: take(CallActions.interlocutorAcceptedCallAction),
		timeout: delay(15000),
	});

	if (timeout) {
		yield put(CallActions.timeoutCallAction());
	}
}

export function* cancelCallSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

	const request = {
		interlocutorId,
	};

	const httpRequest = CallsHttpRequests.cancelCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	if (videoSender) {
		try {
			peerConnection?.removeTrack(videoSender);
		} catch (e) {
			console.warn(e);
		}
		videoSender = null;
	}

	peerConnection?.close();
	resetPeerConnection();

	stopTracks();

	yield put(CallActions.cancelCallSuccessAction());
}

export function* callNotAnsweredSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

	const request = {
		interlocutorId,
	};

	const httpRequest = CallsHttpRequests.callNotAnswered;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	if (videoSender) {
		try {
			peerConnection?.removeTrack(videoSender);
		} catch (e) {
			console.warn(e);
		}
		videoSender = null;
	}

	peerConnection?.close();
	resetPeerConnection();

	stopTracks();

	yield put(CallActions.cancelCallSuccessAction());
}

export function* declineCallSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

	const request = {
		interlocutorId,
	};

	const httpRequest = CallsHttpRequests.declineCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	peerConnection?.close();
	resetPeerConnection();

	stopTracks();
	yield put(CallActions.cancelCallSuccessAction());
}

export function* endCallSaga(action: ReturnType<typeof CallActions.endCallAction>): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	const myId = myProfile.id;
	const isActiveCallIncoming: boolean = yield select((state: RootState) => state.calls.isActiveCallIncoming);

	const request = {
		callerId: isActiveCallIncoming ? interlocutorId : myId,
		calleeId: isActiveCallIncoming ? myId : interlocutorId,
		seconds: action.payload.seconds,
	};

	const httpRequest = CallsHttpRequests.endCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	if (videoSender) {
		try {
			peerConnection?.removeTrack(videoSender);
		} catch (e) {
			console.warn(e);
		}
		videoSender = null;
	}

	peerConnection?.close();
	resetPeerConnection();

	stopTracks();

	yield put(CallActions.cancelCallSuccessAction());
}

export function* callEndedSaga(): SagaIterator {
	peerConnection?.close();
	resetPeerConnection();

	stopTracks();

	if (videoSender) {
		try {
			peerConnection?.removeTrack(videoSender);
		} catch (e) {
			console.warn(e);
		}
		videoSender = null;
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

	peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
	const answer = yield call(async () => await peerConnection?.createAnswer());
	yield call(async () => await peerConnection?.setLocalDescription(answer));

	const request = {
		interlocutorId,
		answer,
		isVideoEnabled: videoConstraints.isOpened,
	};

	const httpRequest = CallsHttpRequests.acceptCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	yield put(CallActions.acceptCallSuccessAction(action.payload));
}

export function* callAcceptedSaga(action: ReturnType<typeof CallActions.interlocutorAcceptedCallAction>): SagaIterator {
	const remoteDesc = new RTCSessionDescription(action.payload.answer);
	yield call(async () => await peerConnection?.setRemoteDescription(remoteDesc));
}

export function* candidateSaga(action: ReturnType<typeof CallActions.candidateAction>): SagaIterator {
	const checkIntervalCode = setInterval(async () => {
		if (peerConnection?.remoteDescription?.type) {
			try {
				await peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate));
			} catch {}
			clearInterval(checkIntervalCode);
		}
	}, 100);
}

export function* changeMediaStatusSaga(action: ReturnType<typeof CallActions.changeMediaStatusAction>): SagaIterator {
	const handleVideoStatusChange = async ({ videoConstraints, audioConstraints }: any) => {
		console.log(audioConstraints);
		if (videoConstraints.isOpened) {
			if (audioConstraints.isOpened || videoConstraints.isOpened) {
				localMediaStream = await navigator.mediaDevices.getUserMedia({
					video: videoConstraints.isOpened && videoConstraints,
					audio: audioConstraints.isOpened && audioConstraints,
				});
			}

			stopTracks();

			if (localMediaStream) {
				assignStreams(localMediaStream);

				if (tracks.audioTracks.length > 0) {
					audioSender?.replaceTrack(tracks.audioTracks[0]);
				}

				if (videoSender) {
					videoSender?.replaceTrack(tracks.videoTracks[0]);
				} else {
					videoSender = peerConnection?.addTrack(tracks.videoTracks[0], localMediaStream) as RTCRtpSender;
				}
			}
		} else if (tracks.videoTracks.length > 0) {
			tracks.videoTracks.forEach((track) => track.stop());
			tracks.videoTracks = [];
			if (videoSender) {
				try {
					peerConnection?.removeTrack(videoSender);
				} catch (e) {
					console.warn(e);
				}
				videoSender = null;
			}
		}
	};

	const handleAudioStatusChange = async ({ videoConstraints, audioConstraints }: any) => {
		if (audioConstraints.isOpened) {
			try {
				if (audioConstraints.isOpened || videoConstraints.isOpened) {
					localMediaStream = await navigator.mediaDevices.getUserMedia({
						video: videoConstraints.isOpened && videoConstraints,
						audio: audioConstraints.isOpened && audioConstraints,
					});
				}
			} catch (e) {
				console.log(e);
			}

			stopTracks();
			if (localMediaStream) {
				assignStreams(localMediaStream);
			}

			if (tracks.audioTracks.length >= 0) {
				audioSender?.replaceTrack(tracks.audioTracks[0]);
			}
			if (tracks.videoTracks.length > 0) {
				videoSender?.replaceTrack(tracks.videoTracks[0]);
			}
		} else {
			tracks.audioTracks.forEach((track) => track.stop());
			tracks.audioTracks = [];
			audioSender?.replaceTrack(null);
		}
	};

	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);
	// 3- Note that we're using a blocking call
	if (action.payload.kind === 'videoinput') {
		yield call(handleVideoStatusChange, { videoConstraints, audioConstraints });
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));
	}
	if (action.payload.kind === 'audioinput') {
		yield call(handleAudioStatusChange, { videoConstraints, audioConstraints });
	}
}

export function* changeScreenSharingStatus(): SagaIterator {
	const screenSharingState = yield select((state: RootState) => state.calls.isScreenSharingOpened);

	if (screenSharingState) {
		try {
			//@ts-ignore
			const localVideoStream = yield call(async () => await navigator.mediaDevices.getDisplayMedia());
			tracks.screenSharingTracks = localVideoStream.getTracks();

			if (videoSender) {
				videoSender?.replaceTrack(tracks.screenSharingTracks[0]);
			} else {
				videoSender = peerConnection?.addTrack(tracks.screenSharingTracks[0]) as RTCRtpSender;
			}
		} catch (e) {
			console.log(e);
		}

		tracks.videoTracks.forEach((track) => track.stop());
		tracks.videoTracks = [];

		yield spawn(trackEndedWatcher);
	} else if (tracks.screenSharingTracks.length > 0) {
		tracks.screenSharingTracks.forEach((track) => track.stop());
		tracks.screenSharingTracks = [];

		if (videoSender) {
			try {
				peerConnection?.removeTrack(videoSender);
			} catch (e) {
				console.warn(e);
			}
			videoSender = null;
		}
	}
}

export function* trackEndedWatcher() {
	const channel = createTrackEndedChannel();
	console.log('spawned');
	while (true) {
		const action = yield take(channel);
		if (action === true) {
			tracks.screenSharingTracks.forEach((track) => track.stop());
			tracks.screenSharingTracks = [];

			if (videoSender) {
				try {
					peerConnection?.removeTrack(videoSender);
				} catch (e) {
					console.warn(e);
				}
				videoSender = null;
			}

			yield put(CallActions.closeScreenShareStatusAction());
		}
	}
}

function createTrackEndedChannel() {
	return eventChannel((emit) => {
		console.log(tracks.screenSharingTracks);
		const onEnd = () => {
			emit(true);
			emit(END);
			console.log('onEnd');
		};
		tracks.screenSharingTracks[0].addEventListener('ended', onEnd);

		const clearIntervalCode = setInterval(() => {
			if (!tracks.screenSharingTracks[0]) {
				clearInterval(clearIntervalCode);
				console.log('clearIntervalCode');
				emit(END);
			}
		}, 1000);

		return () => {
			if (tracks.screenSharingTracks[0]) {
				tracks.screenSharingTracks[0].removeEventListener('ended', onEnd);
			}
		};
	}, buffers.expanding(100));
}

export function* negociationSaga(action: ReturnType<typeof CallActions.incomingCallAction>): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const isCallActive: boolean = yield select(doIhaveCall);
	const isScreenSharingEnabled = yield select((state: RootState) => state.calls.isScreenSharingOpened);

	if (isCallActive && interlocutorId === action.payload.caller.id) {
		peerConnection?.setRemoteDescription(new RTCSessionDescription(action.payload.offer));
		const answer = yield call(async () => await peerConnection?.createAnswer());
		yield call(async () => await peerConnection?.setLocalDescription(answer));

		const request = {
			interlocutorId,
			answer,
			isVideoEnabled: videoConstraints.isOpened || isScreenSharingEnabled,
		};

		const httpRequest = CallsHttpRequests.acceptCall;
		httpRequest.call(yield call(() => httpRequest.generator(request)));
	} else {
		createPeerConnection();
		yield spawn(peerWatcher);
		yield spawn(deviceUpdateWatcher);
	}
}

export function* switchDeviceSaga(action: ReturnType<typeof CallActions.switchDeviceAction>): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	if (
		(action.payload.kind === 'audioinput' && audioConstraints.isOpened) ||
		(action.payload.kind === 'videoinput' && videoConstraints.isOpened)
	) {
		try {
			localMediaStream = yield call(
				async () =>
					await navigator.mediaDevices.getUserMedia({
						video: videoConstraints.isOpened && videoConstraints,
						audio: audioConstraints.isOpened && audioConstraints,
					}),
			);
		} catch (e) {
			console.log(e);
		}

		stopTracks();
		if (localMediaStream) {
			assignStreams(localMediaStream);
		}

		if (tracks.audioTracks.length >= 0) {
			audioSender?.replaceTrack(tracks.audioTracks[0]);
		}
		if (tracks.videoTracks.length > 0) {
			videoSender?.replaceTrack(tracks.videoTracks[0]);
		}
	}
}

function createPeerConnectionChannel() {
	return eventChannel((emit) => {
		const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
			emit({ type: 'icecandidate', event });
		};

		const onNegotiationNeeded = () => {
			emit({ type: 'negotiationneeded' });
		};

		const onConnectionStateChange = () => {
			if (peerConnection?.connectionState === 'connected') {
			}
		};

		//!TO CHECK
		const clearIntervalCode = setInterval(() => {
			const state = peerConnection?.connectionState;
			if (!state || state === 'closed' || state === 'disconnected') {
				clearInterval(clearIntervalCode);
				emit(END);
			}
		}, 1000);

		peerConnection?.addEventListener('icecandidate', onIceCandidate);
		peerConnection?.addEventListener('negotiationneeded', onNegotiationNeeded);
		peerConnection?.addEventListener('connectionstatechange', onConnectionStateChange);

		return () => {
			peerConnection?.removeEventListener('icecandidate', onIceCandidate);
			peerConnection?.removeEventListener('negotiationneeded', onNegotiationNeeded);
			peerConnection?.removeEventListener('connectionstatechange', onConnectionStateChange);
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
				const isVideoEnabled = yield select((state: RootState) => state.calls.videoConstraints.isOpened);
				const isScreenSharingEnabled = yield select((state: RootState) => state.calls.isScreenSharingOpened);

				if (isCallActive) {
					let offer: RTCSessionDescriptionInit;
					offer = yield call(
						async () =>
							await peerConnection?.createOffer({
								offerToReceiveAudio: true,
								offerToReceiveVideo: true,
							}),
					);
					yield call(async () => await peerConnection?.setLocalDescription(offer));

					const request = {
						offer,
						interlocutorId,
						caller: myProfile,
						isVideoEnabled: isVideoEnabled || isScreenSharingEnabled,
					};

					const httpRequest = CallsHttpRequests.call;
					httpRequest.call(yield call(() => httpRequest.generator(request)));
				}
			}
		}
	}
}

export function* deviceUpdateWatcher() {
	const channel = deviceUpdateChannel();
	while (true) {
		const prevAudioDevices = yield select((state: RootState) => state.calls.audioDevicesList);
		const action = yield take(channel);
		console.log(action);
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');

		if (prevAudioDevices.length === 0) {
			yield put(CallActions.switchDeviceAction({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
			yield put(CallActions.changeMediaStatusAction({ kind: 'audioinput' }));
		}

		yield put(CallActions.gotDevicesInfoAction({ kind: 'audioinput', devices: audioDevices }));
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));
	}
}

function deviceUpdateChannel() {
	return eventChannel((emit) => {
		const onDeviceChange = (event: Event) => {
			emit(event);
		};

		//!TO CHECK
		const clearIntervalCode = setInterval(() => {
			const state = peerConnection?.connectionState;
			if (!state || state === 'closed' || state === 'disconnected') {
				clearInterval(clearIntervalCode);
				emit(END);
			}
		}, 1000);

		navigator.mediaDevices.addEventListener('devicechange', onDeviceChange);

		return () => {
			navigator.mediaDevices.removeEventListener('devicechange', onDeviceChange);
		};
	}, buffers.expanding(10));
}

export const CallsSagas = [
	takeLatest(CallActions.outgoingCallAction, outgoingCallSaga),
	takeLatest(CallActions.cancelCallAction, cancelCallSaga),
	takeLatest(CallActions.endCallAction, endCallSaga),
	takeLatest(CallActions.declineCallAction, declineCallSaga),
	takeLatest(CallActions.timeoutCallAction, callNotAnsweredSaga),
	takeLatest(CallActions.acceptCallAction, acceptCallSaga),
	takeLatest(CallActions.interlocutorAcceptedCallAction, callAcceptedSaga),
	takeEvery(CallActions.candidateAction, candidateSaga),
	takeLatest(CallActions.interlocutorCanceledCallAction, callEndedSaga),
	takeLatest(CallActions.callEndedAction, callEndedSaga),
	takeLatest(CallActions.changeScreenShareStatusAction, changeScreenSharingStatus),
	takeLatest(CallActions.switchDeviceAction, switchDeviceSaga),
	takeLatest(CallActions.incomingCallAction, negociationSaga),
	takeEvery(CallActions.changeMediaStatusAction, changeMediaStatusSaga),
];
