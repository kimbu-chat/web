import { CallActions } from './actions';
import { SagaIterator, eventChannel, buffers, END } from 'redux-saga';
import { call, select, takeLatest, put, take, spawn, delay, race, takeEvery } from 'redux-saga/effects';
import { getMyProfileSelector } from '../my-profile/selectors';
import { UserPreview } from '../my-profile/models';
import { CallsHttpRequests } from './http-requests';
import { peerConnection, createPeerConnection, resetPeerConnection } from '../middlewares/webRTC/peerConnectionFactory';
import { RootState } from '../root-reducer';
import { ICompleteConstraints, IInCompleteConstraints } from './models';
import { doIhaveCall, getCallInterlocutorSelector } from './selectors';

export const tracks: {
	[thingName: string]: MediaStreamTrack[];
} = { videoTracks: [], audioTracks: [], screenSharingTracks: [] };

let videoSender: RTCRtpSender | null, audioSender: RTCRtpSender | null;

const assignAudioStreams = (stream: MediaStream) => {
	tracks.audioTracks.push(...stream.getAudioTracks());
};

const assignVideoStreams = (stream: MediaStream) => {
	tracks.videoTracks.push(...stream.getVideoTracks());
};

const assignScreenSharingTracks = (stream: MediaStream) => {
	tracks.screenSharingTracks.push(...stream.getTracks());
};

const assignStreams = (stream: MediaStream) => {
	tracks.videoTracks.push(...stream.getVideoTracks());
	tracks.audioTracks.push(...stream.getAudioTracks());
};

const stopAudioTracks = () => {
	tracks.audioTracks.forEach((track) => {
		track.stop();
	});
	tracks.audioTracks = [];
};

const stopVideoTracks = () => {
	tracks.videoTracks.forEach((track) => {
		track.stop();
	});
	tracks.videoTracks = [];
};

const stopScreenSharingTracks = () => {
	tracks.screenSharingTracks.forEach((track) => {
		track.stop();
	});
	tracks.screenSharingTracks = [];
};

const stopAllTracks = () => {
	stopAudioTracks();
	stopVideoTracks();
	stopScreenSharingTracks();
};

const getUserAudio = async (constraints: IInCompleteConstraints) => {
	let localMediaStream: MediaStream;
	try {
		localMediaStream = await navigator.mediaDevices.getUserMedia({
			audio: constraints.audio?.isOpened && constraints.audio,
		});
	} catch (e) {
		console.log(e);
		console.log(constraints.audio);
		throw 'NO_AUDIO';
	}

	stopAudioTracks();

	if (localMediaStream) {
		assignAudioStreams(localMediaStream);
	}
};

const getUserVideo = async (constraints: IInCompleteConstraints) => {
	let localMediaStream: MediaStream;
	try {
		localMediaStream = await navigator.mediaDevices.getUserMedia({
			video: constraints.video?.isOpened && constraints.video,
		});
	} catch {
		throw 'NO_VIDEO';
	}

	stopVideoTracks();

	if (localMediaStream) {
		assignVideoStreams(localMediaStream);
	}
};

const getUserDisplay = async () => {
	let localDisplayStream: MediaStream;
	try {
		//@ts-ignore
		localDisplayStream = await navigator.mediaDevices.getDisplayMedia();
	} catch {
		throw 'NO_DISPLAY';
	}

	stopScreenSharingTracks();

	if (localDisplayStream) {
		assignScreenSharingTracks(localDisplayStream);
	}
};

