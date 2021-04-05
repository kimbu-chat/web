import { IUser } from '../common/models';
import { ICall } from './common/models/call';

export interface ICallsState {
  isActiveCallIncoming?: boolean;
  isIncomingCallVideoEnbaled?: boolean;
  isInterlocutorVideoEnabled: boolean;
  isInterlocutorAudioEnabled: boolean;
  isInterlocutorBusy: boolean;
  interlocutor?: IUser;
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
  calls: {
    calls: ICall[];
    hasMore: boolean;
    loading: boolean;
  };
}
