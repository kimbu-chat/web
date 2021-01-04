import { IPage } from '../common/models';
import { IUserPreview } from '../my-profile/models';

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

interface ICallList {
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
