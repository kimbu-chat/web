import { RootState } from '../root-reducer';

export const getMyIdSelector = (state: RootState): number => {
	return state.myProfile.user?.id || -1;
};
