import { RootState } from '../root-reducer';

export const getInternetStateSelector = (state: RootState): boolean => {
	return state.internet.isInternetConnected;
};