const getAndSendUserMedia = async (constraints: ICompleteConstraints) => {
	let localMediaStream: MediaStream;
	try {
		localMediaStream = await navigator.mediaDevices.getUserMedia({
			video: constraints.video.isOpened && constraints.video,
			audio: constraints.audio.isOpened && constraints.audio,
		});
	} catch {
		try {
			localMediaStream = await navigator.mediaDevices.getUserMedia({
				audio: constraints.audio.isOpened && constraints.audio,
			});
			console.log('reach');
			throw 'NO_VIDEO';
		} catch (e) {
			if (e === 'NO_VIDEO') throw e;
			throw 'NO_AUDIO';
		}
	}
	stopAllTracks();

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
	const amISpeaking = yield select((state: RootState) => state.calls.isSpeaking);
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);
	let isVideoError = false;

	if (amISpeaking) {
		//Prevention of 'double-call'
		return;
	}

	createPeerConnection();
	yield spawn(peerWatcher);
	yield spawn(deviceUpdateWatcher);

	//setup local stream
	try {
		yield call(getAndSendUserMedia, { video: videoConstraints, audio: audioConstraints });
	} catch (e) {
		if (e === 'NO_AUDIO') {
			yield put(CallActions.closeAudioStatusAction());
			yield put(CallActions.closeVideoStatusAction());
		}

		if (e === 'NO_VIDEO') {
			yield put(CallActions.closeVideoStatusAction());
			isVideoError = true;
		}
	}
	//---

	const audioOpened = yield select((state: RootState) => state.calls.audioConstraints.isOpened);
	const videoOpened = yield select((state: RootState) => state.calls.videoConstraints.isOpened);

	//gathering data about media devices
	if (audioOpened) {
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'audioinput', devices: audioDevices }));
		yield put(CallActions.changeActiveDeviceIdAction({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
	}
	if (videoOpened) {
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
		isVideoEnabled: action.payload.constraints.video.isOpened && !isVideoError,
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

	stopAllTracks();

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

	stopAllTracks();
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

	stopAllTracks();

	yield put(CallActions.cancelCallSuccessAction());
}

export function* callEndedSaga(): SagaIterator {
	peerConnection?.close();
	resetPeerConnection();

	stopAllTracks();

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
	let isVideoError = false;

	createPeerConnection();
	yield spawn(peerWatcher);
	yield spawn(deviceUpdateWatcher);

	//setup local stream
	try {
		yield call(getAndSendUserMedia, { video: videoConstraints, audio: audioConstraints });
	} catch (e) {
		if (e === 'NO_AUDIO') {
			yield put(CallActions.closeAudioStatusAction());
		}

		if (e === 'NO_VIDEO') {
			yield put(CallActions.closeVideoStatusAction());
			isVideoError = true;
		}
	}
	//gathering data about media devices
	if (audioConstraints.isOpened) {
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'audioinput', devices: audioDevices }));
		yield put(CallActions.changeActiveDeviceIdAction({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
	}
	if (videoConstraints.isOpened) {
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));

		if (videoDevices[0]) {
			yield put(
				CallActions.changeActiveDeviceIdAction({ kind: 'videoinput', deviceId: videoDevices[0].deviceId }),
			);
		}
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
		isVideoEnabled: videoConstraints.isOpened && !isVideoError,
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
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	if (action.payload.kind === 'videoinput') {
		if (videoConstraints.isOpened) {
			if (videoConstraints.isOpened) {
				try {
					yield call(getUserVideo, { video: videoConstraints });
				} catch (e) {
					if (e === 'NO_VIDEO') {
						yield put(CallActions.closeVideoStatusAction());
					}
				}
			}

			if (videoSender) {
				videoSender?.replaceTrack(tracks.videoTracks[0]);
			} else {
				if (tracks.videoTracks[0]) {
					videoSender = peerConnection?.addTrack(tracks.videoTracks[0]) as RTCRtpSender;
				}
			}

			stopScreenSharingTracks();
		} else if (tracks.videoTracks.length > 0) {
			stopVideoTracks();
			if (videoSender) {
				try {
					peerConnection?.removeTrack(videoSender);
				} catch (e) {
					console.warn(e);
				}
				videoSender = null;
			}
		}

		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		yield put(CallActions.gotDevicesInfoAction({ kind: 'videoinput', devices: videoDevices }));

		if (!videoConstraints.deviceId && videoDevices[0]) {
			yield put(
				CallActions.changeActiveDeviceIdAction({ kind: 'videoinput', deviceId: videoDevices[0].deviceId }),
			);
		}
	}
	if (action.payload.kind === 'audioinput') {
		if (audioConstraints.isOpened) {
			try {
				yield call(getUserAudio, {
					audio: audioConstraints,
				});
			} catch (e) {
				if (e === 'NO_AUDIO') {
					yield put(CallActions.closeAudioStatusAction());
				}
			}

			if (tracks.audioTracks.length >= 0) {
				audioSender?.replaceTrack(tracks.audioTracks[0]);
			}
		} else {
			tracks.audioTracks.forEach((track) => track.stop());
			tracks.audioTracks = [];
			audioSender?.replaceTrack(null);
		}
	}
}

export function* changeScreenSharingStatus(): SagaIterator {
	const screenSharingState = yield select((state: RootState) => state.calls.isScreenSharingOpened);
	let isErrorPresent = false;

	if (screenSharingState) {
		try {
			yield call(getUserDisplay);
		} catch (e) {
			if (e === 'NO_DISPLAY') {
				yield put(CallActions.closeScreenShareStatusAction());
				isErrorPresent = true;
			}
		}

		stopVideoTracks();

		if (!isErrorPresent) {
			if (videoSender) {
				videoSender?.replaceTrack(tracks.screenSharingTracks[0]);
			} else {
				if (tracks.screenSharingTracks[0]) {
					videoSender = peerConnection?.addTrack(tracks.screenSharingTracks[0]) as RTCRtpSender;
				}
			}

			yield spawn(trackEndedWatcher);
		} else {
			if (videoSender) {
				try {
					peerConnection?.removeTrack(videoSender);
				} catch (e) {
					console.warn(e);
				}
				videoSender = null;
			}
		}
	} else if (tracks.screenSharingTracks.length > 0) {
		stopScreenSharingTracks();

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
	while (true) {
		const action = yield take(channel);
		if (action === true) {
			stopScreenSharingTracks();

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
		const onEnd = () => {
			emit(true);
			emit(END);
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
	} else if (isCallActive) {
		const interlocutorId: number = action.payload.caller.id;

		const request = {
			interlocutorId,
		};

		const httpRequest = CallsHttpRequests.cancelCall;
		httpRequest.call(yield call(() => httpRequest.generator(request)));
	}
}

export function* switchDeviceSaga(action: ReturnType<typeof CallActions.switchDeviceAction>): SagaIterator {
	const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
	const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);

	if (action.payload.kind === 'audioinput' && audioConstraints.isOpened) {
		try {
			yield call(getUserAudio, { audio: audioConstraints });
		} catch (e) {
			if (e === 'NO_AUDIO') {
				yield put(CallActions.closeAudioStatusAction());
			}
		}

		if (tracks.audioTracks.length >= 0) {
			audioSender?.replaceTrack(tracks.audioTracks[0]);
		}
	}

	if (action.payload.kind === 'videoinput' && videoConstraints.isOpened) {
		try {
			yield call(getUserVideo, { video: videoConstraints });
		} catch (e) {
			if (e === 'NO_VIDEO') {
				yield put(CallActions.closeVideoStatusAction());
			}
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
		const action = yield take(channel);
		console.log(action);
		const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
		const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
		const prevAudioDevices = yield select((state: RootState) => state.calls.audioDevicesList);

		if (prevAudioDevices.length === 0) {
			console.log(prevAudioDevices);
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
