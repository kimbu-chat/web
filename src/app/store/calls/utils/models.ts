import { CallStatus, IUserPreview } from '../../models';

export interface ICallsState {
  isActiveCallIncoming?: boolean;
  isIncomingCallVideoEnbaled?: boolean;
  isInterlocutorVideoEnabled: boolean;
  isInterlocutorBusy: boolean;
  interlocutor?: IUserPreview;
  amICalledSelector: boolean;
  amICallingSelector: boolean;
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

interface ICallList {
  calls: ICall[];
  hasMore: boolean;
  loading: boolean;
}

export interface ICall {
  id: number;
  userInterlocutor: IUserPreview;
  userCallerId: number;
  duration: number;
  status: CallStatus;
}
