import { RootState } from '../root-reducer';
import { UserPreview } from '../my-profile/models';

export const getCallInterlocutorSelector = (state: RootState): UserPreview | undefined => state.calls.interlocutor;

export const getCallInterlocutorIdSelector = (state: RootState): number | undefined => state.calls.interlocutor?.id;

export const amICalled = (state: RootState): boolean => state.calls.amICalled;

export const amICaling = (state: RootState): boolean => state.calls.amICaling;

export const doIhaveCall = (state: RootState): boolean => state.calls.isSpeaking;

export const getVideoConstraints = (state: RootState) => state.calls.videoConstraints;

export const getAudioConstraints = (state: RootState) => state.calls.audioConstraints;

export const getIsActiveCallIncoming = (state: RootState) => state.calls.isActiveCallIncoming;

export const getIsInterlocutorVideoEnabled = (state: RootState) => state.calls.isInterlocutorVideoEnabled;

export const getIsInterlocutorBusy = (state: RootState) => state.calls.isInterlocutorBusy;

export const getIsScreenSharingEnabled = (state: RootState) => state.calls.isScreenSharingOpened;

export const getIsAudioEnabled = (state: RootState) => state.calls.audioConstraints.isOpened;

export const getIsVideoEnabled = (state: RootState) => state.calls.videoConstraints.isOpened;

export const getAudioDevices = (state: RootState) => state.calls.audioDevicesList;

export const getVideoDevices = (state: RootState) => state.calls.videoDevicesList;

export const getCallsList = (state: RootState) => state.calls.calls.calls;

export const getCallsAreLoading = (state: RootState) => state.calls.calls.loading;

export const gethasMoreCalls = (state: RootState) => state.calls.calls.hasMore;
