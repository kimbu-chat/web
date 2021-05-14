import { ById } from '@store/chats/models/by-id';

import { INormalizedCall } from './common/models/call';

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
  isAcceptPending: boolean;
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

  calls: ById<INormalizedCall>;
  callList: ICallList;
  searchCallList: ICallList;
}
