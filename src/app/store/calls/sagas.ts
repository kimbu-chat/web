import { CallActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { call, select, takeLatest, put, takeEvery } from 'redux-saga/effects';
import { getMyProfileSelector } from '../my-profile/selectors';
import { UserPreview } from '../my-profile/models';
import { CallsHttpRequests } from './http-requests';
import { peerConnection, peerConfiguration } from '../middlewares/webRTC/peerConnection';
import { RootState } from '../root-reducer';
import { IConstraints } from './models';
import { doIhaveCall } from './selectors';

let localMediaStream: MediaStream;
let videoTracks: MediaStreamTrack[], audioTracks: MediaStreamTrack[];
let videoSender: RTCRtpSender, audioSender: RTCRtpSender;

const getUserMedia = async (constraints: IConstraints) => {
	try {
		localMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
	} catch {
		alert('No device found, sorry...');
	}
	console.log(constraints);

	if (localMediaStream) {
		videoTracks = localMediaStream.getVideoTracks();
		audioTracks = localMediaStream.getAudioTracks();

		if (videoTracks.length > 0) {
			videoSender = peerConnection.connection.addTrack(videoTracks[0], localMediaStream);
			console.log('Track sent', videoTracks[0]);
		}
		if (audioTracks.length > 0) {
			audioSender = peerConnection.connection.addTrack(audioTracks[0], localMediaStream);
			console.log('Track sent', audioTracks[0]);
		}
	}
};

export function* outgoingCallSaga(action: ReturnType<typeof CallActions.outgoingCallAction>): SagaIterator {
	//setup local stream
	yield call(getUserMedia, action.payload.constraints);
	//---

	const interlocutorId = action.payload.calling.id;
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	let offer: RTCSessionDescriptionInit = yield call(
		async () =>
			await peerConnection.connection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
	);
	yield call(async () => await peerConnection.connection.setLocalDescription(offer));

	const request = {
		//@ts-ignore
		offer,
		interlocutorId,
		caller: myProfile,
	};

	const httpRequest = CallsHttpRequests.call;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	yield put(CallActions.outgoingCallSuccessAction(action.payload));
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

	if (localMediaStream) {
		const tracks = localMediaStream.getTracks();
		tracks.forEach((track) => track.stop());
	}

	yield put(CallActions.cancelCallSuccessAction());
}

export function* callEndedSaga(): SagaIterator {
	peerConnection.connection.close();
	peerConnection.connection = new RTCPeerConnection(peerConfiguration);

	if (localMediaStream) {
		localMediaStream.getTracks().forEach((track) => track.stop());
	}
}

export function* acceptCallSaga(action: ReturnType<typeof CallActions.acceptCallAction>): SagaIterator {
	//setup local stream
	yield call(getUserMedia, action.payload.constraints);
	//---
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const offer: RTCSessionDescriptionInit = yield select((state: RootState) => state.calls.offer);

	peerConnection.connection.setRemoteDescription(new RTCSessionDescription(offer));
	const answer = yield call(async () => await peerConnection.connection.createAnswer());
	yield call(async () => await peerConnection.connection.setLocalDescription(answer));

	const request = {
		interlocutorId,
		//@ts-ignore
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
			await peerConnection.connection.addIceCandidate(new RTCIceCandidate(action.payload.candidate));
			clearInterval(checkIntervalCode);
		}
	}, 100);
}

export function* myCandidateSaga(action: ReturnType<typeof CallActions.myCandidateAction>): SagaIterator {
	const request = {
		interlocutorId: action.payload.interlocutorId,
		candidate: action.payload.candidate,
	};
	const httpRequest = CallsHttpRequests.candidate;
	httpRequest.call(yield call(() => httpRequest.generator(request)));
}

