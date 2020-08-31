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
	declineCall: httpRequestFactory<AxiosResponse, DeclineCallApiRequest>(
		`${ApiBasePath.NotificationsApi}​/api/calls/decline-call`,
		HttpRequestMethod.Post,
	),
	acceptCall: httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(
		`${ApiBasePath.NotificationsApi}/api/calls/accept-call`,
		HttpRequestMethod.Post,
	),
};
