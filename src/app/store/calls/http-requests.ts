import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';

import { ApiBasePath } from '../root-api';
import { IEndCall, ICandidate, ICall, ICancelCall, IAcceptCall } from './models';

export const CallsHttpRequests = {
	endCall: httpRequestFactory<AxiosResponse, IEndCall>(
		`${ApiBasePath.NotificationsApi}/api/calls/end-call`,
		HttpRequestMethod.Post,
	),
	candidate: httpRequestFactory<AxiosResponse, ICandidate>(
		`${ApiBasePath.NotificationsApi}/api/calls/candidate`,
		HttpRequestMethod.Post,
	),
	call: httpRequestFactory<AxiosResponse, ICall>(
		`${ApiBasePath.NotificationsApi}/api/calls/call`,
		HttpRequestMethod.Post,
	),
	cancelCall: httpRequestFactory<AxiosResponse, ICancelCall>(
		`${ApiBasePath.NotificationsApi}​/api/calls/cancel-call`,
		HttpRequestMethod.Post,
	),
	acceptCall: httpRequestFactory<AxiosResponse, IAcceptCall>(
		`${ApiBasePath.NotificationsApi}/api/calls/accept-call`,
		HttpRequestMethod.Post,
	),
};
