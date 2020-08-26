import { RootState } from '../root-reducer';
import { UserPreview } from '../my-profile/models';

export const getCallInterlocutorSelector = (state: RootState): UserPreview | undefined => {
	return state.calls.interlocutor;
};

export const isCallingMe = (state: RootState): boolean => {
	return state.calls.isCalling;
};

export const amCallingI = (state: RootState): boolean => {
	return state.calls.amCalling;
};

export const doIhaveCall = (state: RootState): boolean => {
	return state.calls.isSpeaking;
};

export const isFullScreen = (state: RootState): boolean => {
	return state.calls.isFullScreen;
};
