import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';

import { ApiBasePath } from '../root-api';
import {
	EndCallApiRequest,
	CandidateApiRequest,
	CallApiRequest,
	CancelCallApiRequest,
	AcceptCallApiRequest,
	DeclineCallApiRequest,
	CallNotAnsweredApiRequest,
	Call,
	GetCallsApiRequest,
} from './models';

export const CallsHttpRequests = {
	endCall: httpRequestFactory<AxiosResponse, EndCallApiRequest>(
		`${ApiBasePath.NotificationsApi}/api/calls/end-call`,
		HttpRequestMethod.Post,
	),
	candidate: httpRequestFactory<AxiosResponse, CandidateApiRequest>(
		`${ApiBasePath.NotificationsApi}/api/calls/candidate`,
		HttpRequestMethod.Post,
	),
	call: httpRequestFactory<AxiosResponse, CallApiRequest>(
		`${ApiBasePath.NotificationsApi}/api/calls/call`,
		HttpRequestMethod.Post,
	),
	cancelCall: httpRequestFactory<AxiosResponse, CancelCallApiRequest>(
		`${ApiBasePath.NotificationsApi}​/api/calls/cancel-call`,
		HttpRequestMethod.Post,
	),
	callNotAnswered: httpRequestFactory<AxiosResponse, CallNotAnsweredApiRequest>(
		`${ApiBasePath.NotificationsApi}​/api/calls/call-not-answered`,
		HttpRequestMethod.Post,
	),
	declineCall: httpRequestFactory<AxiosResponse, DeclineCallApiRequest>(
		`${ApiBasePath.NotificationsApi}​/api/calls/decline-call`,
		HttpRequestMethod.Post,
	),
	acceptCall: httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(
		`${ApiBasePath.NotificationsApi}/api/calls/accept-call`,
		HttpRequestMethod.Post,
	),
	busyCall: httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(
		`${ApiBasePath.NotificationsApi}/api/calls/call-busy`,
		HttpRequestMethod.Post,
	),
	getCalls: httpRequestFactory<AxiosResponse<Call[]>, GetCallsApiRequest>(
		`${ApiBasePath.MainApi}/api/calls/search`,
		HttpRequestMethod.Post,
	),
};
