import { RootState } from 'typesafe-actions';

import { IUser } from '../common/models';

export const getCallInterlocutorSelector = (state: RootState): IUser | undefined =>
  state.users.users[state.calls.interlocutorId || -1];

export const getCallInterlocutorIdSelector = (state: RootState): number | undefined =>
  state.calls.interlocutorId;

export const amICalledSelector = (state: RootState): boolean => state.calls.amICalled;

export const amICallingSelector = (state: RootState): boolean => state.calls.amICalling;

export const doIhaveCallSelector = (state: RootState): boolean => state.calls.isSpeaking;

export const getVideoConstraintsSelector = (state: RootState) => state.calls.videoConstraints;

export const getAudioConstraintsSelector = (state: RootState) => state.calls.audioConstraints;

export const getIsActiveCallIncomingSelector = (state: RootState) =>
  state.calls.isActiveCallIncoming;

export const getIsCallAcceptedSelector = (state: RootState) => state.calls.isCallAccepted;

export const getIsIncomingCallVideoEnabledSelector = (state: RootState) =>
  state.calls.isIncomingCallVideoEnbaled;

export const getIsInterlocutorVideoEnabledSelector = (state: RootState) =>
  state.calls.isInterlocutorVideoEnabled;

export const getIsInterlocutorAudioEnabledSelector = (state: RootState) =>
  state.calls.isInterlocutorAudioEnabled;

export const getIsInterlocutorBusySelector = (state: RootState) => state.calls.isInterlocutorBusy;

export const getIsScreenSharingEnabledSelector = (state: RootState) =>
  state.calls.isScreenSharingOpened;

export const getIsVideoEnabledSelector = (state: RootState) =>
  state.calls.videoConstraints.isOpened;

export const getAudioDevicesSelector = (state: RootState) => state.calls.audioDevicesList;

export const getVideoDevicesSelector = (state: RootState) => state.calls.videoDevicesList;

export const getCallsListSelector = (state: RootState) => state.calls.callList;
export const getSearchCallsListSelector = (state: RootState) => state.calls.searchCallList;
export const getCallSelector = (callId: number) => (state: RootState) => state.calls.calls[callId];
