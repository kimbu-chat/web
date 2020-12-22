import { Page } from '../common/models';
import { InterlocutorAcceptedCallIntegrationEvent } from '../middlewares/websockets/integration-events/interlocutor-accepted-call-integration-event';
import { UserPreview } from '../my-profile/models';
import { InputType } from './common/enums/input-type';

export interface CallState {
  isActiveCallIncoming?: boolean;
  isInterlocutorVideoEnabled: boolean;
  isInterlocutorBusy: boolean;
  interlocutor?: UserPreview;
  amICalled: boolean;
  amICaling: boolean;
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
  calls: CallList;
}

export interface Call {
  id: number;
  userInterlocutor: UserPreview;
  userCallerId: number;
  duration: number;
  status: CallStatus;
}

export interface CallList {
  calls: Call[];
  hasMore: boolean;
  loading: boolean;
}

export interface GetCallsApiRequest {
  page: Page;
}

export enum CallStatus {
  Negotiating = 'Negotiating',
  Active = 'Active',
  Ended = 'Ended',
  Cancelled = 'Cancelled',
  Declined = 'Declined',
  NotAnswered = 'NotAnswered',
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

export interface EndCallActionPayload {
  seconds: number;
}

export interface IncomingCallActionPayload {
  caller: UserPreview;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}

export interface OutgoingCallActionPayload {
  calling: UserPreview;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}

export interface AcceptIncomingCallActionPayload {
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}

export interface InterlocutorAcceptedCallActionPayload extends InterlocutorAcceptedCallIntegrationEvent {}

export interface CandidateActionPayload {
  candidate: RTCIceCandidate;
}

export interface GotMediaDevicesInfoActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  devices: MediaDeviceInfo[];
}

export interface ChangeMediaStatusActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
}

export interface SwitchDeviceActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  deviceId: string;
}

// Http requests

export interface CandidateApiRequest {
  interlocutorId: number;
  candidate: RTCIceCandidate;
}

export interface CallApiRequest {
  userInterlocutorId: number;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}

export interface RenegociateApiRequest {
  interlocutorId: number;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}

export interface CancelCallApiRequest {
  interlocutorId: number;
}

export interface DeclineCallApiRequest {
  interlocutorId: number;
}

export interface EndCallApiRequest {
  interlocutorId: number;
}

export interface AcceptCallApiRequest {
  userInterlocutorId: number;
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}
