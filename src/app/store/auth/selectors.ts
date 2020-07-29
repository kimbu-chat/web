
import { SecurityTokens } from '../auth/types';
import { RootState } from '../root-reducer';

export const selectSecurityTokens = (state: RootState): SecurityTokens => {
	return state.auth?.securityTokens;
};
