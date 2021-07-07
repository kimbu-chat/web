import { RootState } from 'typesafe-actions';

import { ISecurityTokens } from './common/models';

export const securityTokensSelector = (state: RootState): ISecurityTokens | undefined =>
  state.auth?.securityTokens;

export const authenticatedSelector = (state: RootState): boolean => state.auth.isAuthenticated;

export const authLoadingSelector = (state: RootState): boolean => state.auth.loading;

export const deviceIdSelector = (state: RootState) => state.auth.deviceId;
