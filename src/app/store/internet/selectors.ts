import { RootState } from '../root-reducer';

export const getInternetStateSelector = (state: RootState): boolean => state.internet.isInternetConnected;
