import { RootState } from '../root-reducer';
import { UserPreview } from '../my-profile/models';

export const getCallInterlocutorSelector = (state: RootState): UserPreview | undefined => state.calls.interlocutor;

export const amICalled = (state: RootState): boolean => state.calls.amICalled;

export const amICaling = (state: RootState): boolean => state.calls.amICaling;

export const doIhaveCall = (state: RootState): boolean => state.calls.isSpeaking;
