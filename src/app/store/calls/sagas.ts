import { CallActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { call, select, takeLatest, put } from 'redux-saga/effects';
import { getMyProfileSelector } from '../my-profile/selectors';
import { UserPreview } from '../my-profile/models';
import { CallsHttpRequests } from './http-requests';
import { peerConnection, peerConfiguration } from '../middlewares/webRTC/peerConnection';
import { RootState } from '../root-reducer';

export function* outgoingCallSaga(action: ReturnType<typeof CallActions.outgoingCallAction>): SagaIterator {
	//setup local stream
	const constraints = {
		video: action.payload.constraints.video,
		audio: action.payload.constraints.audio,
	};

	navigator.mediaDevices
		.getUserMedia(constraints)
		.then((stream) => {
			const localStream = stream;
			localStream.getTracks().forEach((track) => {
				peerConnection.connection.addTrack(track, localStream);
				console.log(track);
			});
		})
		.catch((error) => {
			console.error('Error accessing media devices.', error);
		});
	//---

	const interlocutorId = action.payload.calling.id;
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	let offer: RTCSessionDescriptionInit;
	const createOffer = async () => {
		offer = await peerConnection.connection.createOffer();
		await peerConnection.connection.setLocalDescription(offer);
	};
	yield call(createOffer);

	const request = {
		//@ts-ignore
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

	yield put(CallActions.cancelCallSuccessAction());
}

export function* callEndedSaga(): SagaIterator {
	peerConnection.connection.close();
	peerConnection.connection = new RTCPeerConnection(peerConfiguration);
}

export function* acceptCallSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const offer: RTCSessionDescriptionInit = yield select((state: RootState) => state.calls.offer);
	let answer: RTCSessionDescriptionInit;
	const createAnswer = async () => {
		peerConnection.connection.setRemoteDescription(new RTCSessionDescription(offer));
		answer = await peerConnection.connection.createAnswer();

		await peerConnection.connection.setLocalDescription(answer);
	};
	yield call(createAnswer);

	const request = {
		interlocutorId,
		//@ts-ignore
		answer,
	};

	const httpRequest = CallsHttpRequests.acceptCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));
}

export function* callAcceptedSaga(action: ReturnType<typeof CallActions.interlocutorAcceptedCallAction>): SagaIterator {
	const processAnswer = async () => {
		const remoteDesc = new RTCSessionDescription(action.payload.answer);
		await peerConnection.connection.setRemoteDescription(remoteDesc);
	};
	yield call(processAnswer);
}

export function* candidateSaga(action: ReturnType<typeof CallActions.candidateAction>): SagaIterator {
	const processCandidate = async () => {
		await peerConnection.connection.addIceCandidate(new RTCIceCandidate(action.payload.candidate));
	};

	const checkIntervalCode = setInterval(() => {
		if (peerConnection.connection.remoteDescription?.type) {
			processCandidate();
			console.log('interval success check');
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

export const CallsSagas = [
	takeLatest(CallActions.outgoingCallAction, outgoingCallSaga),
	takeLatest(CallActions.cancelCallAction, cancelCallSaga),
	takeLatest(CallActions.acceptCallAction, acceptCallSaga),
	takeLatest(CallActions.interlocutorAcceptedCallAction, callAcceptedSaga),
	takeLatest(CallActions.candidateAction, candidateSaga),
	takeLatest(CallActions.myCandidateAction, myCandidateSaga),
	takeLatest(CallActions.interlocutorCanceledCallAction, callEndedSaga),
];
