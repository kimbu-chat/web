import { INormalizedCall } from './common/models';

interface ICallList {
  callIds: number[];
  hasMore: boolean;
  loading: boolean;
}

export interface ICallsState {
  isActiveCallIncoming?: boolean;
  isIncomingCallVideoEnbaled?: boolean;
  isInterlocutorVideoEnabled: boolean;
  isInterlocutorAudioEnabled: boolean;
  isInterlocutorBusy: boolean;
  interlocutorId?: number;
  amICalled: boolean;
  amICalling: boolean;
  isSpeaking: boolean;
  isCallAccepted: boolean;
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

  calls: Record<number, INormalizedCall>;
  callList: ICallList;
  searchCallList: ICallList;
}
