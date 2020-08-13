import { CallActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { call, select, takeLatest, put } from 'redux-saga/effects';
import { getMyProfileSelector } from '../my-profile/selectors';
import { UserPreview } from '../my-profile/models';
import { CallsHttpRequests } from './http-requests';
import { peerConnection } from '../middlewares/webRTC/peerConnection';
import { RootState } from '../root-reducer';

export function* resetUnreadMessagesCountSaga(action: ReturnType<typeof CallActions.outgoingCallAction>): SagaIterator {
	const interlocutorId = action.payload.calling.id;
	const myProfile: UserPreview = yield select(getMyProfileSelector);
	let offer: RTCSessionDescriptionInit;
	const createOffer = async () => {
		offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);
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

	console.log('call canceled');

	const request = {
		interlocutorId,
	};

	console.log(request);
	const httpRequest = CallsHttpRequests.cancelCall;
	httpRequest.call(yield call(() => httpRequest.generator(request)));

	yield put(CallActions.cancelCallSuccessAction());
}

export function* acceptCallSaga(): SagaIterator {
	const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
	const offer: RTCSessionDescriptionInit = yield select((state: RootState) => state.calls.offer);
	let answer: RTCSessionDescriptionInit;
	const createAnswer = async () => {
		peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
		answer = await peerConnection.createAnswer();

		await peerConnection.setLocalDescription(answer);
	};
	yield call(createAnswer);

	console.log('offer accepted' + offer);

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
		await peerConnection.setRemoteDescription(remoteDesc);
	};
	console.log('answer registered' + action.payload.answer);
	yield call(processAnswer);
}

export function* candidateSaga(action: ReturnType<typeof CallActions.candidateAction>): SagaIterator {
	const processCandidate = async () => {
		console.log(action.payload.candidate);
		await peerConnection.addIceCandidate(new RTCIceCandidate(action.payload.candidate));
	};
	console.log('candidate in saga');
	yield call(processCandidate);
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
	takeLatest(CallActions.outgoingCallAction, resetUnreadMessagesCountSaga),
	takeLatest(CallActions.cancelCallAction, cancelCallSaga),
	takeLatest(CallActions.acceptCallAction, acceptCallSaga),
	takeLatest(CallActions.interlocutorAcceptedCallAction, callAcceptedSaga),
	takeLatest(CallActions.candidateAction, candidateSaga),
	takeLatest(CallActions.myCandidateAction, myCandidateSaga),
];