export function* changeAudioStatusSaga(): SagaIterator {
	const videoState = yield select((state: RootState) => state.calls.isVideoOpened);
	const audioState = yield select((state: RootState) => state.calls.isAudioOpened);

	if (audioState) {
		if (audioTracks.length <= 0) {
			localMediaStream.getTracks().forEach((track) => track.stop());

			localMediaStream = yield call(
				async () =>
					await navigator.mediaDevices.getUserMedia({
						video: videoState,
						audio: audioState,
					}),
			);

			videoTracks = localMediaStream.getVideoTracks();
			audioTracks = localMediaStream.getAudioTracks();

			if (videoState) {
				videoSender = peerConnection.connection.addTrack(videoTracks[0], localMediaStream);
			}
		}

		audioSender = peerConnection.connection.addTrack(audioTracks[0], localMediaStream);

		console.log('Track sent', audioTracks[0]);
	} else if (audioSender) {
		peerConnection.connection.removeTrack(audioSender);
	}
	yield put(CallActions.enableMediaSwitching());
}

export function* changeVideoStatusSaga(): SagaIterator {
	const videoState = yield select((state: RootState) => state.calls.isVideoOpened);
	const audioState = yield select((state: RootState) => state.calls.isAudioOpened);

	localMediaStream.getTracks().forEach((track) => track.stop());

	if (videoState) {
		if (videoTracks.length <= 0) {
			localMediaStream.getTracks().forEach((track) => track.stop());

			localMediaStream = yield call(
				async () =>
					await navigator.mediaDevices.getUserMedia({
						video: videoState,
						audio: audioState,
					}),
			);

			videoTracks = localMediaStream.getVideoTracks();
			audioTracks = localMediaStream.getAudioTracks();

			if (audioState) {
				try {
					audioSender = peerConnection.connection.addTrack(audioTracks[0], localMediaStream);
				} catch {}
			}
		}

		videoSender = peerConnection.connection.addTrack(videoTracks[0], localMediaStream);

		console.log('Track sent', videoTracks[0]);
	} else if (videoSender) {
		peerConnection.connection.removeTrack(videoSender);
	}
	yield put(CallActions.enableMediaSwitching());
}

export function* negociateSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	const isCallActive: boolean = yield select(doIhaveCall);
	if (isCallActive) {
		let offer: RTCSessionDescriptionInit;
		offer = yield call(
			async () =>
				await peerConnection.connection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
		);
		yield call(async () => await peerConnection.connection.setLocalDescription(offer));

		const request = {
			//@ts-ignore
			offer,
			interlocutorId,
			caller: myProfile,
		};

		const httpRequest = CallsHttpRequests.call;
		httpRequest.call(yield call(() => httpRequest.generator(request)));
	}
}

export function* negociationSaga(action: ReturnType<typeof CallActions.incomingCallAction>): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const isCallActive: boolean = yield select(doIhaveCall);

	if (isCallActive && interlocutorId === action.payload.caller.id) {
		let answer: RTCSessionDescriptionInit;

		peerConnection.connection.setRemoteDescription(new RTCSessionDescription(action.payload.offer));
		answer = yield call(async () => await peerConnection.connection.createAnswer());
		yield call(async () => await peerConnection.connection.setLocalDescription(answer));

		const request = {
			interlocutorId,
			//@ts-ignore
			answer,
		};

		const httpRequest = CallsHttpRequests.acceptCall;
		httpRequest.call(yield call(() => httpRequest.generator(request)));
	}
}

export const CallsSagas = [
	takeLatest(CallActions.outgoingCallAction, outgoingCallSaga),
	takeLatest(CallActions.cancelCallAction, cancelCallSaga),
	takeLatest(CallActions.acceptCallAction, acceptCallSaga),
	takeLatest(CallActions.interlocutorAcceptedCallAction, callAcceptedSaga),
	takeLatest(CallActions.candidateAction, candidateSaga),
	takeEvery(CallActions.myCandidateAction, myCandidateSaga),
	takeLatest(CallActions.interlocutorCanceledCallAction, callEndedSaga),
	takeLatest(CallActions.changeAudioStatus, changeAudioStatusSaga),
	takeLatest(CallActions.changeVideoStatus, changeVideoStatusSaga),
	takeLatest(CallActions.negociate, negociateSaga),
	takeLatest(CallActions.incomingCallAction, negociationSaga),
];
