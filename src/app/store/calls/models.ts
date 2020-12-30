import { IPage } from '../common/models';
import { IInterlocutorAcceptedCallIntegrationEvent } from '../middlewares/websockets/integration-events/interlocutor-accepted-call-integration-event';
import { IUserPreview } from '../my-profile/models';
import { InputType } from './common/enums/input-type';

export interface ICallState {
  isActiveCallIncoming?: boolean;
  isIncomingCallVideoEnbaled?: boolean;
  isInterlocutorVideoEnabled: boolean;
  isInterlocutorBusy: boolean;
  interlocutor?: IUserPreview;
  amICalled: boolean;
  amICalling: boolean;
  isSpeaking: boolean;
  videoConstraints: {
    isOpened: boolean;
    width?: { min: number; ideal: number; max: number };
    height?: { min: number; ideal: number; max: number };
    deviceId?: string;
  };
  audioConstraints: {
    isOpened: boolean;
    deviceId?: string;
  };
  isScreenSharingOpened: boolean;
  audioDevicesList: MediaDeviceInfo[];
  videoDevicesList: MediaDeviceInfo[];
  calls: ICallList;
}

export interface ICall {
  id: number;
  userInterlocutor: IUserPreview;
  userCallerId: number;
  duration: number;
  status: CallStatus;
}

export interface ICallList {
  calls: ICall[];
  hasMore: boolean;
  loading: boolean;
}

export interface IGetCallsApiRequest {
  page: IPage;
}

export enum CallStatus {
  Negotiating = 'Negotiating',
  Active = 'Active',
  Ended = 'Ended',
  Cancelled = 'Cancelled',
  Declined = 'Declined',
  NotAnswered = 'NotAnswered',
  Interrupted = 'Interrupted',
}
export interface ICompleteConstraints {
  video: {
    isOpened: boolean;
    width?: { min: number; ideal: number; max: number };
    height?: { min: number; ideal: number; max: number };
    deviceId?: string;
  };
  audio: {
    isOpened: boolean;
    deviceId?: string;
  };
}
export interface IInCompleteConstraints {
  video?: {
    isOpened: boolean;
    width?: { min: number; ideal: number; max: number };
    height?: { min: number; ideal: number; max: number };
    deviceId?: string;
  };
  audio?: {
    isOpened: boolean;
    deviceId?: string;
  };
}

export interface IEndCallActionPayload {
  seconds: number;
}

export interface IncomingCallActionPayload {
  caller: IUserPreview;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}

export interface IOutgoingCallActionPayload {
  calling: IUserPreview;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}

export interface IAcceptIncomingCallActionPayload {
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}

export interface IInterlocutorAcceptedCallActionPayload extends IInterlocutorAcceptedCallIntegrationEvent {}

export interface ICandidateActionPayload {
  candidate: RTCIceCandidate;
}

export interface IGotMediaDevicesInfoActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  devices: MediaDeviceInfo[];
}

export interface IChangeMediaStatusActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
}

export interface ISwitchDeviceActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  deviceId: string;
}

// Http requests

export interface ICandidateApiRequest {
  interlocutorId: number;
  candidate: RTCIceCandidate;
}

export interface ICallApiRequest {
  userInterlocutorId: number;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}

export interface ICallApiResponse {
  isInterlocutorBusy: boolean;
}

export interface IRenegociateApiRequest {
  interlocutorId: number;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}

export interface ICancelCallApiRequest {
  interlocutorId: number;
}

export interface IDeclineCallApiRequest {
  interlocutorId: number;
}

export interface IEndCallApiRequest {
  interlocutorId: number;
}

export interface IAcceptCallApiRequest {
  userInterlocutorId: number;
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}
