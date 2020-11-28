import { SecurityTokens } from './models';
import { RootState } from '../root-reducer';

export const selectSecurityTokens = (state: RootState): SecurityTokens => state.auth?.securityTokens;
