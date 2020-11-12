import { SecurityTokens } from './models';
import { RootState } from '../root-reducer';

export const selectSecurityTokens = (state: RootState): SecurityTokens => {
	return state.auth?.securityTokens;
};
