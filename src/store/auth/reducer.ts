import { createReducer } from 'typesafe-actions';

import { RefreshTokenFailure } from '@store/auth/features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from '@store/auth/features/refresh-token/refresh-token-success';

import { AuthService } from '../../services/auth-service';

import { IAuthState } from './auth-state';
import { Logout } from './features/logout/logout';
import { RefreshToken } from './features/refresh-token/refresh-token';

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: IAuthState = {
  loading: false,
  isAuthenticated: Boolean(securityTokens),
  securityTokens,
  refreshTokenRequestLoading: false,
  deviceId: authService.deviceId,
};

const reducer = createReducer<IAuthState>(initialState)
  .handleAction(Logout.action, Logout.reducer)
  .handleAction(RefreshToken.action, RefreshToken.reducer)
  .handleAction(RefreshTokenSuccess.action, RefreshTokenSuccess.reducer)
  .handleAction(RefreshTokenFailure.action, RefreshTokenFailure.reducer);

export default reducer;
